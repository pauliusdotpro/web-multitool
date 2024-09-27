"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { QrCode, FileText, Menu } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
    { name: 'QR Code', href: '/qr-code', icon: QrCode },
    { name: 'Text Analysis', href: '/text-analysis', icon: FileText },
    { name: 'Unix Epoch Converter', href: '/unix-epoch-converter', icon: FileText },
    { name: 'Image Converter', href: '/image-converter', icon: FileText },
]

interface SidebarProps {
    children: React.ReactNode
}

export default function Sidebar({ children }: SidebarProps) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-center p-4 border-b">
                <a
                    href="https://x.com/pauliusdotpro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 mr-2">
                        <g>
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                        </g>
                    </svg>
                    <span className="text-sm font-bold text-black">@pauliusdotpro</span>
                </a>
            </div>
            <nav className="flex-1 p-4">
                {navItems.map((item) => {
                    const isActive = router.pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center py-2 px-4 rounded-lg mb-1",
                                isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                            onClick={() => setIsOpen(false)}
                        >
                            <item.icon className="h-5 w-5 mr-3" />
                            <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )

    return (
        <div className="flex h-screen overflow-hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-40">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent
                    side="left"
                    className="w-[240px] sm:w-[300px] p-0 bg-white"
                >
                    <SidebarContent />
                </SheetContent>
            </Sheet>

            <div className="hidden lg:block w-64 bg-white border-r">
                <SidebarContent />
            </div>

            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    )
}