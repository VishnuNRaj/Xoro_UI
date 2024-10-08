import { useEffect, useState, useRef } from 'react'
import { useEssentials, getCookie, useToast } from '../../Functions/CommonFunctions'
import { getPosts, LikeDislikeRemoveThunk } from '../../Store/UserStore/Post-Management/PostSlice'
import { PostImage } from '../../Store/UserStore/Post-Management/Interfaces'
import { Connections, User } from '../../Store/UserStore/Authentication/Interfaces'
import { setUser } from '../../Store/UserStore/Authentication/AuthSlice'
import { searchUsers } from '../../Store/UserStore/ProfileManagement/ProfileSlice'
import { addCommentThunk, getCommentThunk } from '../../Store/UserStore/CommonManagements/CommonService'
import { Comments } from '../../Store/UserStore/CommonManagements/interfaces'
import { PayloadAction } from '@reduxjs/toolkit'
import { useSocket } from '../../Socket'

const useHooks = () => {
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


export const useFunctions = ({ base }: { base: string }) => {
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

export const useComments = ({ PostId, live }: { PostId: string, live?: any }) => {
    const { dispatch, navigate } = useEssentials();
    const [text, setText] = useState("");
    const [comments, setComments] = useState<Comments[]>([])
    const [users, setUsers] = useState<User[] | null>(null);
    const socket = useSocket()
    const [tags, setTags] = useState<{ Username: string, UserId: string }[]>([]);
    useEffect(() => {
        const token: string | undefined = getCookie("token")
        if (token) {
            dispatch(getCommentThunk({ token, PostId: PostId })).then((response: any) => {
                setComments(response.payload.comments.filter((value: any, idx: number, arr: any[]) => arr.indexOf(value) === idx))
            })
        }
    }, [PostId])
    const getTags = (value: string[], tags: User[]) => {
        value.forEach((data, idx, arr) => {
            const response = arr[idx - 1] === "@" ? tags.find((tag) => tag._id === data) : null;
            if (response) {
                arr[idx] = "@" + response.Username;
                arr[idx - 1] = "";
            }
        })
        return value.join(" ")
    };

    const addComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setText(value);

        const words = value.split(" ");
        const lastWord = words.pop() || '';

        if (lastWord.startsWith("@")) {
            const searchValue = lastWord.slice(1).toLowerCase();
            const token: string | undefined = getCookie("token");

            if (token) {
                if (searchValue.length > 0) {
                    dispatch(searchUsers({ search: searchValue, token: token })).then((response: any) => {
                        setUsers(response.payload.users);
                    });
                } else {
                    setUsers(null);
                }
            } else {
                navigate("/login");
            }
        }
    };

    const addTag = (Username: string, UserId: string) => {
        const parts = text.split("@");
        const beforeAt = parts.slice(0, -1).join("@");
        const newText = `${beforeAt}@${Username} `;
        setText(newText);
        setTags([...tags, { UserId, Username }]);
        setUsers(null);
    };
    useEffect(() => {
        if (socket && live) {
            socket.emit("join", PostId)
        }
    }, [socket])
    useEffect(() => {
        if (socket && live) {
            socket.on("new_comment", async (data: Comments) => {
                const newData = [...comments, data].filter((value, idx, arr) => arr.indexOf(value) === idx).map((val) => val)
                setComments(newData)
            })
        }
    }, [socket])
    const setupTags: Function = () => {
        let newTxt = text.split("@").filter((value) => value.length > 0)
        if (text.split("@").length > 1) {
            newTxt = []
            text.split("@").forEach((txt) => {
                const Text = txt.split(" ")
                if (Text.length > 1) {
                    Text.forEach((values) => {
                        const res = tags.find((value) => values === value.Username)
                        if (res) {
                            newTxt.push("@", res.UserId)
                        } else if (values.trim().length > 0) newTxt.push(values)
                    })
                } else if (txt.trim().length > 0) {
                    newTxt.push(txt)
                }
            })
        }
        return newTxt
    }

    const upload = async (PostId: string) => {
        const comment: string[] = setupTags()
        if (comment.length > 0) {
            const token: string | undefined = getCookie("token")
            if (token) {
                const response: PayloadAction<any> = await dispatch(addCommentThunk({ token, PostId, Comment: comment }))
                if (response.payload.status === 202) return navigate("/login")
                if (response.payload.Comment) {
                    setText("")
                    setUsers(null)
                    setTags([])
                    if (live) {
                        socket?.emit("live_comment", response.payload.Comment)
                    }
                    return response.payload.Comment
                }
            }
        } else useToast("Add Something", "error")
    }

    return { addComment, text, users, tags, setTags, addTag, upload, getTags, comments, setComments };
};





export default useHooks