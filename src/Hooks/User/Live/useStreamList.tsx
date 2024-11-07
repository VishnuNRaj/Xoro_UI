import { useState, useEffect, useRef } from "react"
import { useEssentials } from "@/Hooks/useEssentials"
import { getCookie } from "@/Functions/Cookies"
import { setUser } from "@/Store/UserStore/Authentication/AuthSlice"
import { getLiveVideos } from "@/Store/UserStore/CommonManagements/CommonService"
import { LiveInterface } from "@/Store/UserStore/CommonManagements/interfaces"
import { toast } from "sonner"

export default function useStreamList() {
    const [videos, setVideos] = useState<LiveInterface[]>([])
    const [isLive, setIsLive] = useState(true)
    const [loading, setLoading] = useState(true)
    const { navigate, auth, dispatch } = useEssentials()
    const [cat, setCat] = useState<string>("")
    const totalRef = useRef<number | null>(null)

    const handleLive = (live: boolean) => {
        setIsLive(live)
    }

    const getLive = async (token: string, videos: LiveInterface[]) => {
        try {
            setLoading(true)
            if (!totalRef.current || totalRef.current < videos.length) {
                const ids = videos.length > 0 ? videos.map((val) => val._id) : [];
                const response = await getLiveVideos({ token, isLive, type: cat, videos: ids });
                if (!response.user) {
                    navigate("/login");
                    return;
                }
                if (!auth.user) {
                    dispatch(setUser(response.user));
                }
                totalRef.current = response.count;
                setVideos([...videos, ...response.live].filter((val, idx, arr) => arr.indexOf(val) === idx));
            } else {
                toast.warning("No More Videos")
            }
        } catch (error) {
            console.error('Error fetching live videos:', error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        const token = getCookie("token");
        if (token) {
            totalRef.current = null
            getLive(token, []);
        }
        else navigate("/login")
    }, [isLive, cat])

    return { cat, videos, setCat, isLive, handleLive, loading }
}