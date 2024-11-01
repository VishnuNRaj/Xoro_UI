import { useState, useRef, useEffect } from "react"
import { useEssentials } from "@/Hooks/useEssentials"
import { useSocket } from "@/Hooks/useSocket"

export default function useChatInput(setLoading: React.Dispatch<React.SetStateAction<boolean>>) {
  const [message, setMessage] = useState("")
  const [emoji, setEmoji] = useState<boolean>(false)
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
  }, [socket, chat.chat])

  useEffect(() => {
    if (socket) {
      const values = chat.chat
      socket.emit("typing", values?.RoomId, auth.user?.Username, message.length > 0)
    }
  }, [message, socket, chat.chat, auth.user?.Username])

  const sendMessage = () => {
    if (socket && RoomId && message.length > 0) {
      socket.emit("message", {
        RoomId, 
        Message: message, 
        SenderId: user?._id,
      })
      setMessage("")
      setLoading(true)
    }
  }

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setMessage(prevMessage => prevMessage + emojiObject.emoji)
  }

  const toggleEmoji = () => setEmoji(!emoji)

  return {
    message,
    setMessage,
    emoji,
    fileRef,
    sendMessage,
    handleEmojiClick,
    toggleEmoji
  }
}