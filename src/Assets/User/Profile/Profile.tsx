import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Settings, Camera, Lock, Tv, Image, Bookmark, Plus } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Preloader from '@/Assets/Preloader'
import EditChannel from './EditChannel'
import useProfileData from '@/Hooks/User/Profile/useProfileData';
import CreateChannel from "./CreateChannel"
import ImgComponent from "./ImageMap"
import ShowConnections from "./ShowConnnections"

export default function ProfileComponent() {
    const {
        user,
        loading,
        loadingPost,
        loadingProfile,
        connections,
        type,
        Profile,
        banner,
        // open,
        channel,
        state,
        bannerRef,
        profileRef,
        setConnections,
        setType,
        setProfile,
        setBanner,
        setOpen,
        setChannel,
        setState,
        dispatch,
        handleBanner,
        handleImages,
        post,
        edit,
        setEdit
    } = useProfileData()

    return (
        <div className={`min-h-screen max-w-screen-lg mx-auto w-full transition-colors duration-300`}>
            {/* />}
            {open && <AccountSettings open={open} setOpen={setOpen} />}
             */}
            {state && connections && <ShowConnections setConnection={setConnections} setOpen={setState} open={state} connections={connections} />}
            {channel && <CreateChannel open={channel} setOpen={setChannel} />}
            {edit && <EditChannel open={edit} setOpen={setEdit} />}
            {loadingPost || loading || loadingProfile ? <Preloader /> : null}

            <Card className="mx-auto rounded-none sm:rounded-lg overflow-hidden shadow-lg bg-blue-light dark:text-white dark:bg-background">
                <div className="relative h-48 sm:h-64 md:h-80">
                    <img
                        alt="Profile banner"
                        className="w-full h-full rounded-md object-cover"
                        src={banner.Show || "/Loading.png"}
                    />
                    <div className="absolute top-4 right-4 flex space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="default" size="icon" className="w-10 h-10 rounded-md hover:bg-primary-dark text-surface font-semibold">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="dark:text-white gap-2 flex flex-col bg-blue-light dark:bg-blue-dark">
                                <DropdownMenuItem className="font-semibold" onSelect={() => bannerRef?.current?.click()}>
                                    <Camera className="mr-2 h-4 w-4" />
                                    <span>Change Banner</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="font-semibold" onSelect={() => setOpen(true)}>
                                    <Lock className="mr-2 h-4 w-4" />
                                    <span>Secure Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="font-semibold" onSelect={() => setOpen(true)}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Profile Settings</span>
                                </DropdownMenuItem>
                                {!user?.Channel ? (
                                    <DropdownMenuItem className="font-semibold" onSelect={() => setChannel(true)}>
                                        <Tv className="mr-2 h-4 w-4" />
                                        <span>Create Channel</span>
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem className="font-semibold" onSelect={() => setEdit(true)}>
                                        <Tv className="mr-2 h-4 w-4" />
                                        <span>Edit Channel</span>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="relative px-4 sm:px-6 pb-4">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-20 sm:-mt-24 mb-4 sm:mb-0">
                        <div className="relative">
                            <img
                                alt="Profile picture"
                                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-background dark:border-background-dark object-cover shadow-lg"
                                src={Profile.Show || "/User.png"}
                            />
                            {user?.ProfileLock && (
                                <Button variant="secondary" size="icon" className="absolute bottom-0 right-0 rounded-full">
                                    <Lock className="h-4 w-4" />
                                </Button>
                            )}
                            <Button variant="secondary" size="icon" className="absolute bottom-0 left-0 text-white rounded-full" onClick={() => profileRef?.current?.click()}>
                                <Camera className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left flex-grow">
                            <h1 className="text-2xl font-bold text-foreground dark:text-foreground-dark">{user?.Name || ""}</h1>
                            <p className="text-primary dark:text-primary-dark">@{user?.Username || ""}</p>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-center">
                        {user?.Description.length === 0 ? (
                            <>
                                <Button variant={"default"} className='hover:bg-primary-dark text-white'> <Plus /> Add Description</Button>
                            </>
                        ) : (
                            <>
                                {user && user?.Description.length > 0 && (
                                    <ul>
                                        {user.Description.map((description, index) => (
                                            <li key={index}>{description}</li>
                                        ))}
                                    </ul>
                                )}

                            </>
                        )}
                    </div>
                    <div className="w-full flex justify-center items-center text-center border-border dark:border-border-dark pt-4">
                        <div className="flex items-center max-w-xl justify-between w-full mt-6 pt-4 border-t text-center">
                            <Button variant="ghost" className="hover:bg-transparent" onClick={() => setState(!state)}>
                                <div>
                                    <p className="text-xl font-bold">{post?.length || "1,234"}</p>
                                    <p className="text-muted-foreground dark:text-muted-foreground-dark">Posts</p>
                                </div>
                            </Button>
                            <Button variant="ghost" className="hover:bg-transparent" onClick={() => setState(!state)}>
                                <div>
                                    <p className="text-xl font-bold">{connections?.follow?.length || "5.6K"}</p>
                                    <p className="text-muted-foreground dark:text-muted-foreground-dark">Followers</p>
                                </div>
                            </Button>
                            <Button variant="ghost" className="hover:bg-transparent" onClick={() => setState(!state)}>
                                <div>
                                    <p className="text-xl font-bold">{connections?.following?.length || "789"}</p>
                                    <p className="text-muted-foreground dark:text-muted-foreground-dark">Following</p>
                                </div>
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-center mt-6 ">
                        <div className="flex rounded-md gap-2 bg-transparent">
                            <Button className={`hover:bg-primary-dark ${type === "Images" && "text-white"}`}
                                variant={type === 'Images' ? "default" : "ghost"}
                                onClick={() => setType('Images')}
                            >
                                <Image className="h-4 w-4 mr-2" />
                                Images
                            </Button>
                            <Button
                                className={`hover:bg-primary-dark ${type === "Videos" && "text-white"}`}
                                variant={type === 'Videos' ? "default" : "ghost"}
                                onClick={() => setType('Videos')}
                            >
                                <Bookmark className="h-4 w-4 mr-2" />
                                Saved
                            </Button>
                        </div>
                    </div>
                    <div className="mt-6">
                        {type === 'Images' && <ImgComponent />}
                    </div>
                </div>
            </Card>
            <input ref={bannerRef} id="banner-upload" onChange={(e) => handleBanner(e, Profile, setBanner, user, dispatch)} type="file" className="hidden" />
            <input ref={profileRef} id="profile-upload" onChange={(e) => handleImages(e, Profile, setProfile, user, dispatch)} type="file" className="hidden" />
        </div>
    )
}