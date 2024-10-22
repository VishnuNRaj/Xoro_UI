import React, { useMemo } from 'react';
import useSlider from '@/Hooks/User/useSlider';
import useVideoSelect from '@/Hooks/User/Upload/useVideoSelect';
import { Slider } from "@mui/material"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconArrowLeft } from '@tabler/icons-react';

interface SelectVideoProps {
    Video: File | null;
    setVideo: React.Dispatch<React.SetStateAction<File | null>>;
    setThumbnail: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function SelectVideo({ setVideo, Video, setThumbnail }: SelectVideoProps) {
    const { start, duration, handleSlide, end, valueText, handleTrimVideo, setTrim, trim } = useSlider({ video: Video, type: "video" });
    const { fileInputRef, handleButtonClick, handleDragOver, handleDrop, navigate, handleFileInputChange, handleThumbnails } = useVideoSelect({ setThumbnail, Video, setVideo, trim, setTrim })

    const MemoizedVideo = useMemo(() => {
        if (Video && trim) {
            return (
                <video src={URL.createObjectURL(trim)} className='rounded-lg w-full' controls></video>
            );
        }
        return null;
    }, [Video, trim]);

    return (
        <div className="sm:px-8 md:px-16 sm:py-8 flex" onDragOver={handleDragOver} onDrop={handleDrop}>
            <main className="md:w-2/3 w-full h-full mx-auto max-w-screen-lg">
                <article className="relative h-full flex flex-col bg-blue-light dark:bg-background text-gray-900 dark:text-white shadow-xl rounded-md">
                    <div className="float-left w-[35px] mt-3 ml-3">
                        <Button variant="secondary" className="text-white hover:bg-secondary-dark" size="icon" onClick={() => navigate(-1)}>
                            <IconArrowLeft />
                        </Button>
                    </div>
                    <section className="h-full overflow-auto p-8 w-full flex flex-col">
                        {!Video ? (
                            <header className="border-dashed border-2 border-gray-400 dark:border-gray-600 py-12 flex flex-col justify-center items-center">
                                <p className="mb-3 font-semibold flex flex-wrap justify-center">
                                    <span>Drag and drop your</span>&nbsp;<span>files anywhere or</span>
                                </p>
                                <Input
                                    ref={fileInputRef}
                                    id="hidden-input"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileInputChange}
                                    accept="video/*"
                                />
                                <Button
                                    variant="secondary"
                                    onClick={handleButtonClick}
                                    className='text-white'
                                >
                                    Upload a file
                                </Button>
                            </header>
                        ) : (
                            <>
                                <h1 className="pt-8 pb-3 font-semibold sm:text-lg">To Upload</h1>
                                <ul id="gallery" className="flex flex-1 flex-wrap -m-1">
                                    {!trim && (
                                        <li id="empty" className="h-full w-full text-center flex flex-col items-center justify-center">
                                            <img className="mx-auto w-32" src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png" alt="No files selected" />
                                            <span className="text-small text-gray-500 dark:text-gray-400">No files selected</span>
                                        </li>
                                    )}
                                    {MemoizedVideo}
                                </ul>
                                {Video && (
                                    <div className="w-full mt-4">
                                        <h2 className="font-semibold mb-2">Trim Video</h2>
                                        <Slider
                                            className="p-3 bg-blue-100 dark:bg-blue-light"
                                            getAriaLabel={() => 'Temperature range'}
                                            min={0}
                                            max={duration || 2}
                                            valueLabelFormat={valueText}
                                            value={[start, end]}
                                            onChange={handleSlide}
                                            valueLabelDisplay="auto"
                                            color="success"
                                        />
                                        <div className="flex justify-between mt-2 text-sm">
                                            <span>{valueText(start)}</span>
                                            <span>{valueText(end)}</span>
                                        </div>
                                        <div className="flex justify-center mt-4">
                                            <Button variant={"default"} className='text-white' onClick={handleTrimVideo}>Trim</Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                    <footer className="flex justify-end px-8 pb-8 pt-4">
                        <Button
                            onClick={() => {
                                setVideo(trim as File);
                                handleThumbnails();
                            }}
                            disabled={!Video}
                            className={`${Video && "text-white"}`}
                        >
                            Continue
                        </Button>
                        <Button variant="default" onClick={() => setVideo(null)} className="ml-3 bg-accent-light hover:bg-accent text-white">
                            Clear
                        </Button>
                    </footer>
                </article>
            </main>
        </div>
    );
};