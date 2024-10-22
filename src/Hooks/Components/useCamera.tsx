import React, { useRef, useState } from 'react';

export default function useCamera() {
    const webcamRef = useRef<any>(null);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [recording, setRecording] = useState(false);
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [cam, setCam] = useState<'user' | 'environment'>('environment')

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const draggedIndex = parseInt(event.dataTransfer.getData('index'));
        const droppedIndex = parseInt(event.currentTarget.getAttribute('data-index')!);
        if (draggedIndex !== droppedIndex) {
            const newMediaFiles = [...mediaFiles];
            const temp = newMediaFiles[draggedIndex];
            newMediaFiles[draggedIndex] = newMediaFiles[droppedIndex];
            newMediaFiles[droppedIndex] = temp;
            setMediaFiles(newMediaFiles);
        }
    };

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
        event.dataTransfer.setData('index', index.toString());
    };

    const startRecording = () => {
        if (webcamRef.current) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: cam, frameRate: 60 }, audio: true })
                .then((stream) => {
                    const mediaRecorder = new MediaRecorder(stream);
                    const chunks: Blob[] = [];

                    mediaRecorder.ondataavailable = (e) => {
                        if (e.data.size > 0) {
                            chunks.push(e.data);
                        }
                    };

                    mediaRecorder.onstop = () => {
                        const blob = new Blob(chunks, { type: 'video/webm' });
                        const url = URL.createObjectURL(blob);
                        console.log('Recording stopped:', url);
                        setRecording(false);
                        setMediaStream(null);
                        setMediaFiles(prevFiles => [...prevFiles, new File([blob], `video-${Date.now()}.webm`, { type: 'video/webm' })]);
                    };

                    mediaRecorder.start();
                    setRecording(true);
                    setMediaStream(stream);
                })
                .catch((error) => {
                    console.error('Error accessing media devices:', error);
                });
        }
    };

    const stopRecording = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
        }
    };

    const captureImage = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            fetch(imageSrc)
                .then((res) => res.blob())
                .then((blob) => {
                    console.log('Captured image:', blob);
                    setMediaFiles(prevFiles => [...prevFiles, new File([blob], `image-${Date.now()}.jpeg`, { type: 'image/jpeg' })]);
                })
                .catch((error) => {
                    console.error('Error capturing image:', error);
                });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).filter((file: File) => file.type.split('/')[0] === 'image' || file.type.split('/')[0] === 'video');
            console.log(files)
            setMediaFiles([...mediaFiles,...files])
        }
    };

    const deleteMedia = (index: number) => {
        setMediaFiles(prevFiles => prevFiles.filter((_file, i) => i !== index));
    };

    const clearAllMedia = () => {
        setMediaFiles([]);
    };

    return {
        clearAllMedia,deleteMedia,handleDragStart,handleDrop,handleFileChange,captureImage,stopRecording,startRecording,recording,setCam,mediaFiles,webcamRef,cam
    }
}