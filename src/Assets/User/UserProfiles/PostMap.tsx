import { useState } from 'react'
import { useEssentials } from '@/Hooks/useEssentials'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { PostImage } from '@/Store/UserStore/Post-Management/Interfaces'

export default function ImgComponent({ post }: { post: PostImage[] }) {
    const { navigate } = useEssentials()
    const [hoverIndex, setHoverIndex] = useState<number | null>(null)
    
    if (!post || post.length === 0) {
        return <div className="text-center font-semibold text-xl text-foreground dark:text-white">Upload Feeds</div>
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 font-semibold">
            {post.map((item, index) => (
                <div
                    key={index}
                    className="relative"
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
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
                    {hoverIndex === index && (
                        <div className="absolute bottom-0 left-0 right-0 p-2 text-darken bg-white/75 dark:bg-background-dark/75 text-foreground text-sm opacity-100 transition-opacity duration-300">
                            <p className='float-left flex mr-2'>
                                <span className="mr-1 flex"><ThumbsUp className='w-6 h-6 font-semibold' /> </span>{item.Likes}
                            </p>
                            <p className='float-left flex'>
                                <span className="mr-1 flex"><ThumbsDown className='w-6 h-6 font-semibold' /> </span>{item.Dislikes}
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}