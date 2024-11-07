import { useEffect, useState } from "react";
import { useSocket } from "../useSocket";
import { Comments } from "@/Store/UserStore/CommonManagements/interfaces";
import { User } from "@/Store/UserStore/Authentication/Interfaces";
import { useEssentials } from "../useEssentials";
import { getCookie, useToast } from "@/Functions/Cookies";
import { addCommentThunk, getCommentThunk } from "@/Store/UserStore/CommonManagements/CommonService";
import { searchUsers } from "@/Store/UserStore/ProfileManagement/ProfileService";
import { PayloadAction } from "@reduxjs/toolkit";

export const useComments = ({ PostId, live }: { PostId: string, live?: boolean }) => {
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

    const addComment = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setText(value);

        const words = value.split(" ");
        const lastWord = words.pop() || '';

        if (lastWord.startsWith("@")) {
            const searchValue = lastWord.slice(1).toLowerCase();
            const token: string | undefined = getCookie("token");

            if (token) {
                if (searchValue.length > 0) {
                    const response = await searchUsers({ search: searchValue, token: token })
                    console.log(response)
                    setUsers(response.users)
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
                console.log(response)
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