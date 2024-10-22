import { SocketContext } from "@/Context/SocketProvider";
import { useContext } from "react";
import { Socket } from "socket.io-client";

export const useSocket = (): Socket | null => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context.socket;
};