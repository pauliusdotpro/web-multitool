import {useState, useEffect} from 'react'
import Head from 'next/head'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Slider} from "@/components/ui/slider"
import {Switch} from "@/components/ui/switch"
import {Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter} from "@/components/ui/card"
import {Clipboard, RefreshCw, Info} from 'lucide-react'
import {useToast} from "@/hooks/use-toast"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"

export default function PasswordGenerator() {
    const [password, setPassword] = useState('')
    const [length, setLength] = useState(12)
    const [includeUppercase, setIncludeUppercase] = useState(true)
    const [includeLowercase, setIncludeLowercase] = useState(true)
    const [includeNumbers, setIncludeNumbers] = useState(true)
    const [includeSymbols, setIncludeSymbols] = useState(true)
    const [error, setError] = useState('')
    const {toast} = useToast()

    const generatePassword = () => {
        let charset = ''
        if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
        if (includeNumbers) charset += '0123456789'
        if (includeSymbols) charset += '!@#$%^&*()_+{}[]|:;<>,.?/~'

        if (charset === '') {
            setError('Please select at least one character type.')
            setPassword('')
            return
        }

        setError('')

        const array = new Uint32Array(length)
        crypto.getRandomValues(array)

        let newPassword = ''
        for (let i = 0; i < length; i++) {
            newPassword += charset[array[i] % charset.length]
        }
        setPassword(newPassword)
    }

    useEffect(() => {
        generatePassword()
    }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols])

    const copyToClipboard = () => {
        if (password) {
            navigator.clipboard.writeText(password)
            toast({
                title: "Copied!",
                description: "Password copied to clipboard",
            })
        }
    }

    const calculateStrength = () => {
        if (!password) return 0
        let strength = 0
        if (length > 8) strength++
        if (length > 12) strength++
        if (includeUppercase) strength++
        if (includeLowercase) strength++
        if (includeNumbers) strength++
        if (includeSymbols) strength++
        return strength
    }

    const strengthColor = () => {
        const strength = calculateStrength()
        if (strength <= 2) return 'bg-red-500'
        if (strength <= 4) return 'bg-yellow-500'
        return 'bg-green-500'
    }

    return (
        <>
            <Head>
                <title>Password Generator - Multitool Website</title>
                <meta name="description" content="Generate secure passwords with custom options using Web Crypto API"/>
            </Head>
            <div className="container mx-auto py-8">
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Password Generator</CardTitle>
                        <CardDescription>Create a secure password with custom options</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="flex items-center space-x-2">
                            <Input
                                value={password}
                                readOnly
                                className="flex-grow"
                                placeholder="Generated password"
                            />
                            <Button onClick={copyToClipboard} size="icon" variant="outline" disabled={!password}>
                                <Clipboard className="h-4 w-4"/>
                            </Button>
                            <Button onClick={generatePassword} size="icon">
                                <RefreshCw className="h-4 w-4"/>
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="length">Length: {length}</Label>
                                <Slider
                                    id="length"
                                    min={6}
                                    max={30}
                                    step={1}
                                    value={[length]}
                                    onValueChange={(value) => setLength(value[0])}
                                    className="w-2/3"
                                />
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                                <div
                                    className={`h-full ${strengthColor()} transition-all duration-300 ease-in-out`}
                                    style={{width: `${(calculateStrength() / 6) * 100}%`}}
                                ></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="uppercase">Include Uppercase</Label>
                                <Switch
                                    id="uppercase"
                                    checked={includeUppercase}
                                    onCheckedChange={setIncludeUppercase}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="lowercase">Include Lowercase</Label>
                                <Switch
                                    id="lowercase"
                                    checked={includeLowercase}
                                    onCheckedChange={setIncludeLowercase}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="numbers">Include Numbers</Label>
                                <Switch
                                    id="numbers"
                                    checked={includeNumbers}
                                    onCheckedChange={setIncludeNumbers}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="symbols">Include Symbols</Label>
                                <Switch
                                    id="symbols"
                                    checked={includeSymbols}
                                    onCheckedChange={setIncludeSymbols}
                                />
                            </div>
                        </div>
                        <Button onClick={generatePassword} className="w-full">
                            Generate Password
                        </Button>
                    </CardContent>
                    <CardFooter className="flex items-center justify-center text-sm text-gray-500">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex items-center">
                                        <Info className="h-4 w-4 mr-1"/>
                                        Using Web Crypto API for secure generation
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>This password generator uses the Web Crypto API to ensure cryptographically
                                        secure random number generation.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}