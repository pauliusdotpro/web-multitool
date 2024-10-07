import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'
type AuthType = 'No Auth' | 'Bearer Token' | 'Basic Auth' | 'Custom'

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']
const AUTH_TYPES: AuthType[] = ['No Auth', 'Bearer Token', 'Basic Auth', 'Custom']

interface ApiResponse {
    status: number
    statusText: string
    headers: Record<string, string>
    data: any
}

interface ErrorResponse {
    error: string
}

type Response = ApiResponse | ErrorResponse

const ApiTester: React.FC = () => {
    const [url, setUrl] = useState<string>('')
    const [method, setMethod] = useState<HttpMethod>('GET')
    const [headers, setHeaders] = useState<string>('')
    const [authType, setAuthType] = useState<AuthType>('No Auth')
    const [authValue, setAuthValue] = useState<string>('')
    const [body, setBody] = useState<string>('')
    const [response, setResponse] = useState<Response | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const handleSendRequest = async () => {
        setLoading(true)
        try {
            const requestOptions: RequestInit = {
                method,
                headers: {
                    ...JSON.parse(headers || '{}'),
                    ...(authType === 'Bearer Token' && { 'Authorization': `Bearer ${authValue}` }),
                    ...(authType === 'Basic Auth' && { 'Authorization': `Basic ${btoa(authValue)}` }),
                    ...(authType === 'Custom' && { 'Authorization': authValue }),
                },
                ...(method !== 'GET' && method !== 'HEAD' && { body }),
            }

            const res = await fetch(url, requestOptions)
            const data = await res.json()
            setResponse({
                status: res.status,
                statusText: res.statusText,
                headers: Object.fromEntries(res.headers.entries()),
                data,
            })
        } catch (error) {
            setResponse({
                error: (error as Error).message,
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold">API Tester</h1>
            <div className="flex space-x-2">
                <Input
                    placeholder="Enter API URL"
                    value={url}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                    className="flex-grow"
                />
                <Select value={method} onValueChange={(value: HttpMethod) => setMethod(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                        {HTTP_METHODS.map((m) => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={handleSendRequest} disabled={loading}>
                    {loading ? 'Sending...' : 'Send Request'}
                </Button>
            </div>

            <Tabs defaultValue="headers">
                <TabsList>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                    <TabsTrigger value="auth">Authorization</TabsTrigger>
                    <TabsTrigger value="body">Body</TabsTrigger>
                </TabsList>
                <TabsContent value="headers">
                    <Textarea
                        placeholder="Enter headers as JSON"
                        value={headers}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setHeaders(e.target.value)}
                        className="min-h-[200px]"
                    />
                </TabsContent>
                <TabsContent value="auth">
                    <div className="space-y-2">
                        <Select value={authType} onValueChange={(value: AuthType) => setAuthType(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select auth type" />
                            </SelectTrigger>
                            <SelectContent>
                                {AUTH_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {authType !== 'No Auth' && (
                            <Input
                                placeholder={authType === 'Bearer Token' ? 'Enter token' : 'Enter auth value'}
                                value={authValue}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthValue(e.target.value)}
                            />
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="body">
                    <Textarea
                        placeholder="Enter request body"
                        value={body}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)}
                        className="min-h-[200px]"
                    />
                </TabsContent>
            </Tabs>

            <Card>
                <CardHeader>
                    <CardTitle>Response</CardTitle>
                    <CardDescription>API response details</CardDescription>
                </CardHeader>
                <CardContent>
                    {response ? (
                        <div className="space-y-2">
                            {'error' in response ? (
                                <div className="text-red-500">{response.error}</div>
                            ) : (
                                <>
                                    <div>Status: {response.status} {response.statusText}</div>
                                    <div>
                                        <Label>Headers:</Label>
                                        <pre className="bg-gray-100 p-2 rounded">
                      {JSON.stringify(response.headers, null, 2)}
                    </pre>
                                    </div>
                                    <div>
                                        <Label>Body:</Label>
                                        <pre className="bg-gray-100 p-2 rounded">
                      {JSON.stringify(response.data, null, 2)}
                    </pre>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="text-gray-500">No response yet</div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default ApiTester