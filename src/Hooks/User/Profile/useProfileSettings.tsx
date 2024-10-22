import { useEssentials } from "@/Hooks/useEssentials"
import { editProfile } from "@/Store/UserStore/ProfileManagement/ProfileSlice"
import { setUser } from '@/Store/UserStore/Authentication/AuthSlice';
import { toast } from "sonner"
import { getCookie } from "@/Functions/Cookies";
import React, { useEffect, useState } from "react";



export default function useProfileSettings() {
    const { dispatch, navigate, auth } = useEssentials()
    const [clear, setClear] = useState(false)
    const [data, setData] = useState<{ Name: string, Username: string, Description: string[], DescString: string }>({ Description: [], Name: "", Username: "", DescString: "" })
    const [type, setType] = useState("Edit");
    const { user, loading } = auth
    useEffect(() => {
        if (user) {
            setData({
                Description: [...user.Description],
                Name: user.Name,
                Username: user.Username,
                DescString: ""
            })
        }
    }, [clear])
    const handleType = (value: string) => {
        setType(value)
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    const handleDescription = () => {
        setData({ ...data, Description: [...data.Description, data.DescString], DescString: "" })
    }
    const handleDescriptionDelete = (idx: number) => {
        const desc: string[] = data.Description.filter((_val, i) => i !== idx)
        setData({ ...data, Description: desc })
    }
    const handleClear = () => {
        setClear(!clear)
    }
    const handleUpdate = () => {
        const usernameRegex = /^[a-z0-9_.-]+$/;
        if (!data.Name || !data.Username || !usernameRegex.test(data.Username)) {
            return toast.error(!data.Name && !data.Username ? "Enter Name and Username" : !data.Name ? "Enter Name Properly" : "Enter Username Properly")
        }
        const token: string | undefined = getCookie("token")
        if (!token) {
            return navigate("/login")
        }
        const { Description, Name, Username } = data
        if (token) dispatch(editProfile({ Description, Name, Username, token })).then(({ payload }: any) => {
            console.log(payload)
            if (payload.status === 202) return navigate("/login")
            dispatch(setUser(payload.user))
            const types: "error" | "success" = payload.status === 200 ? "success" : "error"
            toast[types](payload.message)
        })
    }
    return { handleChange, data, handleDescription, handleClear, loading, handleUpdate, type, handleType, handleDescriptionDelete }
}