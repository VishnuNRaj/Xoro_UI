import { useState } from 'react'

interface PreloaderProps {
    gifSrc?: string
    text?: string
    duration?: number
    size?: 'sm' | 'md' | 'lg'
}

export default function Preloader({
    gifSrc,
    text = "Loading...",
    size = 'md'
}: PreloaderProps) {
    const [loading,] = useState(true)


    if (!loading) return null

    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-16 h-16',
        lg: 'w-24 h-24'
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface dark:bg-darken transition-opacity duration-300">
            <div className="text-center">
                <div className="mb-4">
                    <div className={`inline-block relative ${sizeClasses[size]} border-4 border-primary border-t-transparent rounded-full animate-spin`}>
                        {gifSrc && (
                            <img
                                src={gifSrc}
                                alt="Loading"
                                className="absolute animate-none inset-0 m-auto w-3/4 h-3/4 object-contain rounded-full"
                            />
                        )}
                    </div>
                </div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{text}</p>
            </div>
        </div>
    )
}