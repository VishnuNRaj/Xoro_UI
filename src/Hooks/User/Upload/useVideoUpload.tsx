import { useEffect, useState } from 'react'
import { AuthUser } from '@/Store/UserStore/Authentication/AuthSlice'
import useProgress from '@/Hooks/useProgress'
import { getCookie, useToast } from '@/Functions/Cookies'
import { useEssentials } from '@/Hooks/useEssentials'
export default function useVideoUpload() {
    const { dispatch, navigate } = useEssentials()
    const [Video, setVideo] = useState<File | null>(null)
    const [Thumbnail, setThumbnail] = useState<string[]>([])
    const { progress } = useProgress()
    useEffect(() => {
        const token: string | undefined = getCookie('token')
        if (token) {
            dispatch(AuthUser({ token })).then(({ payload }: any) => {
                if (!payload.user) return navigate('/login')
                if (!payload.user.Channel) {
                    useToast("Please Create a Channel", "error")
                    return navigate("/profile")
                }
            })
        } else navigate('/login')
    }, [])
    return { Video, setVideo, Thumbnail, setThumbnail ,progress}
}

