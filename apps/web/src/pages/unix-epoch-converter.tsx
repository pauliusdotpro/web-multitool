import React, {useState} from 'react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {AlertCircle} from "lucide-react"

export default function UnixEpochConverter() {
    const [unixTimestamp, setUnixTimestamp] = useState('')
    const [dateTime, setDateTime] = useState('')
    const [convertedUnix, setConvertedUnix] = useState('')
    const [convertedDateTime, setConvertedDateTime] = useState('')
    const [error, setError] = useState('')

    const convertToDateTime = () => {
        setError('')
        setConvertedDateTime('')
        if (unixTimestamp.trim() === '') {
            setError('Please enter a Unix timestamp.')
            return
        }
        try {
            const timestamp = parseInt(unixTimestamp)
            if (isNaN(timestamp)) {
                throw new Error('Invalid Unix timestamp')
            }
            const date = new Date(timestamp * 1000)
            setConvertedDateTime(date.toISOString())
        } catch (error) {
            setError('Invalid Unix timestamp')
        }
    }

    const convertToUnix = () => {
        setError('')
        setConvertedUnix('')
        if (dateTime.trim() === '') {
            setError('Please enter a date and time.')
            return
        }
        try {
            const timestamp = Math.floor(new Date(dateTime).getTime() / 1000)
            if (isNaN(timestamp)) {
                throw new Error('Invalid date/time')
            }
            setConvertedUnix(timestamp.toString())
        } catch (error) {
            setError('Invalid date/time')
        }
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Unix Epoch Converter</CardTitle>
                    <CardDescription>Convert between Unix timestamps and human-readable dates</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="toDateTime" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="toDateTime">Unix to Date/Time</TabsTrigger>
                            <TabsTrigger value="toUnix">Date/Time to Unix</TabsTrigger>
                        </TabsList>
                        <TabsContent value="toDateTime">
                            <div className="space-y-4">
                                <Input
                                    type="text"
                                    placeholder="Enter Unix timestamp"
                                    value={unixTimestamp}
                                    onChange={(e) => setUnixTimestamp(e.target.value)}
                                    className="transition-all duration-300 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary"
                                />
                                <Button
                                    onClick={convertToDateTime}
                                    className="w-full transition-all duration-300 hover:bg-primary/90 focus:ring-2 focus:ring-primary"
                                >
                                    Convert to Date/Time
                                </Button>
                                {convertedDateTime && (
                                    <Input
                                        type="text"
                                        value={convertedDateTime}
                                        readOnly
                                        className="bg-muted"
                                    />
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="toUnix">
                            <div className="space-y-4">
                                <Input
                                    type="datetime-local"
                                    value={dateTime}
                                    onChange={(e) => setDateTime(e.target.value)}
                                    className="transition-all duration-300 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary"
                                />
                                <Button
                                    onClick={convertToUnix}
                                    className="w-full transition-all duration-300 hover:bg-primary/90 focus:ring-2 focus:ring-primary"
                                >
                                    Convert to Unix Timestamp
                                </Button>
                                {convertedUnix && (
                                    <Input
                                        type="text"
                                        value={convertedUnix}
                                        readOnly
                                        className="bg-muted"
                                    />
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                    {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-muted-foreground">
                        Note: Unix timestamps are in seconds since January 1, 1970 (UTC).
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}