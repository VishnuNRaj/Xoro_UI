import { useEssentials } from "@/Hooks/useEssentials";
import { useSocket } from "@/Hooks/useSocket";
import React, { useState, useRef, useEffect, SetStateAction } from "react"
import EmojiPicker from "emoji-picker-react"
import ChatLoader from "@/Assets/ChatLoader";

interface props {
    loading: boolean;
    setLoading: React.Dispatch<SetStateAction<boolean>>;
}
const ChatInput: React.FC<props> = ({ setLoading, loading }) => {
    const [message, setMessage] = useState("")
    const fileRef = useRef<HTMLInputElement | null>(null)
    const { chat, auth } = useEssentials()
    const { user } = auth
    const socket = useSocket()
    const RoomId = chat?.chat?.RoomId
    useEffect(() => {
        if (socket && chat.chat) {
            socket.emit("join-chat", {
                RoomId: chat.chat.RoomId,
                UserId: chat.chat.Users.map((usr) => usr.UserId)
            })
        }
    }, [])
    const sendMessage = () => {
        if (socket && RoomId && message.length > 0) {
            socket.emit("message", {
                RoomId, Message: message, SenderId: user?._id,
            })
            setMessage("")
            setLoading(true)
        }
    }
    const [emoji, setEmoji] = useState<boolean>(false)
    useEffect(() => {
        if (socket) {
            const values = chat.chat
            socket.emit("typing", values?.RoomId, auth.user?.Username, message.length > 0)
        }
    }, [message])
    return (
        <>
            <div className="bg-[#111] flex p-4 items-center">
                <div className="flex items-center bg-[#222] rounded px-3 h-10 w-[80%]">
                    <input type="file" ref={fileRef} hidden name="" id="" />
                    <button onClick={() => fileRef?.current?.click()} >
                        <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" className='w-4 fill-white mr-2 h-4' text-rendering="geometricPrecision" image-rendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 397 511.92"><path fillRule="nonzero" d="M370.42 212.78c4.94-6.51 14.23-7.78 20.73-2.85 6.51 4.94 7.78 14.23 2.84 20.73L216.08 464.63c-20.06 26.3-49.03 42.03-79.53 46.18-30.03 4.09-61.64-3.04-87.78-22.38a15.67 15.67 0 0 1-2.56-1.94c-25.65-20.04-41.01-48.64-45.1-78.71-4.09-30.05 3.06-61.66 22.39-87.79.53-.88 1.16-1.71 1.86-2.47L239.33 36.15c16.39-19.23 34.57-31.3 54.79-34.97 20.41-3.71 41.94 1.25 64.75 16.18l.97.69.26.2.03.02c10.88 8.4 19.01 17.76 24.58 27.84 5.98 10.85 8.96 22.5 9.17 34.68.27 16.39-3.62 30.03-9.87 42.56-5.75 11.55-13.57 22.01-21.92 32.99l-198.2 260.67c-8.38 11.02-20.48 17.61-33.2 19.34-12.16 1.66-24.98-1.14-35.71-8.75-.96-.57-1.86-1.25-2.69-2.05-10.23-8.32-16.36-19.95-18.03-32.15-1.71-12.69 1.4-26.09 9.76-37.09L255.26 131.1c4.93-6.5 14.22-7.77 20.73-2.84 6.5 4.94 7.77 14.23 2.84 20.73L107.59 374.2c-3.4 4.48-4.66 10-3.95 15.26.71 5.22 3.4 10.17 7.86 13.56l.05.05c4.46 3.36 9.96 4.61 15.2 3.9 5.23-.71 10.18-3.39 13.57-7.85l198.2-260.67c7.26-9.55 14.07-18.66 18.9-28.34 4.33-8.68 7.02-17.98 6.85-28.86-.12-7.25-1.94-14.25-5.57-20.85-3.56-6.45-8.94-12.61-16.3-18.34-16.01-10.43-30.3-14.04-43.06-11.73-13.02 2.37-25.5 11.03-37.5 25.07L48.04 336.59c-15.1 19.85-20.69 44.13-17.55 67.24 3.08 22.65 14.58 44.16 33.77 59.22.75.46 1.47 1 2.14 1.62 19.67 14.5 43.51 19.85 66.21 16.76 22.67-3.08 44.19-14.61 59.24-33.82.48-.76 1.03-1.48 1.65-2.17l176.92-232.66z" /></svg>
                    </button>
                    <button onClick={() => setEmoji(!emoji)}>
                        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-gray-400 mr-3" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </button>
                    <input onChange={(e) => setMessage(e.target.value)}
                        className="bg-transparent relative flex-grow text-sm text-white placeholder-gray-500 outline-none"
                        type="text"
                        value={message}
                        placeholder="Type your message…"
                    />
                    <div className="absolute top-3">
                        {emoji && <EmojiPicker onEmojiClick={(e) => setMessage(message + e.emoji)} />}
                    </div>
                </div>
                <button onClick={() => sendMessage()} disabled={loading} className="h-10 w-10 flex items-center justify-center rounded-md ml-4 bg-[#222]">
                    {!loading && <svg viewBox="0 0 32 32" stroke='none' className='h-7 w-7 fill-blue-400' xmlns="http://www.w3.org/2000/svg">
                        <path d="m27.45 15.11-22-11a1 1 0 0 0 -1.08.12 1 1 0 0 0 -.33 1l2.65 9.77h11.31v2h-11.31l-2.69 9.74a1 1 0 0 0 1 1.26 1 1 0 0 0 .45-.11l22-11a1 1 0 0 0 0-1.78z" />
                        <path d="m0 0h32v32h-32z" fill="none" />
                    </svg>}
                    {loading && <ChatLoader />}
                </button>

            </div>
        </>
    )
}

export default ChatInput