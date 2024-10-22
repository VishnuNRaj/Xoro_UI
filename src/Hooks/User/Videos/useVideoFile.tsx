import { useState, useRef, useEffect } from 'react';
import { Video } from '@/Store/UserStore/Video-Management/Interfaces';

export default function useVideoFile(video: Video) {
    const [state, setState] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [duration, setDuration] = useState<string>("");
    const [watching, setWatching] = useState<number>(0);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const handleCanPlayThrough = () => {
        setIsLoading(false);
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const currentTime = videoRef.current.currentTime;
            const duration = videoRef.current.duration;
            setWatching((currentTime / duration) * 100);
        }
    };

    const formatDuration = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const formatted = [
            hrs > 0 ? `${hrs}h` : '',
            mins > 0 ? `${mins}m` : '',
            secs > 0 ? `${secs}s` : ''
        ].filter(Boolean).join(' ');
        return formatted;
    };

    useEffect(() => {
        if (video.Duration) {
            setDuration(formatDuration(parseFloat(video.Duration)));
        }
    }, [video.Duration]);

    return {
        state,
        setState,
        isLoading,
        duration,
        watching,
        videoRef,
        handleCanPlayThrough,
        handleTimeUpdate
    };
};