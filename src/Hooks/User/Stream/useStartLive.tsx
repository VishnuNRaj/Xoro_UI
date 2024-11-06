import { Dispatch, SetStateAction, useRef, useState } from "react";
import { toast } from "sonner";

export interface CreateLive {
    Caption: string;
    RelatedTags: string;
    Thumbnail: File | null;
    Description: string;
    Restriction: number;
    Tags: string;
    tags: string[];
}

export default function useStartLive({ setLive }: { setLive: Dispatch<SetStateAction<CreateLive>> }) {
    const [data, setData] = useState<CreateLive>({
        Caption: "",
        Description: "",
        RelatedTags: "",
        Restriction: 14,
        Thumbnail: null,
        Tags: "",
        tags: []
    })
    const inputRef = useRef<HTMLInputElement | null>(null)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0 && files[0].type.startsWith("image/")) {
            setData({ ...data, Thumbnail: files[0] })
        } else toast.error("Select an Image as Thumbnail")
    }
    const handleSubmit = () => {
        if (data && data.Thumbnail) {
            setLive(data)
        } else {
            toast.error("Invalid Credentials");
        }
    }
    const handleRelated = (name: string) => {
        setData({ ...data, RelatedTags: name })
    }
    const handleRestriction = (value: number) => {
        setData({ ...data, Restriction: value })
    }
    const setTagUsers = () => {
        if (!data.Tags.startsWith('#') || data.Tags.length < 2 || data.Tags[1] === '#') return;
        const tag = data.Tags.split('#')[1];
        setData({ ...data, tags: [...data.tags, tag], Tags: "" });
    };
    const handleTagsRemove = (idx: number) => {
        setData({ ...data, tags: [...data.tags].filter((_val, index) => index !== idx) })
    }
    return { handleChange, handleSubmit, handleFile, data, handleRelated, handleRestriction, handleTagsRemove, inputRef, setTagUsers }
}