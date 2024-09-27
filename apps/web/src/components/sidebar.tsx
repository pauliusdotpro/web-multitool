"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { QrCode, Image, FileText, Calculator, Settings, ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
    { name: 'QR Code', href: '/qr-code', icon: QrCode },
    /*{ name: 'Image Converter', href: '/image-converter', icon: Image },
    { name: 'Text Tools', href: '/text-tools', icon: FileText },
    { name: 'Calculator', href: '/calculator', icon: Calculator },
    { name: 'Settings', href: '/settings', icon: Settings },*/
]

export default function Sidebar() {
    const router = useRouter()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <div
            className={cn(
                "fixed left-0 top-0 z-40 h-screen bg-white transition-all duration-300 ease-in-out",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            <div className="flex h-full flex-col border-r">
                <div className="flex items-center justify-between p-4">
                    {!isCollapsed && (
                        <a
                            href="https://x.com/pauliusdotpro"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center"
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 mr-2">
                                <g>
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                                </g>
                            </svg>
                            <span className="text-sm font-bold text-black">@pauliusdotpro</span>
                        </a>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                </div>
                <nav className="flex-1 space-y-1 p-2">
                    {navItems.map((item) => {
                        const isActive = router.pathname === item.href
                        return (
                            <Button
                                key={item.name}
                                asChild
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start",
                                    isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                    isCollapsed ? "px-2" : "px-4"
                                )}
                            >
                                <Link href={item.href} className="flex items-center">
                                    <item.icon className={cn("h-5 w-5 flex-shrink-0", isCollapsed ? "mx-auto" : "mr-3")} />
                                    {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                                </Link>
                            </Button>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}