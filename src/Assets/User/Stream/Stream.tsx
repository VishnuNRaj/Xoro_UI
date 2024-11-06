import { Toaster } from 'sonner';
import { Button } from "@/components/ui/button"
import { Camera, Monitor, Upload, Tv } from 'lucide-react';
import CreateStream from './CreateStream';
import Preloader from '@/Assets/Preloader';
import useWindowDimensions from '@/Hooks/useWindowDimesions';
import useStream from '@/Hooks/User/Stream/useStream';

export default function StreamComponent() {
    const { setLive, live, setState, state, startCamera, startScreenShare, loading, started, stopLive, sendData, liveStream, stream, videoRef, startLive } = useStream();
    const { width } = useWindowDimensions();

    return (
        <div className="h-full dark:bg-transparent bg-gray-200 font-semibold dark:text-white">
            <div className="w-full md:h-[75vh] flex flex-col md:items-center rounded-md aspect-video p-2 justify-center">
                {loading && <Preloader />}
                <Toaster richColors position="top-right" />
                {stream ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        className={`${width < 968 ? 'w-full h-full' : 'aspect-video object-cover w-[60%]'} mt-2 rounded-md shadow-md shadow-gray-700 dark:shadow-gray-500 md:border-0 border-2`}
                    />
                ) : (
                    <div className="flex items-center justify-center gap-4">
                        <Button
                            onClick={startCamera}
                            className="w-32 text-white"
                        >
                            <Camera className="mr-2 h-4 w-4" /> Camera
                        </Button>
                        <Button
                            onClick={startScreenShare}
                            className="w-32 text-white"
                        >
                            <Monitor className="mr-2 h-4 w-4" /> Screen
                        </Button>
                    </div>
                )}
                {!live.Thumbnail && state && <CreateStream live={live} setLive={setLive} state={state} setState={setState} />}
                {!live.Thumbnail && !state && (
                    <div className="fixed right-[20px] top-[80px]">
                        <Button onClick={() => setState(true)} className="w-32 text-white">
                            <Upload className="mr-2 h-4 w-4" /> Create Live
                        </Button>
                    </div>
                )}
            </div>
            <div className='w-full flex items-center justify-center mt-2 h-[40px]'>
                {started ? (
                    <Button 
                        onClick={async () => {
                            if (liveStream) stopLive(liveStream.Key)
                        }} 
                        className='h-full w-[100px] bg-accent-dark hover:bg-accent-light text-white'
                    >
                        <Tv className="mr-2 h-4 w-4" /> Stop
                    </Button>
                ) : (
                    <Button 
                        onClick={async () => {
                            if (live.Thumbnail && stream) {
                                const key: string | null = await sendData()
                                if (key) startLive(key)
                            }
                            else setState(true)
                        }} 
                        className='h-full w-[100px] bg-primary-dark hover:bg-primary-light text-white'
                    >
                        <Tv className="mr-2 h-4 w-4" /> {live.Thumbnail ? "Start" : "Create"}
                    </Button>
                )}
            </div>
        </div>
    );
};

