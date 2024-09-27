import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { Loader2, X } from "lucide-react"

export default function ImageConverter() {
    const [files, setFiles] = useState<File[]>([])
    const [format, setFormat] = useState<string>('jpeg')
    const [isConverting, setIsConverting] = useState(false)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles])
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        }
    })

    const removeFile = (index: number) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
    }

    const handleConvert = async () => {
        if (files.length === 0) {
            toast({
                title: "No files selected",
                description: "Please select at least one image file to convert.",
                variant: "destructive",
            })
            return
        }

        setIsConverting(true)

        const formData = new FormData()
        files.forEach((file) => formData.append('files', file))
        formData.append('format', format)

        try {
            const response = await fetch('/api/convert-images', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Conversion failed')
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url

            if (files.length === 1) {
                link.download = `${files[0].name.split(".")[0]}.${format}`
            } else {
                link.download = `converted_images.zip`
            }

            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            console.error('Error converting images:', error)
            toast({
                title: "Conversion failed",
                description: "An error occurred while converting the images. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsConverting(false)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Image Converter</h1>
            <div className="space-y-6">
                <div>
                    <Label htmlFor="image-upload">Upload Images</Label>
                    <div
                        {...getRootProps()}
                        className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                            isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
                        }`}
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <p>Drop the files here ...</p>
                        ) : (
                            <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
                        )}
                    </div>
                </div>
                {files.length > 0 && (
                    <div>
                        <Label>Selected Files:</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-2">
                            {files.map((file, index) => (
                                <div key={index} className="relative group">
                                    <Image
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        width={200}
                                        height={200}
                                        className="w-full h-40 object-cover rounded-lg"
                                    />
                                    <div
                                        className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="text-white hover:text-red-500 transition-colors"
                                        >
                                            <X size={24}/>
                                        </button>
                                    </div>
                                    <p className="mt-1 text-sm truncate">{file.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div>
                    <Label>Convert to:</Label>
                    <RadioGroup value={format} onValueChange={setFormat} className="flex flex-wrap gap-4 mt-2">
                        {['jpg', 'png', 'webp', 'gif', 'avif'].map((f) => (
                            <div key={f} className="flex items-center space-x-2">
                                <RadioGroupItem value={f} id={f}/>
                                <Label htmlFor={f}>{f.toUpperCase()}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                <Button onClick={handleConvert} disabled={isConverting || files.length === 0}>
                    {isConverting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            Converting...
                        </>
                    ) : (
                        'Convert Images'
                    )}
                </Button>
            </div>
        </div>
    )
}