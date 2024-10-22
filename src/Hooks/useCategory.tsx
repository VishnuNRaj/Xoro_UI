import React, { useState } from "react"
import { Category } from "@/Store/UserStore/CommonManagements/interfaces"
import { getCookie } from "@/Functions/Cookies"
import { getCategory } from "@/Store/UserStore/CommonManagements/CommonService"
import { useEssentials } from "@/Hooks/useEssentials"

export default function useCategory() {
    const { navigate } = useEssentials()
    const [category, setCategory] = useState<Category[]>([])
    const [search, setSearch] = useState("")
    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        if (e.target.value.length > 0) {
            const token: string | undefined = getCookie("token")
            if (token) {
                const response: any = await getCategory({ token, PostId: e.target.value })
                if (response.status === 202) return navigate("/login")
                setCategory(response.category)
            } else navigate("/login")
        } else setCategory([])
    }
    const emptySearch = () => {
        setCategory([])
        setSearch("")
    }
    const getAllCategory = async () => {
        const token = getCookie("token")
        if (token) {
            const response: any = await getCategory({ token, PostId: "null" })
            if (response.status === 202) return navigate("/login")
            setCategory(response.category)
        } else navigate("/login")
    }
    const emptyCategory = () => {
        setCategory([])
    }
    return { category, search, handleSearchChange, emptySearch, getAllCategory, emptyCategory }
}

