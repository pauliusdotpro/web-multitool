"use client"

import { useState, useEffect } from 'react'

export default function FollowMeOnX() {
    const [isVisible, setIsVisible] = useState(false)
    const [isRainbow, setIsRainbow] = useState(false)

    useEffect(() => {
        const showTimer = setTimeout(() => setIsVisible(true), 2000)
        return () => clearTimeout(showTimer)
    }, [])

    useEffect(() => {
        const rainbowInterval = setInterval(() => {
            setIsRainbow(true)
            setTimeout(() => setIsRainbow(false), 5000) // Rainbow effect lasts for 5 seconds
        }, 30000) // Rainbow effect occurs every 30 seconds

        return () => clearInterval(rainbowInterval)
    }, [])

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 transition-all duration-500 ease-in-out ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
            }`}
        >
            <a
                href="https://x.com/pauliusdotpro"
                target="_blank"
                rel="noopener noreferrer"
                className={`
          group flex items-center space-x-2 px-4 py-2 
          font-semibold rounded-md shadow-lg 
          transition-all duration-200 ease-in-out 
          relative overflow-hidden
          ${isRainbow
                    ? 'text-white animate-gradient-x bg-gradient-to-r from-purple-500 via-pink-500 to-red-500'
                    : 'bg-black hover:bg-gray-900 text-white'
                }
          animate-pulse
        `}
                style={{
                    minHeight: '44px',
                    minWidth: '180px',
                    animation: `${isRainbow ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, gradient 5s linear infinite' : 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'}`,
                }}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 flex-shrink-0 fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="whitespace-nowrap">Follow @pauliusdotpro</span>
                <span
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 ease-in-out"
                    aria-hidden="true"
                ></span>
            </a>
        </div>
    )
}