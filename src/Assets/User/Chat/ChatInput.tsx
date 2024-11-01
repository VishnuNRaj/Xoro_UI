import React from "react"
import EmojiPicker from "emoji-picker-react"
import ChatLoader from "@/Assets/ChatLoader"
import useChatInput from "@/Hooks/User/Chat/useChatInput"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Paperclip, SendHorizontalIcon, Smile } from "lucide-react"

interface ChatInputProps {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ChatInput({ loading, setLoading }: ChatInputProps) {
  const {
    message,
    setMessage,
    emoji,
    fileRef,
    sendMessage,
    handleEmojiClick,
    toggleEmoji
  } = useChatInput(setLoading)

  return (
    <div className="bg-transparent w-full py-1 absolute bottom-3 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 px-1 w-full">
        <input type="file" ref={fileRef} hidden />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileRef?.current?.click()}
          className="dark:text-white"
        >
          <Paperclip className="w-4 h-4" />
          <span className="sr-only">Attach file</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleEmoji}
          className="text-gray-500 dark:text-gray-400"
        >
          <Smile/>
          <span className="sr-only">Open emoji picker</span>
        </Button>
        <Input
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow text-sm text-gray-900 dark:text-white placeholder-gray-500 bg-transparent border-none focus:ring-transparent"
          type="text"
          value={message}
          placeholder="Type your message…"
          onKeyDownCapture={(e)=>e.code === "Enter" && sendMessage()}
        />
        <div className="absolute bottom-full right-0 mb-2">
          {emoji && <EmojiPicker onEmojiClick={handleEmojiClick} />}
        </div>
        <Button
          onClick={sendMessage}
          disabled={loading}
          className="text-white  bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {!loading ? (
            <SendHorizontalIcon />
          ) : (
            <ChatLoader />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  )
}