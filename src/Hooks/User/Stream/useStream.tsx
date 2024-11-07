import { getCookie } from "@/Functions/Cookies";
import { useEssentials } from "@/Hooks/useEssentials";
import { AuthUser } from "@/Store/UserStore/Authentication/AuthSlice";
import { LiveInterface } from "@/Store/UserStore/CommonManagements/interfaces";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { CreateLive } from "./useStartLive";
import config from "@/Configs/config";
import { toast } from "sonner";
import { createLive } from "@/Store/UserStore/CommonManagements/CommonService";

export default function useStream() {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const { navigate, dispatch } = useEssentials()
    const [liveStream, setLiveStream] = useState<LiveInterface | null>(null)
    const socketRef = useRef<Socket | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        const token = getCookie('token');
        if (token) {
            dispatch(AuthUser({ token })).then((state: any) => {
                if (!state.payload.user) {
                    navigate('/login');
                } else setLoading(false)
            });
        } else navigate("/login")
    }, [])
    const [live, setLive] = useState<CreateLive>({
        Caption: "",
        Description: "",
        RelatedTags: "",
        Restriction: 14,
        Thumbnail: null,
        Tags: "",
        tags: []
    })
    const [started, setStarted] = useState(false)
    const startLive = (streamKey: string) => {
        if (!stream) return;
        socketRef.current?.emit('start-stream', { streamKey });
        setStarted(true)
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                const reader = new FileReader();
                reader.onload = () => {
                    const arrayBuffer = reader.result as ArrayBuffer;
                    socketRef.current?.emit('stream-data', { streamKey, data: arrayBuffer });
                };
                reader.readAsArrayBuffer(event.data);
            }
        };
        mediaRecorderRef.current.start(500);
    };

    const stopLive = (streamKey: string) => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        socketRef.current?.emit('end-stream', { streamKey });
        setStarted(false)
    };
    const [state, setState] = useState(false)
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            console.log('Camera stream started');
            setStream(mediaStream);
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const startScreenShare = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            console.log('Screen share stream started');
            setStream(mediaStream);
        } catch (error) {
            console.error('Error accessing screen:', error);
        }
    };
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (stream && videoRef.current) {
            console.log('Setting video stream to video element');
            videoRef.current.srcObject = stream;
        }
    }, [stream]);
    useEffect(() => {
        socketRef.current = io(config.SOCKET);
        return () => {
            socketRef.current?.disconnect();
        };
    }, []);
    useEffect(() => {
        if (started) {
            setLoading(false)
            toast.success("Streaming Currently Active", {
                duration: 1500
            })
        } else if (!started && liveStream) {
            setLiveStream(null)
            setLive({
                Caption: "",
                Description: "",
                RelatedTags: "",
                Restriction: 14,
                Thumbnail: null,
                Tags: "",
                tags: []
            })
            toast.success("Live Stream Completed")
        }
    }, [started])
    const sendData = async () => {
        const token: string | undefined = getCookie("token")
        const { Caption, Description, RelatedTags, Restriction, Thumbnail, tags } = live
        if (token && Thumbnail) {
            setLoading(true)
            const response: any = await createLive({ Caption, Description, RelatedTags, Restriction, Thumbnail, Hashtags: tags, token })
            console.log(response)
            if (response.status === 202) return navigate("/login")
            if (response.live) {
                setLiveStream(response.live)
                return response.live.Key
            } else {
                toast.warning(response.message)
                return null;
            }
        }
    }
    return { live, setLive, state, sendData, loading, setState, stream, startScreenShare, startCamera, videoRef, startLive, stopLive, started, liveStream }
}