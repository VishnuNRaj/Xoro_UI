import { getCookie } from "@/Functions/Cookies"
import { LikeDislikeRemoveThunk } from "@/Store/UserStore/Post-Management/PostSlice"
import { useRef, useState } from "react"
import { useEssentials } from "../useEssentials"
import { Comments } from "@/Store/UserStore/CommonManagements/interfaces"

export default function useReaction({ base }: { base: string }) {
    const { dispatch, navigate } = useEssentials()
    const [comments, setComments] = useState<Comments[]>([])
    const likePost: Function = (postId: string) => {
        const token = getCookie("token")
        dispatch(LikeDislikeRemoveThunk({ postId, token, type: "like", base })).then((state: any) => {
            if (state.payload.status === 202) return navigate("/login")
            return true
        })
    }
    const dislikePost: Function = (postId: string) => {
        const token = getCookie("token")
        dispatch(LikeDislikeRemoveThunk({ postId, token, type: "dislike", base })).then((state: any) => {
            if (state.payload.status === 202) return navigate("/login")
            return true
        })
    }
    const removeReaction: Function = (postId: string) => {
        const token = getCookie("token")
        dispatch(LikeDislikeRemoveThunk({ postId, token, type: "remove", base })).then((state: any) => {
            if (state.payload.status === 202) return navigate("/login")
            return true
        })
    }
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const handlePlayPause = (play: boolean) => {
        if (play) {
            videoRef?.current?.pause();
        } else {
            videoRef?.current?.play();
        }
    };

    return { likePost, dislikePost, removeReaction, handlePlayPause, videoRef, comments, setComments }
}