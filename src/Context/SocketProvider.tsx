import { createContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import config from '@/Configs/config';
import io, { Socket } from 'socket.io-client';

interface SocketContextProps {
    socket: Socket | null;
}

export const SocketContext = createContext<SocketContextProps>({ socket: null });


interface SocketProviderProps {
    children: ReactNode;
}

export default function SocketProvider({ children }: SocketProviderProps) {
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        const newSocket = io(config.BASE);

        newSocket.on('connect', () => {
            setSocket(newSocket);
            console.log(newSocket.id)
            axios.interceptors.request.use(config => {
                config.withCredentials = true
                config.headers['socket-id'] = newSocket.id;
                return config;
            })
        });
        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
