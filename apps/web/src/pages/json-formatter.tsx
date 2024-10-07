import {useState} from 'react'
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Switch} from "@/components/ui/switch"
import {Label} from "@/components/ui/label"
import {AlertCircle, CheckCircle} from "lucide-react"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"

export default function JSONFormatter() {
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [indentType, setIndentType] = useState('2')
    const [sortKeys, setSortKeys] = useState(false)
    const [error, setError] = useState('')
    const [isValid, setIsValid] = useState<boolean | null>(null)

    const validateJSON = () => {
        try {
            JSON.parse(input)
            setIsValid(true)
            setError('')
        } catch (err) {
            setIsValid(false)
            setError('Invalid JSON: ' + (err as Error).message)
        }
    }

    const formatJSON = () => {
        try {
            const parsed = JSON.parse(input)
            let indent: string | number = Number(indentType)
            if (indentType === 'tab') {
                indent = '\t'
            }
            const formatted = JSON.stringify(parsed, sortKeys ? Object.keys(parsed).sort() : null, indent)
            setOutput(formatted)
            setError('')
            setIsValid(true)
        } catch (err) {
            setError('Invalid JSON: ' + (err as Error).message)
            setOutput('')
            setIsValid(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value)
        setError('')
        setIsValid(null)
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-center">JSON Formatter and Validator</h1>
            <div className="grid gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Input JSON</CardTitle>
                        <CardDescription>Paste your JSON here</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Paste your JSON here"
                            className="min-h-[200px]"
                            value={input}
                            onChange={handleInputChange}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Formatting Options</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="indent-type">Indent Type</Label>
                            <Select value={indentType} onValueChange={setIndentType}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select indent type"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2">2 spaces</SelectItem>
                                    <SelectItem value="4">4 spaces</SelectItem>
                                    <SelectItem value="8">8 spaces</SelectItem>
                                    <SelectItem value="tab">Tab</SelectItem>
                                    <SelectItem value="0">No indentation</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="sort-keys">Sort Object Keys</Label>
                            <Switch
                                id="sort-keys"
                                checked={sortKeys}
                                onCheckedChange={setSortKeys}
                            />
                        </div>
                    </CardContent>
                </Card>
                <div className="flex gap-4">
                    <Button onClick={validateJSON} className="flex-1">Validate JSON</Button>
                    <Button onClick={formatJSON} className="flex-1">Format JSON</Button>
                </div>
                {isValid !== null && (
                    <Alert variant={isValid ? "default" : "destructive"}>
                        {isValid ? (
                            <CheckCircle className="h-4 w-4"/>
                        ) : (
                            <AlertCircle className="h-4 w-4"/>
                        )}
                        <AlertTitle>{isValid ? "Valid JSON" : "Invalid JSON"}</AlertTitle>
                        <AlertDescription>
                            {isValid
                                ? "Your JSON is valid and can be formatted."
                                : error
                            }
                        </AlertDescription>
                    </Alert>
                )}
                {output && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Formatted JSON</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                className="min-h-[200px] font-mono"
                                value={output}
                                readOnly
                            />
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}