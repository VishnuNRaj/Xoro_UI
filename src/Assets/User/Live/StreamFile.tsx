import ChatLoader from '@/Assets/ChatLoader';
import useStreamFile from '@/Hooks/User/Live/useStreamFile';
import { LiveInterface } from '@/Store/UserStore/CommonManagements/interfaces';
import 'video.js/dist/video-js.css';

interface Props {
    video: LiveInterface;
}

export default function StreamFile({ video }: Props) {
    const {
        isLoading,
        videoRef,
        navigate,
        setState,
        state
    } = useStreamFile({ video });

    return (
        <div 
            className="flex flex-col rounded-md w-full h-full bg-blue-light dark:bg-background border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer" 
            onClick={() => navigate(`/live/${video.Key}`)}
        >
            <div 
                className='relative rounded-t-md' 
                onMouseEnter={() => setState(true)} 
                onMouseLeave={() => setState(false)}
            >
                {!state ? (
                    <img
                        className="w-full aspect-video object-cover"
                        src={video.Thumbnail}
                        alt="video_thumbnail"
                    />
                ) : (
                    <div className='relative aspect-video'>
                        {isLoading && (
                            <div className='absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
                                <ChatLoader />
                            </div>
                        )}
                        {video.Completed ? (
                            <video
                                src={video.Video}
                                className='w-full h-full object-cover'
                            />
                        ) : (
                            <video
                                ref={videoRef}
                                src={video.Video}
                                className='video-js vjs-default-skin w-full h-full object-cover'
                            />
                        )}
                    </div>
                )}
            </div>
            <div className="flex flex-row p-4">
                <img
                    src={video.channel[0]?.Logo}
                    alt="channel_logo"
                    className="rounded-full h-8 w-8 object-cover"
                />
                <div className="ml-3 flex-grow">
                    <h3 className="text-gray-900 dark:text-white font-semibold text-sm overflow-hidden">
                        <span className="line-clamp-2">
                            {video.Caption || "No Captions Given"}
                        </span>
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 font-semibold text-xs mt-1">
                        {video.channel[0]?.Name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                        {video.Views} views • {video.Completed ? 'Recorded' : 'Live'}
                    </p>
                </div>
            </div>
        </div>
    );
}