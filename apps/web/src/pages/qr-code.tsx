"use client"

import { useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { toPng } from 'html-to-image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Download } from "lucide-react"

const frames = {
    none: { border: "none", padding: "0" },
    simple: { border: "4px solid black", padding: "16px" },
    rounded: { border: "4px solid black", borderRadius: "15px", padding: "16px" },
    fancy: {
        border: "8px solid black",
        borderRadius: "15px",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        padding: "16px"
    },
    neon: {
        border: "4px solid #00ff00",
        boxShadow: "0 0 10px #00ff00, inset 0 0 10px #00ff00",
        padding: "16px",
        background: "rgba(0, 255, 0, 0.1)"
    },
    vintage: {
        border: "8px solid #8B4513",
        borderImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjMtMDYtMjNUMTU6MTg6NDctMDc6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTA2LTIzVDE1OjIwOjMyLTA3OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzLTA2LTIzVDE1OjIwOjMyLTA3OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmYmMzMWNhOS01OWE4LTQzZWUtYThhYy1hNjg5ZmQ5MzhlMzMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ZDU1ODUwNzAtOTRkOS00ODZhLWEwMjYtNDhlNjI5OTRlZDVjIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZDU1ODUwNzAtOTRkOS00ODZhLWEwMjYtNDhlNjI5OTRlZDVjIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkNTU4NTA3MC05NGQ5LTQ4NmEtYTAyNi00OGU2Mjk5NGVkNWMiIHN0RXZ0OndoZW49IjIwMjMtMDYtMjNUMTU6MTg6NDctMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmYmMzMWNhOS01OWE4LTQzZWUtYThhYy1hNjg5ZmQ5MzhlMzMiIHN0RXZ0OndoZW49IjIwMjMtMDYtMjNUMTU6MjA6MzItMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmeC6tgAAAXfSURBVHic7ZxbbBRVGMd/Z3d2y5ZSCBQK1Ap6QVBQWxWBQjDhUhKJYgAjIQIBEmOMiS8+mHDxEmN4wBivKKZEUbwgGEO4JYIGAyUQEFuILQW7FGjL7V52Z+bz4cB2uruUhTl7ZnfnlzSZnTmX/5n/fOc735wzyxhjKCGQchdQ6SgRKBGlAiUCJaJUoESUCpSIUoESUSpQIkoFSkSpQIkoFSgRpQIlolSgRJQKlIhSgRJRKlAiSgVKRKlAiSgVKBGlAiWiVKBElAqUiFKBElEqUCJKBUpEqUCJKBUoEaUCJaJUoESUCpSIUoESUSpQIkoFSkSpQIkoFSgRpQIlolSgRJQKlIhSgRJRKlAiSgVKRKlAiSgVKBGlAiWiVKBElAqUiFKBElEqUCJKBUpEqUCJKBUoEaUCJaJUoESUCpSIUoESUSpQIkoFSkSpQIkoFSgRpQIlolSgRJQKlIhSgRJRKlAiSgVKRKlAiSgVKBGlAiWiVKBElAqUiFKBElEqUCJKBUpEqUCJKBUoEaUCJaJUoESUCpSIUoESUSpQIkoFSkSpQIkoFSgRpQIlolSgRJQKlIhSgRJRKlAiSgVKRKlAiSgVKBGlAiWiVKBElAqUiFKBElEqUCJKBUpEqUCJKBUoEaUCJaJUoESUCpSIUoESUSpQIkoFSkSpQIkoFSgRpQIlolSgRJQKlIhSgRJRKlAiSgVKRKlAiSgVKBGlAiWiVKBElAqUiFKBElEqUCJKBUpEqUCJKBUoEaUCJaJUoESUCpSIUoESUSpQIkoFSkSpQIkoFSgRpQIlolSgRJQKlIhSgRJRKlAiSgVKRKlAiSgVKBGlAiWiVKBElAqUiFKBElEqUCJKBUpEqUCJKBUoEaUCJaJUoESUCpSIUoESUSpQIkoFSkSpQIkoFSgRpQIlolSgRJQKlIhSgRJRKlAiSgVKRKlAiSgVKBGlAiWiVKBElAqUiFKBElEqUCJKBUpEqUCJKBUoEaUCJaJUoESUCpSIUoESUSpQIkoFSkSpQIkoFSgRpQIlolSgRJQKlIhSgRJRKlAiSgVKRKlAiSgVKBGlAiWiVKBElAqUiFKBElEqUCJKBUpEqUCJKBUoEaUCJaJUoESUCpSIUoESUSpQIkoFSkSpQIkoFSgRpQIlolSgRJQKlIhSgRJRKlAiSgVKRKlAiSgVKBGlAiWiVKBElAqUiFKBElEqUCJKBUpEqUCJKBUoEaUCJaJUoESUCpSIUoESUSpQIkoFSkSpQIkoFSgRpQIlolSgRJQKlIhSgRJRKlAiSgVKRKlAiSgVKBGlAiWiVKBElAqUiFKBElEqUCJKBUpEqUCJKBUoEaUCJaJUoESUCpSIUoESUSpQIkoFSkSpQIkoFSgRpQIlolSgRJQKlIhSgRJRKlAiSgVKRKlAiSgVKBGlAiWiVKBElAqUiFKBElEqUCJKBUpEqUCJKBUoEaUCJaJUoESUCpSIUoESUSpQIkoFSkSpQIkoFSgRpQIlolSgRJQKlIhSgRJRKlAiSgVKRKlAiSgVKBGlAiWiVKBElAqUiFKBElEqUCJKBUpEqUCJKBUoEaUCJaJUoESUCpSIUoESUSpQIkoFSkSpQIkoFSgRpQIlolSgRJQKlIhSgRJRKlAiSgVKRKlAiSgVKBGlAiWiVKBElAqUiFKBElEqUCJKBUpEqUCJKBUoEaUCJaJUoESUCpSIUoESUSpQIkoFSkSpQIkoFSgRpQIlolSgRJQKlIhSgRJRKlAiSgVKRKlAiSgVKBGlAiWiVKBElAqUiFKBElEqUCJKBUpEqUCJKBUoEaUCJaJUoESUCpSIUoESUSpQIkoFSkSpQIkoFSgRpQIlolSgRJQKlIhSgRJRKlAiSgVKRKlAiSgVKBGlAiWiVKBElAqUiFKBElEqUCJKBUpEqU')",
        borderImageSlice: "30 30 30 30 fill",
        borderImageWidth: "20px",
        padding: "16px",
        background: "#FDF5E6"
    },
    polaroid: {
        border: "10px solid white",
        boxShadow: "0 0 5px rgba(0,0,0,0.1), 0 5px 10px rgba(0,0,0,0.2)",
        padding: "16px 16px 40px 16px",
        background: "white"
    }
}

export default function EnhancedQRCodeGenerator() {
    const [inputText, setInputText] = useState('')
    const [qrCodeText, setQRCodeText] = useState('')
    const [error, setError] = useState('')
    const [frame, setFrame] = useState('none')
    const qrCodeRef = useRef(null)

    const generateQRCode = () => {
        if (inputText.trim() === '') {
            setError('Please enter some text to generate a QR code.')
            setQRCodeText('')
        } else {
            setError('')
            setQRCodeText(inputText)
        }
    }

    const downloadQRCode = () => {
        if (qrCodeRef.current) {
            toPng(qrCodeRef.current, {
                cacheBust: true,
                backgroundColor: '#ffffff',
                width: 300,
                height: 300,
            })
                .then((dataUrl) => {
                    const link = document.createElement('a')
                    link.download = 'qrcode.png'
                    link.href = dataUrl
                    link.click()
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    // @ts-ignore
    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Enhanced QR Code Generator</CardTitle>
                    <CardDescription>Enter text to generate a QR code with custom frames</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Input
                            type="text"
                            placeholder="Enter text here"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="transition-all duration-300 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary"
                        />
                        <Select onValueChange={setFrame} defaultValue={frame}>
                            <SelectTrigger className="transition-all duration-300 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary">
                                <SelectValue placeholder="Select a frame" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">No Frame</SelectItem>
                                <SelectItem value="simple">Simple Frame</SelectItem>
                                <SelectItem value="rounded">Rounded Frame</SelectItem>
                                <SelectItem value="fancy">Fancy Frame</SelectItem>
                                <SelectItem value="neon">Neon Frame</SelectItem>
                                <SelectItem value="vintage">Vintage Frame</SelectItem>
                                <SelectItem value="polaroid">Polaroid Frame</SelectItem>
                            </SelectContent>
                        </Select>
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {qrCodeText && (
                            <div className="flex justify-center">
                                <div
                                    className="flex justify-center items-center bg-white transition-all duration-300"
                                    style={{
                                        ...frames[frame],
                                        width: '300px',
                                        height: '300px',
                                    }}
                                    ref={qrCodeRef}
                                >
                                    <QRCodeSVG
                                        value={qrCodeText}
                                        size={frame === 'none' ? 300 : 268}
                                        style={{ display: 'block' }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        onClick={generateQRCode}
                        className="transition-all duration-300 hover:bg-primary/90 focus:ring-2 focus:ring-primary"
                    >
                        Generate QR Code
                    </Button>
                    <Button
                        onClick={downloadQRCode}
                        disabled={!qrCodeText}
                        className="transition-all duration-300 hover:bg-primary/90 focus:ring-2 focus:ring-primary"
                    >
                        <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}