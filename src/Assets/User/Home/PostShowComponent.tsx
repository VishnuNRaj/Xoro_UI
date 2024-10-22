import { lazy, Suspense } from 'react'
import { PostImage } from '@/Store/UserStore/Post-Management/Interfaces'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import PostDialog from './PostDialog'
import CommentComponent from './CommentComponent'
import usePost from '@/Hooks/User/Home/usePost'
const UserToolTip = lazy(() => import("@/Assets/Components/UserTooltip"))
import useWindowDimensions from '@/Hooks/useWindowDimesions'
import { MoreVertical, ThumbsUp, ThumbsDown, MessageCircle, Send, Bookmark } from 'lucide-react'
import { useEssentials } from '@/Hooks/useEssentials'
import Autoplay from 'embla-carousel-autoplay'

interface PostShowComponentProps {
    postData: PostImage;
}

export default function PostShowComponent({ postData }: PostShowComponentProps) {
    const { comments, count, dialog, dislike, setPlay, like, handleDialogToggle, handleDislike, handleLike, setComments, setCount,
        setDialog, videoRef, handlePlayPause, play, post, setPost } = usePost(postData)

    const { width } = useWindowDimensions()
    const { auth } = useEssentials()

    return (
        <div className="animate-slideInFromLeft p-4">
            {dialog && width > 768 && (
                <PostDialog
                    open={dialog}
                    setPost={setPost}
                    comments={comments}
                    setComments={setComments}
                    setOpen={setDialog}
                    post={post}
                    count={count}
                    setCount={setCount}
                    like={like}
                    setLike={handleLike}
                    dislike={dislike}
                    setDisLike={handleDislike}
                />
            )}
            {dialog && width <= 768 && (
                <Dialog open={dialog} onOpenChange={handleDialogToggle}>
                    <DialogContent className='px-2 bg-blue-light dark:bg-background text-white'>
                        <CommentComponent PostId={postData._id} comments={comments} setComments={setComments} />
                    </DialogContent>
                </Dialog>
            )}

            <div className="bg-blue-light dark:bg-background border border-border rounded-lg flex-shrink-0 lg:min-w-[420px] lg:max-w-lg">
                <div className="flex items-center px-4 py-3 relative">
                    <img crossOrigin="anonymous" className="h-8 w-8 rounded-full object-cover" src={post.user?.Profile} alt={post.user?.Name} />
                    <div className="ml-3">
                        <span className="text-sm font-semibold antialiased block leading-tight text-black dark:text-white">{post.user?.Name}</span>
                        <span className="text-muted-foreground text-xs block dark:text-gray-300">{post.user?.Username}</span>
                    </div>
                    <div className='absolute right-5'>
                        <Button variant="ghost" className='text-black dark:text-white hover:bg-transparent' size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <Carousel className='relative' plugins={[
                    Autoplay({
                        delay: 3000,
                        active:!play
                    }),
                ]}>
                    <CarouselContent>
                        {post.Images.map((image: any, imgIndex: number) => (
                            <CarouselItem key={imgIndex} autoFocus>
                                <div className='md:h-[400px] relative h-[300px] w-full flex items-center justify-center bg-black'>

                                    {image.postType === 'image' ? (
                                        <img
                                            onClick={() => {
                                                if (width > 768) {
                                                    setDialog(!dialog)
                                                }
                                            }}
                                            src={image.link}
                                            alt={""}
                                            className='object-contain rounded-md w-full h-full'
                                        />
                                    ) : (
                                        <>
                                            <video
                                                ref={videoRef}
                                                src={image.link}
                                                className='object-contain h-[400px]'
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
                                                    className='absolute rounded-full flex items-center justify-center z-50 bg-white/70 hover:bg-white/70'
                                                    style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                                                    onClick={() => handlePlayPause(play)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                                    </svg>
                                                </Button>
                                            )}
                                        </>
                                    )}
                                    {postData.tags.length > 0 && (
                                        <div className='absolute bottom-3 right-3'>
                                            <Button variant="secondary" size="sm" className='bg-white/70 hover:bg-white/70 text-black'>{post.tags.length} Tags</Button>
                                        </div>
                                    )}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <div className="flex items-center justify-between mx-4 mt-3 mb-2">
                    <div className="flex gap-5">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLike}
                            className='hover:bg-transparent'
                        >
                            <ThumbsUp className={`h-5 w-5 ${like ? "text-blue-500" : "text-black dark:text-white"}`} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDislike}
                            className='hover:bg-transparent'
                        >
                            <ThumbsDown className={`h-5 w-5 ${dislike ? "text-red-500" : "text-black dark:text-white"}`} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setDialog(!dialog)
                            }}
                            className='hover:bg-transparent'
                        >
                            <MessageCircle className="h-5 w-5 text-black dark:text-white" />
                        </Button>
                        <Button variant="ghost" size="icon" className='hover:bg-transparent'>
                            <Send className="h-5 w-5 text-black dark:text-white" />
                        </Button>
                    </div>
                    <div className="flex">
                        <Button variant="ghost" size="icon" className='hover:bg-transparent'>
                            <Bookmark className="h-5 w-5 text-black dark:text-white" />
                        </Button>
                    </div>
                </div>
                {postData.Caption.length > 0 && (
                    <div className={`w-full ${count.like !== 0 ? "mb-0" : "mb-2"} font-semibold mx-4 flex items-center flex-shrink-0 text-sm text-black dark:text-white`}>
                        <h1>{postData.Caption}</h1>
                    </div>
                )}
                {count.like !== 0 && (
                    <div className="font-semibold text-sm mx-4 items-center mb-4">
                        <h1 className="text-black dark:text-white">{count.like} {count.like > 1 ? "likes" : "like"}</h1>
                        <div className='font-light text-xs text-gray-600 dark:text-gray-300 flex items-center'>
                            <h1 className='mr-1'>liked by {like && `you ${post.reactions.LikesDetails.length > 1 ? "&" : ""}`}</h1>
                            <Suspense fallback={<div>Loading...</div>}>
                                <UserToolTip users={[...post.reactions.LikesDetails].filter((item) => item._id !== auth?.user?._id)} />
                            </Suspense>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}