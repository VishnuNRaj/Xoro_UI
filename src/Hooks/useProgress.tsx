import { ProgressContext } from "@/Context/ProgressContext";
import { useContext } from "react";

export default function useProgress() {
    const context = useContext(ProgressContext)
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context
}