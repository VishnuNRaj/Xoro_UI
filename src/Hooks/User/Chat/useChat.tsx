import { useEffect, useRef, useState } from 'react'
import { getCookie } from '@/Functions/Cookies'
import { useEssentials } from '@/Hooks/useEssentials'
import { useSocket } from '@/Hooks/useSocket'
import { User } from '@/Store/UserStore/Authentication/Interfaces'
import { getChat } from '@/Store/UserStore/Chat-Management/ChatService'
import { setChat } from '@/Store/UserStore/Chat-Management/ChatSlice'
import { Chat } from '@/Store/UserStore/Chat-Management/interfaces'

export function useChat() {
  const { auth, chat, dispatch, navigate } = useEssentials()
  const [typing, setTyping] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const messageContainerRef = useRef<HTMLDivElement | null>(null)
  const socket = useSocket()

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scroll({
        top: messageContainerRef.current.scrollHeight,
        behavior: 'instant'
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
    if (chats && socket) {
      socket.emit("markAsRead", { RoomId: chat?.chat?.RoomId, UserId: auth?.user?._id })
    }
  }, [chats])

  useEffect(() => {
    const token = getCookie("token")
    if (chat?.chat?.RoomId && token) {
      dispatch(getChat({ RoomId: chat.chat.RoomId, token })).then((data: any) => {
        if (data.payload.status === 202) {
          return navigate("/login")
        }
        setUsers(data.payload.chat.users)
        setChats(data.payload.chat.messages)
      })
    }
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on("message", (data: any) => {
        if (chats) {
          setLoading(false)
          setChats((prev) => [...prev, data._doc])
        }
      })

      socket.on("typing", ({ typing: isTyping, Username }: any) => {
        if (isTyping) {
          setTyping([Username])
        } else {
          setTyping([])
        }
      })

      socket.on("send", (data: any) => {
        setLoading(false)
        setChats((prev) => [...prev, data._doc])
      })
    }

    return () => {
      if (socket) {
        socket.off("message")
        socket.off("typing")
        socket.off("send")
      }
    }
  }, [socket])

  useEffect(() => {
    if (typing.length > 0) {
      const timer = setTimeout(() => {
        setTyping([])
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [typing])

  const handleBack = () => {
    dispatch(setChat(null))
  }

  return {
    auth,
    chat,
    typing,
    loading,
    users,
    chats,
    messageContainerRef,
    handleBack,
    setLoading
  }
}