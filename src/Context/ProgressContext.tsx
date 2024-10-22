import React, { createContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';


interface ProgressContextType {
    progress: number | null;
    setProgress: React.Dispatch<React.SetStateAction<number | null>> | null;
}


export const ProgressContext = createContext<ProgressContextType>({ progress: null, setProgress: null });

interface ProgressProviderProps {
    children: ReactNode
}

export default function ProgressProvider({ children }: ProgressProviderProps) {
    const [progress, setProgress] = useState<number | null>(null);
    useEffect(() => {
        axios.interceptors.request.use(config => {
            config.onUploadProgress = (e) => {
                if (e && e.total) {
                    const percentCompleted = Math.round((e.loaded * 100) / e.total);
                    setProgress(percentCompleted)
                }
            };
            return config;
        });
        axios.interceptors.response.use((config) => {
            setProgress(null)
            return config
        });
    }, [])
    return (
        <ProgressContext.Provider value={{ progress, setProgress }}>
            {children}
        </ProgressContext.Provider>
    );
};


