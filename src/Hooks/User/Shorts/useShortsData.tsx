import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  getShorts,
  getShortsVideo,
} from "@/Store/UserStore/Shorts-Management/shortSlice";
import { setUser } from "@/Store/UserStore/Authentication/AuthSlice";
import { Shorts } from "@/Store/UserStore/Shorts-Management/interfaces";
import { useEssentials } from "@/Hooks/useEssentials";
import { getCookie } from "@/Functions/Cookies";

export default function useShortsData() {
  const [shorts, setShorts] = useState<string[]>([]);
  const [videoCache, setVideoCache] = useState<Record<string, Shorts>>({});
  const [total, setTotal] = useState(0);
  const { auth, dispatch, navigate } = useEssentials();
  const location = useLocation();
  const { id } = useParams();

  const getMoreShorts = useCallback(
    async (token: string) => {
      if (total === 0 || total !== shorts.length) {
        try {
          const { payload }: any = await dispatch(getShorts({ shorts, token }));
          console.log(payload);
          if (!payload.user) return navigate("/login");
          if (!auth.user) dispatch(setUser(payload.user));
          setTotal(payload.total);
          const newShorts = payload.shorts.filter(
            (val: string) => !shorts.includes(val)
          );
          if (!id && newShorts.length > 0) {
            navigate(`/shorts/${newShorts[0]}`);
          }
          setShorts((prevShorts) => [...prevShorts, ...newShorts]);
        } catch (error) {
          console.error(error);
        }
      } else {
        toast.warning("All Shorts Seen");
      }
    },
    [total, shorts, id, auth.user, dispatch, navigate]
  );

  const getVideo = useCallback(
    async (token: string, videoId: string) => {
      if (videoCache[videoId]) return;

      try {
        const { payload }: any = await dispatch(
          getShortsVideo({ token, id: videoId })
        );
        console.log(payload, " blah");
        if (!payload.user) return navigate("/login");
        if (!auth.user) dispatch(setUser(payload.user));
        if (!payload.shorts) {
          toast.error(payload.message);
          navigate("/shorts");
          return;
        }
        setVideoCache((prevCache) => ({
          ...prevCache,
          [videoId]: payload.shorts,
        }));
        setShorts((prevShorts) =>
          [...prevShorts, videoId].filter(
            (value, idx, arr) => arr.indexOf(value) === idx
          )
        );
        if (location.pathname !== "/shorts") {
          navigate(`/shorts/${videoId}`);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [videoCache, auth.user, dispatch, navigate, location.pathname]
  );

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      if (id) {
        getVideo(token, id);
      } else {
        getMoreShorts(token);
      }
    } else {
      navigate("/login");
    }
  }, [id, getMoreShorts, getVideo, navigate]);

  const video = useMemo(() => (id ? videoCache[id] : null), [id, videoCache]);

  return {
    shorts,
    video,
    getMoreShorts,
    id,
    videoCache,
  };
}
