// pages/api/convert-and-zip.ts

import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { Fields, Files } from "formidable";
import sharp from "sharp";
import archiver from "archiver";
import { PassThrough } from "stream";
import PersistentFile from "formidable/PersistentFile";

// Disable the default body parser
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "POST") {
        res.status(405).send("Method not allowed");
        return;
    }

    const form = formidable({});

    form.parse(req, async (err, fields: Fields, filesObject: Files) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error parsing form data" });
            return;
        }

        // Get the format from fields
        const formatField = fields.format;
        const format =
            Array.isArray(formatField) && formatField.length > 0
                ? formatField[0]
                : formatField;

        if (
            !format ||
            !["jpg", "png", "webp", "gif", "avif"].includes(format.toString().toLowerCase())
        ) {
            res.status(400).json({ error: "Invalid format" });
            return;
        }

        // Ensure filesObject.files is always an array
        const files = filesObject.files;

        let filesArray: any[];

        if (Array.isArray(files)) {
            filesArray = files;
        } else if (files) {
            filesArray = [files];
        } else {
            filesArray = [];
        }

        if (filesArray.length === 0) {
            res.status(400).json({ error: "No files uploaded" });
            return;
        } else if (filesArray.length === 1) {
            // Single file uploaded
            const file = filesArray[0];

            try {
                const convertedImage = await sharp(file.filepath)
                    .toFormat(format as keyof sharp.FormatEnum)
                    .toBuffer();

                // Generate a new filename with the desired extension
                const ext = format === "jpeg" ? "jpg" : format;
                const originalFilename = file.originalFilename || "image";
                const fileName = `${originalFilename.split(".")[0]}.${ext}`;

                // Set response headers for file download
                res.setHeader("Content-Type", `image/${ext}`);
                res.setHeader(
                    "Content-Disposition",
                    `attachment; filename="${fileName}"`,
                );

                // Send the converted image
                res.send(convertedImage);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Error processing image" });
            }
        } else {
            // Multiple files uploaded, proceed with ZIP
            try {
                const archive = archiver("zip", {
                    zlib: { level: 9 },
                });

                // Handle archive errors
                archive.on("error", (err) => {
                    console.error(err);
                    res.status(500).json({ error: "Error creating zip archive" });
                });

                // Set response headers for file download
                res.setHeader("Content-Type", "application/zip");
                res.setHeader(
                    "Content-Disposition",
                    "attachment; filename=converted_images.zip",
                );

                // Pipe the archive data to the response
                archive.pipe(res);

                let promises = filesArray.map(async (file: any) => {
                    const originalFilename = file.originalFilename || "image";

                    const convertedImage = await sharp(file.filepath)
                        .toFormat(format as keyof sharp.FormatEnum)
                        .toBuffer();

                    // Generate a new filename with the desired extension
                    const ext = format === "jpeg" ? "jpg" : format;
                    const fileName = `${originalFilename.split(".")[0]}.${ext}`;

                    // Append the converted image to the ZIP archive
                    archive.append(convertedImage, { name: fileName });
                });

                await Promise.all(promises);

                await archive.finalize();
                // No need to call res.end() here because archiver will handle the stream
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Error processing images" });
            }
        }
    });
}
