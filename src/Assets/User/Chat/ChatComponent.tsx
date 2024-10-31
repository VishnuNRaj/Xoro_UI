import { format } from "date-fns"
import ChatLoader from '@/Assets/ChatLoader'
import ChatInput from './ChatInput'
import { Settings, X, ArrowLeft } from 'lucide-react'
import { useChat } from "@/Hooks/User/Chat/useChat"

interface ChatComponentProps {
  close: () => void
}

export default function ChatComponent({ close }: ChatComponentProps) {
  const {
    auth,
    chat,
    typing,
    loading,
    users,
    chats,
    messageContainerRef,
    handleBack,
    setLoading
  } = useChat()

  return (
    <section className="flex flex-col rounded-md justify-center antialiased bg-white text-gray-600 p-1">
      <div className="flex flex-col items-center justify-center min-h-[90vh] max-h-[720px] text-gray-800">
        <div className="w-full bg-gray-900 text-white rounded-lg">
          <header className="pt-6 pb-4 px-5">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <button 
                  onClick={handleBack}
                  className="text-white hover:text-gray-300 mr-4"
                >
                  <ArrowLeft className="h-6 w-6" />
                  <span className="sr-only">Go back</span>
                </button>
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={chat.chat?.Profile || chat.chat?.users.find((user) => user._id !== auth?.user?._id)?.Profile}
                    alt="Profile"
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="ml-3">
                  <h2 className="text-md font-bold">
                    {chat.chat?.GroupName && chat.chat?.Users.length > 2
                      ? chat.chat?.GroupName
                      : chat.chat?.users.find((user) => user._id !== auth?.user?._id)?.Name}
                  </h2>
                  {typing.length === 0 ? (
                    <p className="text-sm text-gray-400">
                      {chat.chat?.GroupName && chat.chat?.Users.length > 2
                        ? `you, @${chat.chat?.users.find((values) => values._id !== auth?.user?._id)?.Username} & ${chat.chat?.users?.length - 2} others`
                        : chat.chat?.users.find((user) => user._id !== auth?.user?._id)?.Username}
                    </p>
                  ) : (
                    <p className="text-sm text-blue-400">{typing[0]} is typing</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-gray-300">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </button>
                <button onClick={() => close()} className="text-gray-400 hover:text-gray-300">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close chat</span>
                </button>
              </div>
            </div>
          </header>
        </div>

        <div className="flex-1 w-full bg-gray-900 shadow-xl rounded-lg overflow-hidden">
          {!chat.loadingChat ? (
            <div
              ref={messageContainerRef}
              className="flex flex-col flex-grow h-[calc(100vh-240px)] overflow-y-auto p-4 scroll-smooth"
            >
              {chats?.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.SenderId === auth?.user?._id ? 'justify-end' : 'justify-start'
                  } mb-4`}
                >
                  <div className={`flex ${message.SenderId === auth?.user?._id ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                    <img
                      src={users.find((usr) => usr._id === message.SenderId)?.Profile}
                      className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                      alt=""
                      crossOrigin="anonymous"
                    />
                    <div className={`max-w-xs ${message.SenderId === auth?.user?._id ? 'bg-blue-500' : 'bg-gray-700'} rounded-lg px-4 py-2`}>
                      <p className="text-sm text-white">{message.Message}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-300">{format(message.Time, "p")}</span>
                        <span className="ml-2">
                          {message.Seen.length === users.length ? (
                            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                            </svg>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4">
              <ChatLoader />
            </div>
          )}
          <ChatInput loading={loading} setLoading={setLoading} />
        </div>
      </div>
    </section>
  )
}