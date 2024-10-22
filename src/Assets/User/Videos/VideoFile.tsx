import { Video } from '@/Store/UserStore/Video-Management/Interfaces';
import { useEssentials } from '@/Hooks/useEssentials';
import useVideoFile from '@/Hooks/User/Videos/useVideoFile';
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react"

interface Props {
    video: Video;
}

export default function VideoFile({ video }: Props) {
    const { navigate } = useEssentials();
    const {
        state,
        setState,
        isLoading,
        duration,
        watching,
        videoRef,
        handleCanPlayThrough,
        handleTimeUpdate
    } = useVideoFile(video);

    return (
        <motion.div
            className="relative group block p-2 h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="flex dark:bg-background bg-blue-light dark:text-white border border-border flex-col rounded-md w-full h-full" onClick={() => navigate(`/videos/${video.VideoLink}`)}>
                <video className='w-full' src={video.Video} ref={videoRef} hidden></video>
                <div className='rounded-md bg-background relative' onMouseEnter={() => setState(true)} onMouseLeave={() => setState(false)}>
                    {!state ? (
                        <img
                            className="w-full rounded-t-md object-cover aspect-video"
                            src={video.Thumbnail}
                            alt="video_thumbnail"
                            loading="lazy"
                        />
                    ) : (
                        <div className='relative aspect-video'>
                            {isLoading && (
                                <div className='absolute inset-0 flex items-center justify-center bg-background bg-opacity-50'>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                </div>
                            )}
                            <video
                                ref={videoRef}
                                src={video.Video}
                                onCanPlayThrough={handleCanPlayThrough}
                                className='w-full h-full object-cover'
                                autoPlay
                                muted
                                loop
                                onTimeUpdate={handleTimeUpdate}
                            ></video>
                            <div className="absolute bottom-0 left-0 h-1 rounded-r-full bg-primary" style={{ width: `${watching}%` }}>
                                <button className='absolute -right-2 -top-2.5'><i className='fa fa-circle text-xs text-primary'></i></button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex flex-row mt-2 ml-4">
                    <img
                        src={video.Channel[0]?.Logo}
                        alt="channel_logo"
                        className="rounded-full h-8 w-8 mt-1 object-cover"
                        loading="lazy"
                    />
                    <div className="w-[80%]">
                        <span className="text-foreground text-ellipsis break-words font-semibold max-w-full text-sm px-2 line-clamp-1">
                            {video.Caption === '' ? "No Captions Given" : video.Caption}
                        </span>
                        <span className="text-muted-foreground font-semibold text-xs px-2">{video.Channel[0]?.Name}</span>
                        <span className="text-muted-foreground font-medium text-xs pl-2">
                            {video.Views} views • {duration}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

