import { useEffect, useState } from 'react'
import { getCookie } from '@/Functions/Cookies'
import { getPosts } from '@/Store/UserStore/Post-Management/PostSlice'
import { PostImage } from '@/Store/UserStore/Post-Management/Interfaces'
import { Connections, User } from '@/Store/UserStore/Authentication/Interfaces'
import { setUser } from '@/Store/UserStore/Authentication/AuthSlice'
import { useEssentials } from '@/Hooks/useEssentials'


export default function usePosts() {
    const { dispatch, navigate } = useEssentials()
    const [skip, setSkip] = useState<number>(0)
    const [post, setPost] = useState<PostImage[]>([])
    const [noMore, setNoMore] = useState(false)
    const [connections, setConnections] = useState<Connections | null>(null)
    const [recommend, setRecommend] = useState<User[]>([])
    useEffect(() => {
        const token: string | undefined = getCookie("token")
        if (token) {
            dispatch(getPosts({ token, skip })).then((state: any) => {
                console.log(state.payload.post)
                if (!state.payload.user) return navigate("/login")
                dispatch(setUser(state.payload.user))
                if (state.payload.post.length === 0) {
                    setNoMore(true)
                }
                setPost([...post, ...state.payload.post].filter((val, idx, arr) => arr.indexOf(val) === idx))
                setConnections(state.payload.connections)
                setRecommend(state.payload.recommendations || [])
            })
        } else navigate("/login")
    }, [skip])
    const skipping = () => {
        setSkip(skip + 10)
    }
    return { post, connections, setConnections, setPost, recommend, skipping, noMore }
}