import {useState} from 'react'
import Head from 'next/head'
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ArrowDownUp} from 'lucide-react'

export default function Base64Converter() {
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [mode, setMode] = useState<'encode' | 'decode'>('encode')

    const handleConvert = () => {
        if (mode === 'encode') {
            setOutput(btoa(input))
        } else {
            try {
                setOutput(atob(input))
            } catch (error) {
                setOutput('Error: Invalid Base64 input')
            }
        }
    }

    const handleSwap = () => {
        setInput(output)
        setOutput('')
        setMode(mode === 'encode' ? 'decode' : 'encode')
    }

    return (
        <>
            <Head>
                <title>Base64 Converter | Multitool Website</title>
                <meta name="description" content="Convert text to Base64 and decode Base64 to text"/>
            </Head>
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6 text-center">Base64 Converter</h1>
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Convert Text to/from Base64</CardTitle>
                        <CardDescription>Enter your text or Base64 string and click the convert
                            button.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={mode} onValueChange={(value) => setMode(value as 'encode' | 'decode')}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="encode">Encode</TabsTrigger>
                                <TabsTrigger value="decode">Decode</TabsTrigger>
                            </TabsList>
                            <TabsContent value="encode">
                                <p className="text-sm text-muted-foreground mb-2">Enter text to convert to Base64</p>
                            </TabsContent>
                            <TabsContent value="decode">
                                <p className="text-sm text-muted-foreground mb-2">Enter Base64 to convert to text</p>
                            </TabsContent>
                        </Tabs>
                        <div className="space-y-4 mt-4">
                            <Textarea
                                placeholder={mode === 'encode' ? "Enter text here" : "Enter Base64 here"}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="min-h-[100px]"
                            />
                            <div className="flex justify-between items-center">
                                <Button onClick={handleConvert}>Convert</Button>
                                <Button variant="outline" size="icon" onClick={handleSwap}>
                                    <ArrowDownUp className="h-4 w-4"/>
                                    <span className="sr-only">Swap input and output</span>
                                </Button>
                            </div>
                            <Textarea
                                placeholder="Result will appear here"
                                value={output}
                                readOnly
                                className="min-h-[100px]"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}