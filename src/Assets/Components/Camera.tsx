import React from 'react';
import Webcam from 'react-webcam';
import { Button } from "@/components/ui/button"
import { Trash, Image, RefreshCw, Video, Camera as CameraIcon, StopCircle } from 'lucide-react';
import useCamera from '@/Hooks/Components/useCamera';

interface CameraProps {
    setMedia: React.Dispatch<React.SetStateAction<File[]>>;
}

const Camera: React.FC<CameraProps> = ({ setMedia }) => {
    const { captureImage,
        clearAllMedia,
        startRecording,
        stopRecording,
        setCam,
        deleteMedia,
        handleDragStart,
        handleDrop,
        handleFileChange,
        recording,
        mediaFiles,
        webcamRef,
        cam } = useCamera()

    return (
        <div className="flex flex-col items-center justify-center relative">
            {mediaFiles.length < 5 && (
                <>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        className='rounded-lg border-4 max-w-xl border-primary'
                        videoConstraints={{
                            facingMode: cam,
                        }}
                        mirrored
                    />
                    <div className={`sticky -mt-16 left-0 right-0 flex justify-center text-white`}>
                        {!recording ? (
                            <>
                                <Button variant="default" size="icon" className="m-2" onClick={() => document.getElementById('profile-upload')?.click()}>
                                    <Image className="h-4 w-4" />
                                </Button>
                                <input multiple id="profile-upload" onChange={handleFileChange} type="file" className="hidden" />
                                <Button variant="default" size="icon" className="m-2" onClick={() => setCam(cam === 'user' ? 'environment' : 'user')}>
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button variant="default" size="icon" className="m-2" onClick={startRecording}>
                                    <Video className="h-4 w-4" />
                                </Button>
                                <Button variant="default" size="icon" className="m-2" onClick={captureImage}>
                                    <CameraIcon className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <Button variant="ghost" size="icon" className="m-2 bg-accent-light animate-pulse" onClick={stopRecording}>
                                <StopCircle className="h-4 w-4" />
                            </Button>
                        )}
                        {mediaFiles.length > 0 && (
                            <Button variant="outline" size="icon" className="m-2" onClick={clearAllMedia}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </>
            )}
            {mediaFiles.length >= 5 && (
                <>
                    <h1 className='dark:text-white text-xl font-semibold '>Maximum Post Reached</h1>
                    {mediaFiles.length > 0 && (
                        <Button variant="default" className="m-2 bg-accent-light text-white font-semibold" onClick={clearAllMedia}>
                            <Trash className="h-4 w-4 mr-2" /> Clear All
                        </Button>
                    )}
                </>
            )}
            <div className="w-[80%] grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-5">
                {mediaFiles.map((file, index) => (
                    <div key={index} className='rounded-md p-3 media-item relative' data-index={index} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                        {file.type.startsWith('image') ? (
                            <div>
                                <img crossOrigin="anonymous" src={URL.createObjectURL(file)} className='w-40 h-40 aspect-square object-cover rounded-md' alt={file.name} draggable onDragStart={(e) => handleDragStart(e, index)} />
                                <div className="absolute top-4 right-4">
                                    <Button variant="default" size="icon" className="h-6 w-6 font-semibold text-white bg-accent-light" onClick={() => deleteMedia(index)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <video
                                    crossOrigin="anonymous"
                                    className='w-full rounded-md border-2 border-border'
                                    src={URL.createObjectURL(file)}
                                    controls={false}
                                    onMouseOver={(e) => {
                                        e.currentTarget.controls = true;
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.controls = false;
                                    }}
                                    draggable
                                    onDragStart={(e: any) => handleDragStart(e, index)}
                                />
                                <div className="absolute top-4 right-4">
                                    <Button variant="default" size="icon" className="h-6 w-6 font-semibold text-white bg-accent-light" onClick={() => deleteMedia(index)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {mediaFiles.length > 0 && (
                <div className='w-full flex items-center justify-center'>
                    <Button variant="default" className="mt-4" onClick={() => setMedia(mediaFiles)}>
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Camera;