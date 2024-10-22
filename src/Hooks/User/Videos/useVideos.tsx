import { useState, useEffect, useCallback } from 'react';
import { useEssentials } from '@/Hooks/useEssentials';
import { getVideos } from '@/Store/UserStore/Video-Management/VideoSlice';
import { setUser, resetState } from '@/Store/UserStore/Authentication/AuthSlice';
import { getCookie } from '@/Functions/Cookies';

export default function useVideos() {
    const { auth, navigate, dispatch, video } = useEssentials();
    const { loading } = auth;
    const { Videos, loadingVideo } = video;
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchVideos = useCallback(async () => {
        if (loadingVideo || !hasMore) return;

        const token = getCookie('token');
        if (!token) {
            navigate("/login");
            return;
        }

        const random = Math.floor(Math.random());
        const response: any = await dispatch(getVideos({ token, skip, random }));

        if (response.payload.user) {
            dispatch(setUser(response.payload.user));
        } else if (response.payload.status === 202) {
            dispatch(resetState());
            navigate('/login');
            return;
        }

        if (!response.payload.Videos || response.payload.Videos.length === 0) {
            setHasMore(false);
        } else {
            setSkip(prevSkip => prevSkip + 10);
        }
    }, [skip, loadingVideo, hasMore]);

    useEffect(() => {
        fetchVideos();
    }, []);

    return { Videos, loading, loadingVideo, hasMore, fetchVideos };
};