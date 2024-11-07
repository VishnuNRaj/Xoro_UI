import config from "@/Configs/config";
import { getCookie } from "@/Functions/Cookies";
import { useEssentials } from "@/Hooks/useEssentials";
import { useSocket } from "@/Hooks/useSocket";
import { setUser } from "@/Store/UserStore/Authentication/AuthSlice";
import { getLiveVideo } from "@/Store/UserStore/CommonManagements/CommonService";
import {
  Comments,
  LiveInterface,
} from "@/Store/UserStore/CommonManagements/interfaces";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import videojs from "video.js";
import Player from "video.js/dist/types/player";

export default function useViewStream() {
  const [live, setLive] = useState<LiveInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();
  const [comments, setComments] = useState<Comments[]>([]);
  const { navigate, dispatch, auth } = useEssentials();
  const { key } = useParams();
  const getVideo = async (token: string, key: string) => {
    const response = await getLiveVideo({ token, key });
    if (!response.user) navigate("/login");
    if (!response.live) {
      toast.error(response.message);
      navigate("/live");
    }
    console.log(response);
    dispatch(setUser(response.user));
    setLive(response.live);
    setSubs(response.live.channel[0].Subsribers.length);
    setLoading(false);
    setSubscribe(
      response.live.channel[0].Subsribers.includes(response.user._id)
    );
  };

  const [subscribe, setSubscribe] = useState(false);

  const handleSubscribe = () => {
    if (auth.user && live && socket) {
      socket?.emit("subscribeChannel", auth.user._id, live.channel[0]._id);
      setSubs((prev) => prev + 1);
      return setSubscribe(true);
    } else return;
  };

  const handleUnsubscribe = () => {
    if (auth.user && live && socket) {
      socket?.emit("unsubscribeChannel", auth.user._id, live.channel[0]._id);
      setSubs((prev) => prev - 1);
      return setSubscribe(false);
    } else return;
  };

  const handleSubscribeChange = useCallback(() => {
    if (subscribe) {
      handleUnsubscribe();
    } else {
      handleSubscribe();
    }
  }, [subscribe, handleSubscribe, handleUnsubscribe]);

  const [subs, setSubs] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    const token = getCookie("token");
    if (token && key) {
      getVideo(token, key);
    } else if (!key) {
      toast.error("No Live Stream Found");
      return navigate("/live");
    } else navigate("/login");
  }, [key]);

  useEffect(() => {
    if (live && videoRef.current) {
      const player = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        fluid: true,
        liveui: true,
        html5: {
          hls: {
            withCredentials: false,
            smoothQualityChange: true,
            liveSyncDurationCount: 3, // Number of segments for live syncing
            maxBufferLength: 10, // Max buffer length in seconds
            liveMaxLatencyDurationCount: 2, // Max live latency in segments
          },
        },
        preload: "auto",
        controlBar: {
          playToggle: true,
          volumePanel: { inline: true },
          currentTimeDisplay: true,
          timeDivider: true,
          durationDisplay: true,
          progressControl: true,
          liveDisplay: true,
          seekToLive: true,
          remainingTimeDisplay: true,
          customControlSpacer: true,
          playbackRateMenuButton: true,
          chaptersButton: true,
          descriptionsButton: true,
          subsCapsButton: true,
          audioTrackButton: true,
          pictureInPictureToggle: true,
          fullscreenToggle: true,
        },
      });
      player.aspectRatio("16:9");
      playerRef.current = player;
      playerRef.current.src(`${config.SERVER}/live/${key}/index.m3u8`);
      player.fill(true);
      return () => {
        player.dispose();
      };
    }
  }, [live]);

  useEffect(() => {
    if (socket && live) {
      socket?.emit("join", live._id);
    }
  }, [live, socket]);

  const [dialog, setDialog] = useState(false);
  const handleDialogChange = useCallback((isOpen: boolean) => {
    setDialog(isOpen);
  }, []);

  const handlePlayerClick = (event: React.KeyboardEvent) => {
    event.preventDefault();
    const time = playerRef.current?.currentTime();
    if (time && playerRef.current) {
      if (event.code === "ArrowRight") {
        playerRef.current.currentTime(time + 10);
      } else if (event.code === "ArrowLeft") {
        playerRef.current.currentTime(time - 10);
      } else if (event.code === "Space" || event.code === "K") {
        playerRef.current.paused()
          ? playerRef.current.play()
          : playerRef.current.pause();
      }
    }
  };

  return {
    live,
    socket,
    comments,
    setComments,
    loading,
    videoRef,
    subs,
    setSubs,
    subscribe,
    handleSubscribeChange,
    dialog,
    handleDialogChange,
    handlePlayerClick,
    setDialog,
  };
}
