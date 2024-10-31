import { lazy, Suspense } from 'react'
import useWindowDimensions from '@/Hooks/useWindowDimesions'
import CommentComponent from '@/Assets/Components/Comments';
import Preloader from '@/Assets/Preloader'
import { useEssentials } from '@/Hooks/useEssentials'
import usePostData from '@/Hooks/User/Home/usePostPage'
const UserToolTip = lazy(() => import("@/Assets/Components/UserTooltip"))
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Button } from '@/components/ui/button'
import { ThumbsUp, ThumbsDown, MessageCircle, Send, Bookmark, MoreVertical } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'

export default function PostShow() {
    const { comments, setComments, dislike, like, count, post, dialog, handleDialogToggle, handleDislike, handleLike, handlePlayPause, play, setDialog, setPlay, videoRef } = usePostData()
    const { width } = useWindowDimensions()
    const { auth, Post,navigate } = useEssentials()

    return (
        <div className='grid grid-cols-1 items-center justify-center space-y-8 w-full h-auto'>
            {Post.loadingPost && <Preloader />}
            {post && (
                <div className="animate-slideInFromLeft p-4 flex h-full items-center justify-center">
                    {dialog && width <= 768 && (
                        <Dialog open={dialog} onOpenChange={handleDialogToggle}>
                            <DialogContent className="flex items-center h-[400px] justify-center dark:border-white border-black rounded-lg bg-blue-light dark:bg-background">
                                <div className="h-full w-full  flex-shrink-0 ">
                                    <CommentComponent PostId={post._id} comments={comments} setComments={setComments} />
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                    <div className="bg-blue-light dark:bg-background text-foreground dark:text-white border border-border dark:border-border-dark rounded-lg w-full flex-shrink-0 md:min-w-[400px] max-w-lg ">
                        <div className="flex items-center px-4 py-3 relative">
                            <img onClick={()=>navigate(`/profile/${post.user?.ProfileLink}`)} className="h-8 w-8 rounded-full object-cover" src={post.user.Profile} alt={post.user.Name} />
                            <div className="ml-3">
                                <span className="text-sm font-semibold antialiased block leading-tight">{post.user.Name}</span>
                                <span className="text-muted-foreground dark:text-muted-foreground-dark text-xs block">{post.user.Username}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="absolute right-2 top-2">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </div>
                        <Carousel className='relative' plugins={[
                    Autoplay({
                        delay: 3000,
                        active:!play
                    }),
                ]}>
                            <CarouselContent>
                                {post.Images.map((image: any, imgIndex: number) => (
                                    <CarouselItem key={imgIndex}>
                                        <div className='md:h-[400px] relative h-[300px] w-full flex items-center justify-center bg-black'>
                                            {image.postType === 'image' ? (
                                                <img
                                                    onClick={() => {
                                                        if (width > 768) {
                                                            setDialog(!dialog)
                                                        }
                                                    }}
                                                    src={image.link}
                                                    alt={"Post image"}
                                                    className='object-contain rounded-md w-full h-full'
                                                />
                                            ) : (
                                                <>
                                                    <video
                                                        ref={videoRef}
                                                        src={image.link}
                                                        className='object-cover w-full h-full'
                                                        onPlay={() => setPlay(true)}
                                                        onPause={() => setPlay(false)}
                                                        onClick={() => {
                                                            handlePlayPause(play)
                                                            setPlay(false)
                                                        }}
                                                    >
                                                        Your browser does not support the video tag.
                                                    </video>
                                                    {!play && (
                                                        <Button
                                                            variant="secondary"
                                                            size="icon"
                                                            className='absolute rounded-full flex items-center justify-center z-50'
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
                                            {post.tags.length > 0 && (
                                                <div className='absolute bottom-3 right-3'>
                                                    <Button variant="secondary" size="sm">{post.tags.length} Tags</Button>
                                                </div>
                                            )}
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                        <div className="flex items-center justify-between mx-4 mt-3 mb-2">
                            <div className="flex gap-5">
                                <Button variant="ghost" size="icon" onClick={handleLike}>
                                    <ThumbsUp className={`h-5 w-5 ${like ? "text-blue-500" : ""}`} />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={handleDislike}>
                                    <ThumbsDown className={`h-5 w-5 ${dislike ? "text-red-500" : ""}`} />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setDialog(!dialog)}>
                                    <MessageCircle className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Send className="h-5 w-5" />
                                </Button>
                            </div>
                            <Button variant="ghost" size="icon">
                                <Bookmark className="h-5 w-5" />
                            </Button>
                        </div>
                        {post.Caption.length > 0 && (
                            <div className={`w-full ${count.like !== 0 ? "mb-0" : "mb-2"} font-semibold mx-4 flex items-center flex-shrink-0 text-sm`}>
                                <h1>{post.Caption}</h1>
                            </div>
                        )}
                        {count.like !== 0 && (
                            <div className="font-semibold text-sm mx-4 items-center mb-4">
                                <h1>{count.like} {count.like > 1 ? "likes" : "like"}</h1>
                                <div className='font-light text-xs text-muted-foreground dark:text-muted-foreground-dark flex items-center'>
                                    <h1 className='mr-1'>liked by {like && `you ${post.reactions.LikesDetails.length > 1 ? "&" : ""}`}</h1>
                                    <Suspense fallback={<span>Loading...</span>}>
                                        <UserToolTip users={[...post.reactions.LikesDetails].filter((item) => item._id !== auth?.user?._id)} />
                                    </Suspense>
                                </div>
                            </div>
                        )}
                    </div>
                    {width > 768 && (
                        <div className='w-[600px] h-full dark:border-white border-black rounded-lg bg-blue-light dark:bg-background ml-10 flex-shrink-0'>
                            <CommentComponent PostId={post._id} comments={comments} setComments={setComments} />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}