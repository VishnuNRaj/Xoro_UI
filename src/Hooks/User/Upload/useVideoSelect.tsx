import { useRef } from 'react';
import { toast } from 'sonner';
import { useEssentials } from '@/Hooks/useEssentials';
interface selectVideoProps {
    Video: File | null;
    setVideo: React.Dispatch<React.SetStateAction<File | null>>;
    setThumbnail: React.Dispatch<React.SetStateAction<string[]>>;
    trim: File | Blob | null;
    setTrim: React.Dispatch<React.SetStateAction<File | Blob | null>>;
}

export default function useVideoSelect({ setVideo, Video, setThumbnail, trim, setTrim }: selectVideoProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { navigate } = useEssentials();

    const handleThumbnails = async () => {
        if (!Video) return;
        try {
            const thumbnails = await generateThumbnails(URL.createObjectURL(trim as File));
            setThumbnail(thumbnails);
        } catch (error) {
            console.error('Error generating thumbnails:', error);
        }
    };

    const generateThumbnails = async (videoSrc: string) => {
        return new Promise<string[]>(async (resolve, reject) => {
            try {
                const video = document.createElement('video');
                video.src = videoSrc;
                video.addEventListener('loadedmetadata', async () => {
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');

                    if (!context) {
                        reject(new Error('Canvas context is not supported.'));
                        return;
                    }

                    const { videoWidth, videoHeight } = video;
                    canvas.width = videoWidth;
                    canvas.height = videoHeight;

                    const thumbs: string[] = [];
                    const interval = video.duration / 2;
                    for (let time = 0; time <= video.duration && thumbs.length < 3; time += interval) {
                        video.currentTime = time;
                        await video.play();
                        context.drawImage(video, 0, 0, videoWidth, videoHeight);
                        thumbs.push(canvas.toDataURL('image/jpeg'));
                    }

                    resolve(thumbs);
                });

                video.addEventListener('error', (error) => {
                    reject(error);
                });

                await video.load();
            } catch (error) {
                reject(error);
            }
        });
    };

    const validateFile = (file: File) => {
        if (file) {
            if (file.type.startsWith("video/")) {
                setVideo(file);
                setTrim(file)
            } else {
                toast.error('Please select a video file', {
                    position: 'top-right',
                    duration: 1000,
                });
            }
        }
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            validateFile(selectedFile);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) {
            validateFile(droppedFile);
        }
    };

    return { handleButtonClick, handleDragOver, handleDrop, handleFileInputChange, navigate, handleThumbnails, fileInputRef }
}

