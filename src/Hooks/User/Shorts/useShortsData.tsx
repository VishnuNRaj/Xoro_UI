import { useState, useEffect } from "react";
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
  const [video, setVideo] = useState<Shorts | null>(null);
  const [total, setTotal] = useState(0);
  const { auth, dispatch, navigate } = useEssentials();
  const location = useLocation();
  const { id } = useParams();

  const getMoreShorts = async (token: string) => {
    if (total === 0 || total !== shorts.length) {
      try {
        const { payload }: any = await dispatch(getShorts({ shorts, token }));
        if (!payload.user) return navigate("/login");
        if (!auth.user) dispatch(setUser(payload.user));
        setTotal(payload.total);
        const array = payload.shorts.filter(
          (val: string) => !shorts.includes(val)
        );
        if (!id && array.length > 0) {
          navigate(`/shorts/${array[0]}`);
        }
        setShorts((prevShorts) => [...prevShorts, ...array]);
      } catch (error) {
        console.error(error);
      }
    } else {
      toast.warning("All Shorts Seen");
    }
  };

  const getVideo = async (token: string, videoId: string) => {
    try {
      const { payload }: any = dispatch(getShortsVideo({ token, id: videoId }));
      if (!payload.user) return navigate("/login");
      if (!auth.user) dispatch(setUser(payload.user));
      if (!payload.shorts) {
        toast.error(payload.message);
        navigate("/shorts");
        return;
      }
      setShorts((prevShorts) =>
        [...prevShorts, videoId].filter(
          (value, idx, arr) => arr.indexOf(value) === idx
        )
      );
      setVideo(payload.shorts);
      if (location.pathname !== "/shorts") {
        navigate(`/shorts/${videoId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
  }, [id]);

  return { shorts, video, getMoreShorts, id };
}
