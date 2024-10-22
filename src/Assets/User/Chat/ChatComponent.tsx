import { getCookie } from '@/Functions/Cookies';
import { useEssentials } from '@/Hooks/useEssentials';
import { useSocket } from '@/Hooks/useSocket';
import { User } from '@/Store/UserStore/Authentication/Interfaces';
import { getChat } from '@/Store/UserStore/Chat-Management/ChatService';
import { setChat } from '@/Store/UserStore/Chat-Management/ChatSlice';
import { Chat } from '@/Store/UserStore/Chat-Management/interfaces';
import React, { useEffect, useRef, useState } from 'react';
import { format } from "date-fns"
import ChatLoader from '@/Assets/ChatLoader';
import ChatInput from './ChatInput';

interface props {
    close: any
}
const ChatComponent: React.FC<props> = ({ close }) => {
    const { auth, chat, dispatch, navigate } = useEssentials()
    const [type, setTyping] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [users, setUsers] = useState<User[]>([])
    const [chats, setChats] = useState<Chat[]>([])
    const divRef = useRef<HTMLDivElement | null>(null)
    const socket = useSocket()
    const scrollToBottom = () => {
        if (divRef.current) {
            divRef.current.scroll({
                top: divRef.current.scrollHeight,
                behavior: 'instant'
            });
        }
    };
    const RoomId = chat?.chat?.RoomId
    useEffect(() => {
        scrollToBottom()
        if (chats && socket) {
            socket.emit("markAsRead", { RoomId, UserId: auth?.user?._id })
        }
    }, [chats])
    useEffect(() => {
        const RoomId = chat?.chat?.RoomId
        const token: string | undefined = getCookie("token")
        if (RoomId && token) {
            dispatch(getChat({ RoomId, token })).then((data: any) => {
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
                console.log(data, chats)
                if (chats) {
                    setLoading(false)
                    setChats((prev) => [...prev, data._doc])
                }
            })
            socket.on("typing", ({ typing, Username }: any) => {
                console.log(typing, Username)
                if (typing) {
                    setTyping([Username])
                } else if (!typing) {
                    setTyping([])
                }
            })
            socket.on("send", (data: any) => {
                console.log(data)
                setLoading(false)
                setChats((prev) => [...prev, data._doc])
            })
        }
    }, [socket])
    useEffect(() => {
        if (type.length > 0) {
            setTimeout(() => {
                setTyping([])
            }, 4000)
        }
    }, [type])
    return (
        <section className="animate-slideInFromLeft transition-all flex fixed top-7 right-2 w-[95%] md:w-[400px] flex-col rounded-md justify-center antialiased bg-white text-gray-600 p-[5px]">
            <div className="flex flex-col items-center justify-center w-full min-h-[90vh] max-h-[720px] text-gray-800">
                <div className='w-full bg-[#111] text-white rounded-lg'>
                    <header className="pt-6 pb-4 px-5 ">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center">
                                <button onClick={() => dispatch(setChat(null))} className="text-white bg-transparent aspect-square w-6 h-6 flex justify-center items-center  mr-4 hover:text-gray-500 rounded-full focus:ring-0 outline-none focus:outline-none">
                                    <i className='fa fa-arrow-left'></i>
                                </button>
                                <a className="inline-flex items-start mr-3" href="#0"  >
                                    <img crossOrigin="anonymous" className="rounded-full aspect-square w-10 h-10 object-cover" src={chat.chat?.Profile ? chat.chat?.Profile : chat.chat?.users.find((user) => user._id !== auth?.user?._id)?.Profile} width="48" height="48" alt="Lauren Marsano" />
                                </a>
                                <div className="pr-1">
                                    <a className="inline-flex" href="#0">
                                        <h2 className="text-md leading-snug font-bold">{chat.chat?.GroupName && chat.chat?.Users.length > 2 ? chat.chat?.GroupName : chat.chat?.users.find((user) => user._id !== auth?.user?._id)?.Name}</h2>
                                    </a>
                                    {type.length === 0 &&
                                        <a className="block text-sm font-medium hover:text-indigo-500" href="#0">{chat.chat?.GroupName && chat.chat?.Users.length > 2 ? `you, @${chat.chat?.users.find((values) => values._id !== auth?.user?._id)?.Username} & ${chat.chat?.users?.length - 2} others` : chat.chat?.users.find((user) => user._id !== auth?.user?._id)?.Username}</a>
                                    }
                                    {type.length > 0 &&
                                        <a className="block text-sm text-blue-500 font-medium " href="#0">{type[0]} is typing</a>
                                    }
                                </div>
                            </div>

                            <div className="relative inline-flex flex-shrink-0">
                                <button className="text-black hover:text-gray-500 rounded-full focus:ring-0 outline-none focus:outline-none">
                                    <svg className="w-4 h-4 fill-current" fill='white' stroke='white' viewBox="0 0 16 16">
                                        <path d="m15.621 7.015-1.8-.451A5.992 5.992 0 0 0 13.13 4.9l.956-1.593a.5.5 0 0 0-.075-.611l-.711-.707a.5.5 0 0 0-.611-.075L11.1 2.87a5.99 5.99 0 0 0-1.664-.69L8.985.379A.5.5 0 0 0 8.5 0h-1a.5.5 0 0 0-.485.379l-.451 1.8A5.992 5.992 0 0 0 4.9 2.87l-1.593-.956a.5.5 0 0 0-.611.075l-.707.711a.5.5 0 0 0-.075.611L2.87 4.9a5.99 5.99 0 0 0-.69 1.664l-1.8.451A.5.5 0 0 0 0 7.5v1a.5.5 0 0 0 .379.485l1.8.451c.145.586.378 1.147.691 1.664l-.956 1.593a.5.5 0 0 0 .075.611l.707.707a.5.5 0 0 0 .611.075L4.9 13.13a5.99 5.99 0 0 0 1.664.69l.451 1.8A.5.5 0 0 0 7.5 16h1a.5.5 0 0 0 .485-.379l.451-1.8a5.99 5.99 0 0 0 1.664-.69l1.593.956a.5.5 0 0 0 .611-.075l.707-.707a.5.5 0 0 0 .075-.611L13.13 11.1a5.99 5.99 0 0 0 .69-1.664l1.8-.451A.5.5 0 0 0 16 8.5v-1a.5.5 0 0 0-.379-.485ZM8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                                    </svg>
                                </button>
                                <button onClick={() => close(false)} className="text-black p-2 hover:text-gray-500 rounded-full focus:ring-0 outline-none focus:outline-none">
                                    <svg id="Layer_1" className='w-4 h-4' stroke='white' fill='white' version="1.1" viewBox="0 0 512 512" width="512px" xmlns="http://www.w3.org/2000/svg" ><path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z" /></svg>
                                </button>
                            </div>
                        </div>
                    </header>
                </div>
                <div className="right-0 mt-1 top-0 flex flex-col flex-grow w-[100%] bg-[#111] shadow-xl rounded-lg overflow-hidden">
                    {!chat.loadingChat && (
                        <div key={"__!!___!!!"} ref={divRef} style={{ overflowY: 'scroll', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', }} className="flex flex-col scroll-smooth transition-all flex-grow h-0 p-4">
                            {chats && chats.length > 0 && chats.map((chat) => (
                                <>
                                    {chat.SenderId !== auth?.user?._id ? (
                                        <div key={chat._id} className="flex justify-start w-[75%] mt-2 space-x-3 max-w-xs">
                                            <div className="flex-shrink-0 h-8 w-8 rounded-full">
                                                <img crossOrigin="anonymous" src={users.find((usr) => usr._id === chat.SenderId)?.Profile} className='rounded-full object-contain h-8 w-8' alt="" />
                                            </div>
                                            <div>
                                                <div className="bg-gray-100 p-1 pl-2 rounded-r-lg rounded-bl-lg">
                                                    <p className="text-sm">{chat?.Message}</p>
                                                </div>
                                                <div className='flex mt-2 justify-between'>
                                                    <span className="text-xs font-extralight text-gray-500 leading-none">{format(chat?.Time, "p")}</span>
                                                    <span className="text-xs ml-1 justify-end font-extralight leading-none">{chat?.Seen.length === users.length ? (
                                                        <svg className='w-3 h-3' viewBox="0 -0.5 25 25" fill="white" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.03033 11.4697C4.73744 11.1768 4.26256 11.1768 3.96967 11.4697C3.67678 11.7626 3.67678 12.2374 3.96967 12.5303L5.03033 11.4697ZM8.5 16L7.96967 16.5303C8.26256 16.8232 8.73744 16.8232 9.03033 16.5303L8.5 16ZM17.0303 8.53033C17.3232 8.23744 17.3232 7.76256 17.0303 7.46967C16.7374 7.17678 16.2626 7.17678 15.9697 7.46967L17.0303 8.53033ZM9.03033 11.4697C8.73744 11.1768 8.26256 11.1768 7.96967 11.4697C7.67678 11.7626 7.67678 12.2374 7.96967 12.5303L9.03033 11.4697ZM12.5 16L11.9697 16.5303C12.2626 16.8232 12.7374 16.8232 13.0303 16.5303L12.5 16ZM21.0303 8.53033C21.3232 8.23744 21.3232 7.76256 21.0303 7.46967C20.7374 7.17678 20.2626 7.17678 19.9697 7.46967L21.0303 8.53033ZM3.96967 12.5303L7.96967 16.5303L9.03033 15.4697L5.03033 11.4697L3.96967 12.5303ZM9.03033 16.5303L17.0303 8.53033L15.9697 7.46967L7.96967 15.4697L9.03033 16.5303ZM7.96967 12.5303L11.9697 16.5303L13.0303 15.4697L9.03033 11.4697L7.96967 12.5303ZM13.0303 16.5303L21.0303 8.53033L19.9697 7.46967L11.9697 15.4697L13.0303 16.5303Z" fill="#000000" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className='w-3 h-3' viewBox="0 0 3750 3750">
                                                            <path fillRule="evenodd" fill="white" fillOpacity="1" d="M 707.742188 1930.46875 C 1233.671875 1894.089844 1143.261719 2735.75 1466.191406 2950.367188 C 1932.921875 2658.859375 2106.210938 1208.050781 3431.800781 496.660156 C 2557.660156 582.070312 1819.441406 1440.378906 1512.328125 2260.5 C 1449.449219 1767.371094 885.992188 1428.929688 707.742188 1930.46875 Z M 707.742188 1930.46875 " />
                                                        </svg>
                                                    )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={chat._id} className="flex justify-end w-[75%] mt-2 space-x-3 max-w-xs self-end">
                                            <div>
                                                <div className="bg-blue-500 p-1 pl-2 rounded-l-lg rounded-br-lg">
                                                    <p className="text-sm">{chat?.Message}</p>
                                                </div>
                                                <div className='flex mt-2 justify-between'>
                                                    <span className="text-xs font-extralight text-gray-500 leading-none">{format(chat?.Time, "p")}</span>
                                                    <span className="text-xs ml-1 justify-end font-extralight leading-none">{chat?.Seen.length === users.length ? (
                                                        <svg className='w-3 h-3' viewBox="0 -0.5 25 25" fill="white" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.03033 11.4697C4.73744 11.1768 4.26256 11.1768 3.96967 11.4697C3.67678 11.7626 3.67678 12.2374 3.96967 12.5303L5.03033 11.4697ZM8.5 16L7.96967 16.5303C8.26256 16.8232 8.73744 16.8232 9.03033 16.5303L8.5 16ZM17.0303 8.53033C17.3232 8.23744 17.3232 7.76256 17.0303 7.46967C16.7374 7.17678 16.2626 7.17678 15.9697 7.46967L17.0303 8.53033ZM9.03033 11.4697C8.73744 11.1768 8.26256 11.1768 7.96967 11.4697C7.67678 11.7626 7.67678 12.2374 7.96967 12.5303L9.03033 11.4697ZM12.5 16L11.9697 16.5303C12.2626 16.8232 12.7374 16.8232 13.0303 16.5303L12.5 16ZM21.0303 8.53033C21.3232 8.23744 21.3232 7.76256 21.0303 7.46967C20.7374 7.17678 20.2626 7.17678 19.9697 7.46967L21.0303 8.53033ZM3.96967 12.5303L7.96967 16.5303L9.03033 15.4697L5.03033 11.4697L3.96967 12.5303ZM9.03033 16.5303L17.0303 8.53033L15.9697 7.46967L7.96967 15.4697L9.03033 16.5303ZM7.96967 12.5303L11.9697 16.5303L13.0303 15.4697L9.03033 11.4697L7.96967 12.5303ZM13.0303 16.5303L21.0303 8.53033L19.9697 7.46967L11.9697 15.4697L13.0303 16.5303Z" fill="#000000" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className='w-3 h-3' viewBox="0 0 3750 3750">
                                                            <path fillRule="evenodd" fill="white" fillOpacity="1" d="M 707.742188 1930.46875 C 1233.671875 1894.089844 1143.261719 2735.75 1466.191406 2950.367188 C 1932.921875 2658.859375 2106.210938 1208.050781 3431.800781 496.660156 C 2557.660156 582.070312 1819.441406 1440.378906 1512.328125 2260.5 C 1449.449219 1767.371094 885.992188 1428.929688 707.742188 1930.46875 Z M 707.742188 1930.46875 " />
                                                        </svg>
                                                    )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300">
                                                <img crossOrigin="anonymous" src={users.find((usr) => usr._id === chat.SenderId)?.Profile} className='rounded-full object-contain h-8 w-8' alt="" />
                                            </div>
                                        </div>
                                    )}
                                </>
                            ))}
                            <div className="mt-2">
                                {/* {type.length > 0 && <Typing />} */}
                            </div>
                        </div>
                    )}
                    <div className='ml-5 mt-2'>
                        {chat.loadingChat && <ChatLoader />}
                    </div>
                    <ChatInput loading={loading} setLoading={setLoading} />
                </div>
            </div>
        </section>
    );
};
export default ChatComponent