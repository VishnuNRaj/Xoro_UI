import React, { SetStateAction, useState, Suspense, lazy } from "react"
import { PostImage } from "@/Store/UserStore/Post-Management/Interfaces"
import { useEssentials } from "@/Hooks/useEssentials"
import CommentComponent from '@/Assets/Components/Comments';
import { Comments } from "@/Store/UserStore/CommonManagements/interfaces"
import useReaction from "@/Hooks/User/useReactions"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, MessageCircle, Send, Bookmark, MoreVertical, PlayCircleIcon } from "lucide-react"
import Autoplay from "embla-carousel-autoplay"

const UserToolTip = lazy(() => import("@/Assets/Components/UserTooltip"))

interface Props {
    post: PostImage
    open: boolean
    setOpen: React.Dispatch<SetStateAction<boolean>>
    setPost: React.Dispatch<SetStateAction<PostImage>>
    count: { like: number; comment: number; dislike: number }
    setCount: React.Dispatch<SetStateAction<{ like: number; comment: number; dislike: number }>>
    like: boolean
    setLike: React.Dispatch<SetStateAction<boolean>>
    dislike: boolean
    setDisLike: React.Dispatch<SetStateAction<boolean>>
    setComments: React.Dispatch<SetStateAction<Comments[]>>
    comments: Comments[]
}

const PostDialog: React.FC<Props> = ({ post, open, setOpen, count, dislike, like, setCount, setDisLike, setLike }) => {
    const { dislikePost, likePost, removeReaction, handlePlayPause, videoRef, comments, setComments } = useReaction({ base: "post" })
    const [play, setPlay] = useState(false)
    const { auth } = useEssentials()
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[900px] dark:bg-background dark:text-white bg-blue-light p-0" >
                <div className="w-full rounded-md border-2 border-border h-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 w-full">
                        <div className="flex-shrink-0 w-full">
                            <div className="flex items-center px-4 py-3 relative">
                                <img crossOrigin="anonymous" className="h-8 w-8 rounded-full object-cover" src={post.user.Profile} alt={post.user.Name} />
                                <div className="ml-3">
                                    <span className="text-sm font-semibold antialiased block leading-tight">{post.user.Name}</span>
                                    <span className="text-muted-foreground text-xs block">{post.user.Username}</span>
                                </div>
                                <div className="absolute right-5">
                                    <Button variant="ghost" className="dark:text-white hover:bg-transparent" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="h-full">
                                <div className="h-[360px] w-full bg-black rounded-md justify-center flex items-center">
                                    <Carousel className='relative' plugins={[
                                        Autoplay({
                                            delay: 3000,
                                            active: !play
                                        }),
                                    ]}>
                                        <CarouselContent>
                                            {post.Images.map((image: any, imgIndex: number) => (
                                                <CarouselItem key={imgIndex} autoFocus>
                                                    <div className='h-[360px] w-full flex items-center rounded-md justify-center bg-black'>

                                                        {image.postType === 'image' ? (
                                                            <img
                                                                src={image.link}
                                                                alt={""}
                                                                className='object-contain items-stretch content-stretch rounded-md w-full h-full'
                                                            />
                                                        ) : (
                                                            <>
                                                                <video
                                                                    ref={videoRef}
                                                                    src={image.link}
                                                                    className='object-contain h-[360px]'
                                                                    onPlay={() => setPlay(true)}
                                                                    onPause={() => setPlay(false)}
                                                                    onClick={() => {
                                                                        handlePlayPause(play)
                                                                        setPlay(false)
                                                                    }}
                                                                    style={{ height: "400px" }}
                                                                >
                                                                    Your browser does not support the video tag.
                                                                </video>
                                                                {!play && (
                                                                    <Button
                                                                        variant="default"
                                                                        size="icon"
                                                                        className='absolute rounded-full text-black flex items-center justify-center z-50 bg-white/70 hover:bg-white/70'
                                                                        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                                                                        onClick={() => handlePlayPause(play)}
                                                                    >
                                                                        <PlayCircleIcon className="w-6 h-6"/>
                                                                    </Button>
                                                                )}
                                                            </>
                                                        )}
                                                        {post.tags.length > 0 && (
                                                            <div className='absolute bottom-3 right-3'>
                                                                <Button variant="secondary" size="sm" className='bg-white/70 hover:bg-white/70 text-black'>{post.tags.length} Tags</Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                    </Carousel>
                                </div>
                                <div className="flex items-center justify-between mx-4 mt-3 mb-2">
                                    <div className="flex gap-5">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={async () => {
                                                if (!like || dislike) {
                                                    await likePost(post._id)
                                                    setCount({ ...count, like: count.like + 1, dislike: count.dislike - (dislike ? 1 : 0) })
                                                } else {
                                                    await removeReaction(post._id)
                                                    setCount({ ...count, like: count.like - 1 })
                                                }
                                                setDisLike(false)
                                                setLike(!like)
                                            }}
                                        >
                                            <ThumbsUp className={`h-5 w-5 ${like ? "text-blue-500" : ""}`} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={async () => {
                                                if (like || !dislike) {
                                                    await dislikePost(post._id)
                                                    setCount({ ...count, dislike: count.dislike + 1, like: count.like - (like ? 1 : 0) })
                                                } else {
                                                    await removeReaction(post._id)
                                                    setCount({ ...count, dislike: count.dislike - 1 })
                                                }
                                                setLike(false)
                                                setDisLike(!dislike)
                                            }}
                                        >
                                            <ThumbsDown className={`h-5 w-5 ${dislike ? "text-red-500" : ""}`} />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <MessageCircle className="h-5 w-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <Send className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    <div className="flex">
                                        <Button variant="ghost" size="icon">
                                            <Bookmark className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                                {count.like !== 0 && (
                                    <div className="font-semibold text-sm mx-4 flex items-center mt-2 mb-4">
                                        <h1>
                                            {count.like} {count.like > 1 ? "likes" : "like"}
                                        </h1>
                                        <div className="font-light text-xs ml-4 text-muted-foreground flex items-center">
                                            <h1 className="mr-1">liked by {like && `you ${post.reactions.LikesDetails.length > 1 ? "&" : ""}`}</h1>
                                            <Suspense fallback={<div>Loading...</div>}>
                                                <UserToolTip users={[...post.reactions.LikesDetails].filter((item) => item._id !== auth?.user?._id)} />
                                            </Suspense>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-shrink-0 p-2 w-auto">
                            <div className="h-full rounded-md bg-muted">
                                <div className="h-full border border-border dark:border-white border-black max-h-full bg-blue-light dark:bg-background rounded-lg">
                                    <CommentComponent PostId={post._id} comments={comments} setComments={setComments} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default PostDialog