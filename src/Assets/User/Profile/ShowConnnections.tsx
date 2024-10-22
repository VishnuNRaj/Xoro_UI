import React, { useState, SetStateAction } from 'react'
import { Connections, User } from '@/Store/UserStore/Authentication/Interfaces'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useEssentials } from '@/Hooks/useEssentials'
import useConnections from '@/Hooks/User/Profile/useConnections'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Props {
    open: boolean
    setOpen: React.Dispatch<SetStateAction<boolean>>
    connections: Connections
    setConnection: React.Dispatch<SetStateAction<Connections | null>>
}

const UserMap: React.FC<{ user: User; show: "follow" | "following" | "mutual" }> = ({ user }) => {
    const { navigate } = useEssentials()
    return (
        <div onClick={() => navigate(`/profile/${user.ProfileLink}`)} className='w-full flex items-center'>
            <div className='rounded-full flex-shrink-0 items-center justify-center'>
                <img crossOrigin="anonymous" src={user.Profile} alt={user.Name} className='w-6 h-6 rounded-full object-cover' />
            </div>
            <div className='ml-3'>
                <p className='text-foreground dark:text-foreground-dark'>{user.Name}</p>
            </div>
        </div>
    )
}

const ShowConnections: React.FC<Props> = ({ open, connections, setOpen, setConnection }) => {
    const [show, setShow] = useState<"follow" | "following" | "mutual">("follow")
    const { unfollowUserHook, followUserHook, RemovefollowUserHook } = useConnections()

    const arr: { text: string; value: "follow" | "following" | "mutual" }[] = [
        { text: "Followers", value: "follow" },
        { text: "Following", value: "following" },
        { text: "Mutual", value: "mutual" }
    ]

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg bg-blue-100 dark:bg-background dark:text-white p-0">
                <div className='flex-shrink-0'>
                    <div className='w-full h-[50px] dark:bg-background text-md font-semibold grid grid-cols-3'>
                        {arr.map((values) => (
                            <Button
                                key={values.value}
                                variant={"default"}
                                onClick={() => setShow(values.value)}
                                className={`h-full rounded-none hover:bg-blue-300 ${show === values.value ? "bg-blue-300 dark:bg-blue-dark" : "bg-blue-200 dark:bg-background"}`}
                            >
                                {values.text}
                            </Button>
                        ))}
                    </div>
                    <ScrollArea className='w-full h-[220px] p-2'>
                        <div className='w-full border-y border-y-border dark:border-y-border-dark grid grid-cols-1'>
                            {connections[show]?.map((userData) => (
                                <div key={userData._id} className='w-full font-semibold gap-2 border-y border-y-border dark:border-y-border-dark bg-surface dark:bg-background hover:bg-primary/10 dark:hover:bg-blue-dark h-10 p-6 flex items-center justify-between'>
                                    <UserMap user={userData} show={show} />
                                    {show === "follow" && (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className='text-white font-semibold'
                                            onClick={async (e) => {
                                                e.stopPropagation()
                                                const response = connections.mutual.find((val) => val._id === userData._id)
                                                let newData = { ...connections }
                                                if (response) {
                                                    await unfollowUserHook(userData._id)
                                                    newData = {
                                                        ...connections,
                                                        following: connections.following?.filter((val) => val._id !== userData._id),
                                                        mutual: connections.mutual?.filter((val) => val._id !== userData._id)
                                                    }
                                                } else if (!response && connections.following && connections.mutual) {
                                                    await followUserHook(userData._id)
                                                    newData = {
                                                        ...connections,
                                                        following: [...connections.following, userData],
                                                        mutual: [...connections?.mutual, userData]
                                                    }
                                                }
                                                setConnection(newData)
                                            }}
                                        >
                                            {!connections.mutual.find((val) => val._id === userData._id) ? "Follow" : "Following"}
                                        </Button>
                                    )}
                                    {(show === "follow" || show === "mutual") && (
                                        <Button
                                            variant="ghost"
                                            className='text-white bg-accent-light'
                                            size="sm"
                                            onClick={async (e) => {
                                                e.stopPropagation()
                                                await RemovefollowUserHook(userData._id)
                                                const newData = {
                                                    ...connections,
                                                    follow: connections.follow?.filter((val) => val._id !== userData._id),
                                                    mutual: connections.mutual?.filter((val) => val._id !== userData._id)
                                                }
                                                setConnection(newData)
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                    {show === "following" && (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className='text-white font-semibold'
                                            onClick={async (e) => {
                                                e.stopPropagation()
                                                await unfollowUserHook(userData._id)
                                                const newData = {
                                                    ...connections,
                                                    following: connections.following?.filter((val) => val._id !== userData._id),
                                                    mutual: connections.mutual?.filter((val) => val._id !== userData._id)
                                                }
                                                setConnection(newData)
                                            }}
                                        >
                                            Unfollow
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ShowConnections