import { useEssentials } from "@/Hooks/useEssentials"
import { setUser } from '@/Store/UserStore/Authentication/AuthSlice';
import { showPost } from '@/Store/UserStore/Post-Management/PostSlice';
import { Connections } from '@/Store/UserStore/Authentication/Interfaces';
import { handleBanner, handleImages } from '@/Functions/Profile';
import { getCookie } from "@/Functions/Cookies";
import { useRef, useEffect, useState } from "react";



export default function useProfileData() {
    const { navigate, dispatch, auth, Post, profile } = useEssentials();

    const { user, loading } = auth;
    const { loadingPost, post } = Post;
    const { loadingProfile } = profile;

    const [connections, setConnections] = useState<Connections | null>(null);
    const [type, setType] = useState<string>('Images');

    const [Profile, setProfile] = useState<{
        Image: File | null;
        Show: string;
    }>({
        Image: null,
        Show: ''
    });

    const [banner, setBanner] = useState<{
        Image: File | null;
        Show: string;
    }>({
        Image: null,
        Show: ''
    });

    useEffect(() => {
        const token = getCookie('token');
        if (token) {
            dispatch(showPost({ token })).then((state: any) => {
                if (!state.payload.user) {
                    navigate('/login');
                }
                setProfile({ ...Profile, Show: state.payload.user.Profile });
                setBanner({ ...banner, Show: state.payload.user.Banner });
                dispatch(setUser(state.payload.user));
                setConnections(state.payload.connections);
            });
        } else navigate('/login');
    }, []);

    const [open, setOpen] = useState(false);
    const [channel, setChannel] = useState(false);
    const [edit, setEdit] = useState(false)
    const [state, setState] = useState(false);

    const bannerRef = useRef<HTMLInputElement | null>(null);
    const profileRef = useRef<HTMLInputElement | null>(null);

    return {
        user,
        loading,
        loadingPost,
        loadingProfile,
        connections,
        type,
        Profile,
        banner,
        open,
        channel,
        state,
        bannerRef,
        profileRef,
        setConnections,
        setType,
        setProfile,
        setBanner,
        setOpen,
        setChannel,
        setState,
        dispatch,
        handleBanner,
        handleImages,
        post,
        edit,
        setEdit
    };
};


