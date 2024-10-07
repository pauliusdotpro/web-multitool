import {useState} from 'react'
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {Label} from "@/components/ui/label"
import {Switch} from "@/components/ui/switch"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {AlertCircle} from "lucide-react"
import {xml2json, json2xml} from 'xml-js'

export default function XmlJsonConverter() {
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [conversionType, setConversionType] = useState('xmlToJson')
    const [indentType, setIndentType] = useState('2')
    const [error, setError] = useState('')

    // Shared options
    const [compact, setCompact] = useState(false)
    const [ignoreDeclaration, setIgnoreDeclaration] = useState(false)
    const [ignoreInstruction, setIgnoreInstruction] = useState(false)
    const [ignoreAttributes, setIgnoreAttributes] = useState(false)
    const [ignoreComment, setIgnoreComment] = useState(false)
    const [ignoreCdata, setIgnoreCdata] = useState(false)
    const [ignoreDoctype, setIgnoreDoctype] = useState(false)
    const [ignoreText, setIgnoreText] = useState(false)

    // XML to JSON specific options
    const [trim, setTrim] = useState(false)
    const [nativeType, setNativeType] = useState(false)
    const [nativeTypeAttributes, setNativeTypeAttributes] = useState(false)
    const [addParent, setAddParent] = useState(false)
    const [alwaysArray, setAlwaysArray] = useState(false)
    const [alwaysChildren, setAlwaysChildren] = useState(false)
    const [instructionHasAttributes, setInstructionHasAttributes] = useState(false)

    // JSON to XML specific options
    const [fullTagEmptyElement, setFullTagEmptyElement] = useState(false)
    const [indentCdata, setIndentCdata] = useState(false)
    const [indentAttributes, setIndentAttributes] = useState(false)

    const handleConvert = () => {
        setError('')
        try {
            const commonOptions = {
                compact,
                spaces: indentType === 'tab' ? '\t' : Number(indentType),
                ignoreDeclaration,
                ignoreInstruction,
                ignoreAttributes,
                ignoreComment,
                ignoreCdata,
                ignoreDoctype,
                ignoreText,
            }

            if (conversionType === 'xmlToJson') {
                const xmlToJsonOptions = {
                    ...commonOptions,
                    trim,
                    nativeType,
                    nativeTypeAttributes,
                    addParent,
                    alwaysArray,
                    alwaysChildren,
                    instructionHasAttributes,
                }
                const result = xml2json(input, xmlToJsonOptions)
                setOutput(result)
            } else {
                const jsonToXmlOptions = {
                    ...commonOptions,
                    fullTagEmptyElement,
                    indentCdata,
                    indentAttributes,
                }
                const result = json2xml(input, jsonToXmlOptions)
                setOutput(result)
            }
        } catch (err) {
            setError('Error during conversion. Please check your input and try again.')
        }
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>XML ⇄ JSON Converter</CardTitle>
                    <CardDescription>Convert between XML and JSON formats with customizable options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="input">Input</Label>
                            <Textarea
                                id="input"
                                placeholder="Enter your XML or JSON here"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="h-64"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="output">Output</Label>
                            <Textarea
                                id="output"
                                value={output}
                                readOnly
                                className="h-64"
                            />
                        </div>
                    </div>

                    <RadioGroup value={conversionType} onValueChange={setConversionType} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="xmlToJson" id="xmlToJson"/>
                            <Label htmlFor="xmlToJson">XML to JSON</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="jsonToXml" id="jsonToXml"/>
                            <Label htmlFor="jsonToXml">JSON to XML</Label>
                        </div>
                    </RadioGroup>

                    <Tabs defaultValue="general" className="w-full">
                        <TabsList>
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="advanced">Advanced</TabsTrigger>
                        </TabsList>
                        <TabsContent value="general" className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="compact"
                                        checked={compact}
                                        onCheckedChange={setCompact}
                                    />
                                    <Label htmlFor="compact">Compact Mode</Label>
                                </div>
                                {conversionType === 'xmlToJson' && (
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="trim"
                                            checked={trim}
                                            onCheckedChange={setTrim}
                                        />
                                        <Label htmlFor="trim">Trim Whitespace</Label>
                                    </div>
                                )}
                                {conversionType === 'xmlToJson' && (
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="nativeType"
                                            checked={nativeType}
                                            onCheckedChange={setNativeType}
                                        />
                                        <Label htmlFor="nativeType">Native Type Conversion</Label>
                                    </div>
                                )}
                                {conversionType === 'jsonToXml' && (
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="fullTagEmptyElement"
                                            checked={fullTagEmptyElement}
                                            onCheckedChange={setFullTagEmptyElement}
                                        />
                                        <Label htmlFor="fullTagEmptyElement">Full Tag for Empty Elements</Label>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Label htmlFor="indentType">Indentation:</Label>
                                <Select value={indentType} onValueChange={setIndentType}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select indentation"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">No indentation</SelectItem>
                                        <SelectItem value="2">2 spaces</SelectItem>
                                        <SelectItem value="4">4 spaces</SelectItem>
                                        <SelectItem value="8">8 spaces</SelectItem>
                                        <SelectItem value="tab">Tab</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>
                        <TabsContent value="advanced" className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {conversionType === 'xmlToJson' && (
                                    <>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="nativeTypeAttributes"
                                                checked={nativeTypeAttributes}
                                                onCheckedChange={setNativeTypeAttributes}
                                            />
                                            <Label htmlFor="nativeTypeAttributes">Native Type Attributes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="addParent"
                                                checked={addParent}
                                                onCheckedChange={setAddParent}
                                            />
                                            <Label htmlFor="addParent">Add Parent</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="alwaysArray"
                                                checked={alwaysArray}
                                                onCheckedChange={setAlwaysArray}
                                            />
                                            <Label htmlFor="alwaysArray">Always Array</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="alwaysChildren"
                                                checked={alwaysChildren}
                                                onCheckedChange={setAlwaysChildren}
                                            />
                                            <Label htmlFor="alwaysChildren">Always Children</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="instructionHasAttributes"
                                                checked={instructionHasAttributes}
                                                onCheckedChange={setInstructionHasAttributes}
                                            />
                                            <Label htmlFor="instructionHasAttributes">Instruction Has Attributes</Label>
                                        </div>
                                    </>
                                )}
                                {conversionType === 'jsonToXml' && (
                                    <>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="indentCdata"
                                                checked={indentCdata}
                                                onCheckedChange={setIndentCdata}
                                            />
                                            <Label htmlFor="indentCdata">Indent CDATA</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="indentAttributes"
                                                checked={indentAttributes}
                                                onCheckedChange={setIndentAttributes}
                                            />
                                            <Label htmlFor="indentAttributes">Indent Attributes</Label>
                                        </div>
                                    </>
                                )}
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="ignoreDeclaration"
                                        checked={ignoreDeclaration}
                                        onCheckedChange={setIgnoreDeclaration}
                                    />
                                    <Label htmlFor="ignoreDeclaration">Ignore Declaration</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="ignoreInstruction"
                                        checked={ignoreInstruction}
                                        onCheckedChange={setIgnoreInstruction}
                                    />
                                    <Label htmlFor="ignoreInstruction">Ignore Instruction</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="ignoreAttributes"
                                        checked={ignoreAttributes}
                                        onCheckedChange={setIgnoreAttributes}
                                    />
                                    <Label htmlFor="ignoreAttributes">Ignore Attributes</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="ignoreComment"
                                        checked={ignoreComment}
                                        onCheckedChange={setIgnoreComment}
                                    />
                                    <Label htmlFor="ignoreComment">Ignore Comments</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="ignoreCdata"
                                        checked={ignoreCdata}
                                        onCheckedChange={setIgnoreCdata}
                                    />
                                    <Label htmlFor="ignoreCdata">Ignore CDATA</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="ignoreDoctype"
                                        checked={ignoreDoctype}
                                        onCheckedChange={setIgnoreDoctype}
                                    />
                                    <Label htmlFor="ignoreDoctype">Ignore Doctype</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="ignoreText"
                                        checked={ignoreText}
                                        onCheckedChange={setIgnoreText}
                                    />
                                    <Label htmlFor="ignoreText">Ignore Text</Label>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleConvert} className="w-full">Convert</Button>
                </CardFooter>
            </Card>

            {error && (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>
    )
}