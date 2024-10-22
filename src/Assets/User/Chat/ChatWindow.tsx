import ChatLoader from '@/Assets/ChatLoader'
import { getCookie, useToast } from '@/Functions/Cookies'
import { useEssentials } from '@/Hooks/useEssentials'
import { useOnline } from '@/Hooks/useWindowDimesions'
import { resetState } from '@/Store/UserStore/Authentication/AuthSlice'
import { User } from '@/Store/UserStore/Authentication/Interfaces'
import { getChats, setChat, startChat } from '@/Store/UserStore/Chat-Management/ChatSlice'
import { AllChatState } from '@/Store/UserStore/Chat-Management/interfaces'
import React, { useEffect, useRef, useState } from 'react'

interface props {
    close: any
}
export default function ChatWindow({ close }: props) {
    const { chat, auth, dispatch, navigate } = useEssentials()
    const [chats, setChats] = useState<AllChatState[]>([])
    const [state, setState] = useState<boolean>(false)
    const [users, setUsers] = useState<User[] | null>(null)
    const [group, setGroup] = useState<string[] | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [form, setForm] = useState({
        GroupName: "",
        Profile: "https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-group-icon-png-image_1796653.jpg"
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setForm({ ...form, Profile: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCheckboxChange = (data: string) => {
        if (group) {
            setGroup((prevState) => {
                if (!prevState) {
                    return [data];
                }
                const updatedType = prevState.includes(data)
                    ? prevState.filter((val) => val !== data)
                    : [...prevState, data];
                return updatedType;
            });
        } else {
            setGroup([data]);
        }
    };
    useEffect(() => {
        const token: string | undefined = getCookie('token')
        if (token) {
            dispatch(getChats({ token })).then((state: any) => {
                if (!state.payload.user) {
                    dispatch(resetState())
                    return navigate('/login')
                }
                setChats(state.payload.allChats)
                const data = [...state.payload.users.follow, ...state.payload.users.following].filter((user, i, arr) => {
                    return arr.findIndex(u => u.Username === user.Username) === i;
                });

                setUsers(data)
            })
        }
    }, [])
    const chatNow = (UserId: string) => {
        const token: string | undefined = getCookie("token")
        if (token) {
            dispatch(startChat({ UserId: [UserId], token })).then((state: any) => {
                console.log(state)
                if (state.payload.status === 202) return navigate("/login")
            })
        }
    }
    const createChat = () => {
        const token: string | undefined = getCookie("token")
        if (form.GroupName.length < 2) return useToast("Add Groupname", "error")
        if (token && group) {
            console.log("GroupName", form.GroupName)
            const obj = {
                GroupName: form.GroupName.length > 0 ? form.GroupName : undefined,
                Profile: form.Profile,
                token: token,
                UserId: group,
            }
            dispatch(startChat(obj)).then((state: any) => {
                if (state.payload.status === 202) return navigate("/login")
            })
        }
    }
    const { online } = useOnline()
    return (
        <div>
            <section className="animate-slideInFromLeft transition-all flex fixed top-7 right-2 w-[95%] md:w-[400px] flex-col rounded-md justify-center antialiased bg-white text-gray-600 min-h-[10vh] max-h-[720px] p-[5px]">
                {state && (
                    <div className={`bg-[#111]`} >
                        <>
                            <div className='h-[30px] mt-2 border-b-2 w-full font-semibold text-white flex justify-center items-center'>
                                <h1>New {group && "Group"} Chat</h1>
                            </div>
                            {chat.loadingChat && <ChatLoader />}
                            {!group && (
                                <button onClick={() => setGroup([])} className="w-full py-2 focus:outline-none rounded-md focus-visible:bg-indigo-50">
                                    <div className="flex items-center ml-6">
                                        <img crossOrigin="anonymous" className="rounded-full items-start flex-shrink-0" src='https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-group-icon-png-image_1796653.jpg' width="32" height="32" alt="Marie Zulfikar" />
                                        <div className='ml-5'>
                                            <h4 className="text-sm font-semibold text-gray-100">Create Group</h4>
                                        </div>
                                    </div>
                                </button>
                            )}
                            {group && (
                                <div className="flex items-center ml-6">
                                    <div className="relative mt-5 mr-3 flex-shrink-0">
                                        <img
                                            className="rounded-full w-10 h-10 aspect-square object-contain"
                                            src={form.Profile}
                                            width="32"
                                            height="32"
                                            alt="Marie Zulfikar"
                                        />
                                        <input type="file" onChange={handleChange} ref={inputRef} hidden name="" id="" />
                                        <div onClick={() => inputRef?.current?.click()} className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300">
                                            <svg
                                                className="w-6 h-6 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                            </svg>
                                        </div>
                                    </div>                                    <div className='mt-5'>
                                        <input type="text" placeholder='Group Name' className='w-[280px] rounded-md font-medium px-5 h-[40px] p-2 ' value={form.GroupName} onChange={(e) => setForm({ ...form, GroupName: e.target.value })} />
                                    </div>
                                </div>
                            )}
                            <div style={{ overflowY: 'scroll', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }} className="text-gray-50 relative mx-auto mt-2 bg-transparent min-h-[70vh] max-h-[70vh] shadow-lg rounded-lg">
                                {users && users?.map((user, i) => (
                                    <button onClick={() => {
                                        if (!group) {
                                            chatNow(user._id)
                                        }
                                    }} key={i} className="w-full py-2 focus:outline-none rounded-md focus-visible:bg-indigo-50">

                                        <div className="flex items-center ml-6">
                                            {group && (
                                                <div className='flex items-center mr-5'>
                                                    <input
                                                        id={`remember`}
                                                        type="checkbox"
                                                        value={user._id}
                                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                                                        required
                                                        onChange={() => handleCheckboxChange(user._id)}
                                                        checked={group.some((val) => val === user._id)}
                                                    />
                                                </div>
                                            )}
                                            <img crossOrigin="anonymous" className="rounded-full items-start object-cover w-10 h-10" src={user.Profile} width="32" height="32" alt="Marie Zulfikar" />
                                            <div className='ml-5'>
                                                <h4 className="text-sm font-semibold text-gray-100">{user.Name}</h4>
                                                <div className="text-[13px]">@{user.Username}</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {group && (
                                <div className='fixed flex items-center justify-center bottom-[50px] w-full'>
                                    <div className='flex space-x-4'>
                                        <button onClick={createChat} className='px-4 py-2 bg-blue-500 text-white rounded'>Create</button>
                                        <button className='px-4 py-2 bg-gray-500 text-white rounded' onClick={() => {
                                            setGroup(null)
                                            setForm({ GroupName: "", Profile: "https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-group-icon-png-image_1796653.jpg" })
                                        }}>Cancel</button>
                                    </div>
                                </div>
                            )}
                        </>
                    </div>
                )}

                {!state && (
                    <div className="h-auto">

                        <div className='w-full bg-[#111] text-white rounded-lg'>
                            <header className="pt-6 pb-4 px-5 ">
                                <div className="flex justify-between items-center mb-3">

                                    <div className="flex items-center">
                                        <a className="inline-flex items-start mr-3" href="#0">
                                            <img crossOrigin="anonymous" className="rounded-full w-10 h-10" src={auth.user?.Profile} alt="Lauren Marsano" />
                                        </a>
                                        <div className="pr-1">
                                            <a className="inline-flex" href="#0">
                                                <h2 className="text-md leading-snug font-bold">{auth.user?.Name}</h2>
                                            </a>
                                            <a className="block text-sm font-medium hover:text-indigo-500" href="#0">@{auth.user?.Username}</a>
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
                        <div style={{ overflowY: 'scroll', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }} className="text-gray-50 relative mx-auto mt-2 bg-[#111] min-h-[70vh] max-h-[70vh] shadow-lg rounded-lg">
                            {chat.loadingChat && (
                                <div role="status" className='flex py-[50%] items-center justify-center align-middle'>
                                    <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                            )}
                            {!chat.loadingChat && (
                                <>
                                    <div className="py-3 px-5">
                                        <h3 className=" overflow-y-auto text-xs font-semibold uppercase  mb-1">Chats</h3>
                                        <div className="divide-y overflow-y-auto divide-gray-200">
                                            {chats.length < 1 ? (
                                                <button className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                                                    <div className="flex font-semibold justify-center items-center">
                                                        Start Messaging
                                                    </div>
                                                </button>
                                            ) : (
                                                <>
                                                    {chats.map((val, idx) => (
                                                        <button key={idx} onClick={() => {
                                                            dispatch(setChat(val))
                                                        }} className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                                                            <div className="flex items-center">
                                                                <img crossOrigin="anonymous" className="rounded-full relative items-start object-contain flex-shrink-0 w-10 h-10 mr-3" src={val.GroupName ? val.Profile : val.users.find((user) => user._id !== auth?.user?._id)?.Profile} width="32" height="32" alt="Marie Zulfikar" />
                                                                {online.find((usr) => usr._id === val.users.find((user) => user._id !== auth?.user?._id)?._id) && <i className='fa fa-circle absolute right-0 top-0'></i>}
                                                                <div>
                                                                    <h4 className="text-sm font-semibold text-gray-100">{val.GroupName ? val.GroupName : val.users.find((user) => user._id !== auth?.user?._id)?.Name}</h4>
                                                                    <div className="text-[13px]">{val && val?.latestMessage ? val?.latestMessage.Message : "Say Hello"}</div>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {!state && (
                                        <>
                                            <button onClick={() => setState(true)} className="fixed bottom-[40px] right-8 inline-flex items-center text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-full text-center px-3 py-2 shadow-lg focus:outline-none focus-visible:ring-2">
                                                <svg className="w-3 h-3 fill-current text-indigo-300 flex-shrink-0 mr-2" viewBox="0 0 12 12">
                                                    <path d="M11.866.146a.5.5 0 0 0-.437-.139c-.26.044-6.393 1.1-8.2 2.913a4.145 4.145 0 0 0-.617 5.062L.305 10.293a1 1 0 1 0 1.414 1.414L7.426 6l-2 3.923c.242.048.487.074.733.077a4.122 4.122 0 0 0 2.933-1.215c1.81-1.809 2.87-7.94 2.913-8.2a.5.5 0 0 0-.139-.439Z" />
                                                </svg>
                                                <span>New Chat</span>
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </section>

        </div >
    )
}

