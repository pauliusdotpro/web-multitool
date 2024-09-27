import {useState, useMemo, CSSProperties} from 'react'
import {Textarea} from "@/components/ui/textarea"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ScrollArea} from "@/components/ui/scroll-area"

export default function TextCounter() {
    const [text, setText] = useState('')

    const stats = useMemo(() => {
        const characterCount = text.length
        const wordCount = text.trim().split(/\s+/).filter(Boolean).length
        const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length
        const paragraphCount = text.split(/\n+/).filter(Boolean).length
        const spaceCount = text.split(' ').length - 1

        // Letter density
        const letterCounts: Record<string, number> = {}
        const letters = text.toLowerCase().replace(/[^a-z]/g, '')
        for (const letter of letters) {
            letterCounts[letter] = (letterCounts[letter] || 0) + 1
        }
        const letterDensity = Object.entries(letterCounts)
            .map(([letter, count]) => ({
                letter,
                count,
                percentage: (count / letters.length * 100).toFixed(2)
            }))
            .sort((a, b) => b.count - a.count)

        // Word density
        const wordCounts: Record<string, number> = {}
        const words = text.toLowerCase().match(/\b\w+\b/g) || []
        for (const word of words) {
            wordCounts[word] = (wordCounts[word] || 0) + 1
        }
        const wordDensity = Object.entries(wordCounts)
            .map(([word, count]) => ({
                word,
                count,
                percentage: (count / words.length * 100).toFixed(2)
            }))
            .sort((a, b) => b.count - a.count)

        return {
            characterCount,
            wordCount,
            sentenceCount,
            paragraphCount,
            spaceCount,
            letterDensity,
            wordDensity
        }
    }, [text])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Text Analysis Tool</h1>
            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <Textarea
                        placeholder="Type or paste your text here..."
                        className="min-h-[300px]"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div className="grid gap-4 content-start">
                    <Card>
                        <CardHeader>
                            <CardTitle>Text Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                <li className="flex justify-between">
                                    <span>Characters:</span>
                                    <span className="font-semibold">{stats.characterCount}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Words:</span>
                                    <span className="font-semibold">{stats.wordCount}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Sentences:</span>
                                    <span className="font-semibold">{stats.sentenceCount}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Paragraphs:</span>
                                    <span className="font-semibold">{stats.paragraphCount}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Spaces:</span>
                                    <span className="font-semibold">{stats.spaceCount}</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Density Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="letters">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="letters">Letter Density</TabsTrigger>
                                    <TabsTrigger value="words">Word Density</TabsTrigger>
                                </TabsList>
                                <TabsContent value="letters">
                                    <ScrollArea className="h-[200px]">
                                        <table className="w-full">
                                            <thead>
                                            <tr>
                                                <th className="text-left">Letter</th>
                                                <th className="text-right">Count</th>
                                                <th className="text-right">Percentage</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {stats.letterDensity.map(({letter, count, percentage}) => (
                                                <tr key={letter}>
                                                    <td>{letter}</td>
                                                    <td className="text-right">{count}</td>
                                                    <td className="text-right">{percentage}%</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </ScrollArea>
                                </TabsContent>
                                <TabsContent value="words">
                                    <ScrollArea className="h-[200px]">
                                        <table className="w-full">
                                            <thead>
                                            <tr>
                                                <th className="text-left">Word</th>
                                                <th className="text-right">Count</th>
                                                <th className="text-right">Percentage</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {stats.wordDensity.map(({word, count, percentage}) => (
                                                <tr key={word}>
                                                    <td>{word}</td>
                                                    <td className="text-right">{count}</td>
                                                    <td className="text-right">{percentage}%</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </ScrollArea>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}