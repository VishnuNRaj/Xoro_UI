import { deletePost, setPosts } from '@/Store/UserStore/Post-Management/PostSlice'
import { getCookie } from '@/Functions/Cookies'
import { useEssentials } from '@/Hooks/useEssentials'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2, EyeOff, Eye, MessageSquare } from 'lucide-react'

export default function ImgComponent() {
    const { navigate, dispatch, Post } = useEssentials()
    const { post } = Post

    if (!post || post.length === 0) {
        return <div className="text-center font-semibold text-xl text-foreground dark:text-white">Upload Feeds</div>
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 font-semibold">
            {post.map((item, index) => (
                <div
                    key={index}
                    className="relative"
                >
                    {item.Images[0].postType === 'image' ? (
                        <img
                            src={item.Images[0].link}
                            alt=''
                            onClick={() => navigate(`/post/${item.ShareLink}`)}
                            className='object-cover border-2 border-border dark:border-border-dark overflow-hidden aspect-square cursor-pointer rounded-md'
                        />
                    ) : (
                        <video
                            className='cursor-pointer aspect-square w-full'
                            onClick={() => navigate(`/post/${item.ShareLink}`)}
                            src={item.Images[0].link}
                            controls
                        ></video>
                    )}
                    <div className="absolute font-semibold top-2 right-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="p-1 rounded-full bg-white/50 text-foreground dark:text-white focus:outline-none">
                                    <MoreVertical className="h-4 w-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40 bg-blue-light dark:bg-background">
                                <DropdownMenuItem className="text-foreground dark:text-white hover:bg-blue-light/75 dark:hover:bg-background-dark/75">
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive dark:text-white hover:bg-destructive/10 dark:hover:bg-destructive-dark/10"
                                    onClick={() => {
                                        const token: string | undefined = getCookie('token')
                                        if (token) {
                                            dispatch(deletePost({ token, PostId: item._id })).then((state: any) => {
                                                if (state.payload.status === 202) {
                                                    navigate('/')
                                                }
                                                dispatch(setPosts(post.filter((_item, i) => index !== i)))
                                            })
                                        }
                                    }}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                                <DropdownMenuItem className=" dark:text-white hover:bg-blue-light/75 dark:hover:bg-background-dark/75">
                                    {item.Hidden ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
                                    {item.Hidden ? 'Unhide' : 'Hide'}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-foreground dark:text-white hover:bg-blue-light/75 dark:hover:bg-background-dark/75">
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    {item.CommentsOn ? 'Comments Off' : 'Comments On'}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    
                </div>
            ))}
        </div>
    )
}