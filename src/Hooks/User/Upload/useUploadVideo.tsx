import { useRef, useState } from 'react'
import { getCookie } from '@/Functions/Cookies'
import { uploadVideo } from '@/Store/UserStore/Video-Management/VideoSlice'
import { toast } from 'sonner'
import { useEssentials } from '@/Hooks/useEssentials'
export interface detailsProps {
    Video: File,
    Thumbnail: string[],
    setThumbnail: React.Dispatch<React.SetStateAction<string[]>>
}
export default function useUploadVideo({ Thumbnail, Video, setThumbnail }: detailsProps) {
    const { auth, dispatch, navigate } = useEssentials()
    const { user } = auth;
    const thumbRef = useRef<HTMLInputElement>(null)
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const handleThumbnailButtonClick = () => {
        thumbRef.current?.click()
    }
    const [, setProgress] = useState<number | null>(null)
    const defaultData = {
        Caption: '',
        Description: '',
        Thumbnail: '',
        Hashtags: '',
        CommentsOn: true,
        PremiumContent: false,
        ListedContent: true,
        RelatedTags: '',
        Restriction: '18',
    }
    const [data, setData] = useState(defaultData)
    const [Hashtags, setHashtags] = useState<string[]>([])
    const addThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = e.target.files?.[0];
        if (!file) return;

        const reader: FileReader = new FileReader();
        reader.onload = () => {
            const base64: string | null = reader.result as string | null;
            if (base64) {
                Thumbnail.splice(0, 1)
                setThumbnail([...Thumbnail, base64]);
                setData((prev) => {
                    return { ...prev, Thumbnail: base64 }
                })
            }
        };

        reader.readAsDataURL(file);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }
    const upload = () => {
        const token: string | undefined = getCookie('token')
        if (token) {
            const { Caption, CommentsOn, Description, ListedContent, PremiumContent, RelatedTags, Restriction, Thumbnail } = data
            const complete = {
                Caption,
                Description,
                Duration: videoRef.current ? videoRef.current.duration.toString() : '',
                RelatedTags,
                Restriction: parseInt(Restriction),
                Thumbnail,
                Hashtags,
                Settings: {
                    CommentsOn,
                    ListedContent,
                    PremiumContent,
                },
                Video: Video,
                token: token,
                setProgress
            }
            dispatch(uploadVideo(complete)).then((state: any) => {
                console.log(state.payload)
                if (state.payload.status === 202) navigate('/login')
                toast[(state.payload.status !== 201 && state.payload.status !== 500 ? 'success' : 'error')](state.payload.message)
                state.payload.status !== 201 && state.payload.status !== 500 ? navigate('/profile') : undefined
            })
        }
    }
    const handleContext = (name: string) => {
        setData({ ...data, RelatedTags: name })
    }

    const clear = () => {
        setData(defaultData)
        setThumbnail([])
    }
    return { handleChange, handleContext, clear, upload, Hashtags, setHashtags, addThumbnail, data, handleThumbnailButtonClick, user, thumbRef, videoRef, setData }
}

