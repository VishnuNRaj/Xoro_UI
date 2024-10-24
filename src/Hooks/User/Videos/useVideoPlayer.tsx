import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useEssentials } from "@/Hooks/useEssentials";
import { Video } from "@/Store/UserStore/Video-Management/Interfaces";
import { getVideo } from "@/Store/UserStore/Video-Management/VideoSlice";
import { setUser } from "@/Store/UserStore/Authentication/AuthSlice";
import { Comments } from "@/Store/UserStore/CommonManagements/interfaces";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Player from "video.js/dist/types/player";
import config from "@/Configs/config";
import { useSocket } from "@/Hooks/useSocket";
import { getCookie, useToast } from "@/Functions/Cookies";

export default function useVideoPlayer() {
  const { VideoLink } = useParams();
  const { navigate, dispatch, video, auth } = useEssentials();
  const { loadingVideo } = video;
  const [videoData, setVideoData] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comments[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);
  const [dialog, setDialog] = useState(false);
  const [subs, setSubs] = useState(0);
  const [subscribe, setSubscribe] = useState(false);
  const socket = useSocket();
  useEffect(() => {
    const token: string | undefined = getCookie("token");
    if (!token) navigate("/login");
    if (!VideoLink) navigate("/videos");
    if (token && VideoLink) {
      dispatch(getVideo({ token, VideoLink })).then((response: any) => {
        console.log(response);
        if (!response.payload.user) navigate("/login");
        if (!response.payload.Video) {
          useToast("No Video Found", "error");
          navigate("/videos");
        }
        dispatch(setUser(response.payload.user));
        setVideoData(response.payload.Video);
        const video: Video = response.payload.Video;
        setSubs(video.Channel[0].Subsribers.length);
        console.log(
          video.Channel[0].Subsribers.includes(response.payload.user._id),
          response.payload.user._id
        );
        setSubscribe(
          video.Channel[0].Subsribers.includes(response.payload.user._id)
        );
        if (videoRef.current) {
          const player = videojs(videoRef.current, {
            controls: true,
            autoplay: true,
            fluid: true,
            liveui: true,
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
            sources: [
              {
                src: `${config.SERVER}/videos/${response.payload.Video.Key}/index.m3u8`,
                type: "application/x-mpegURL",
              },
            ],
          });
          player.aspectRatio("16:9");
          playerRef.current = player;
          player.fill(true);
          return () => {
            player.dispose();
          };
        }
      });
    } else navigate("/login");
  }, [VideoLink, navigate, dispatch]);
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
  const handleSubscribe = () => {
    if (auth.user && videoData) {
      socket?.emit("subscribeChannel", auth.user._id, videoData.Channel[0]._id);
      setSubs((prev) => prev + 1);
      return setSubscribe(true);
    } else return;
  };
  const handleUnsubscribe = () => {
    if (auth.user && videoData) {
      socket?.emit(
        "unsubscribeChannel",
        auth.user._id,
        videoData.Channel[0]._id
      );
      setSubs((prev) => prev - 1);
      return setSubscribe(false);
    } else return;
  };
  return {
    videoRef,
    playerRef,
    loadingVideo,
    comments,
    setComments,
    videoData,
    handlePlayerClick,
    dialog,
    setDialog,
    handleSubscribe,
    handleUnsubscribe,
    subs,
    subscribe,
  };
}
