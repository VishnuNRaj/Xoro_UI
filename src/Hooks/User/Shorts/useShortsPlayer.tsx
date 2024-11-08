import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "@/Hooks/useSocket";
import { Shorts } from "@/Store/UserStore/Shorts-Management/interfaces";
import { Comments } from "@/Store/UserStore/CommonManagements/interfaces";
import { getCookie } from "@/Functions/Cookies";

interface UseShortsPlayerProps {
  videoCache: { [key: string]: Shorts };
  shorts: string[];
  id: string | undefined;
  getMoreShorts: (token: string) => void;
}

export default function useShortsPlayer({ videoCache, shorts, id, getMoreShorts }: UseShortsPlayerProps) {
  const [dialog, setDialog] = useState(false);
  const [subs, setSubs] = useState(0);
  const [subscribe, setSubscribe] = useState(false);
  const [comments, setComments] = useState<Comments[]>([]);
  const navigate = useNavigate();
  const socket = useSocket();
  const touchStartY = useRef(0);

  const video = videoCache[id || ""];

  useEffect(() => {
    if (video && video.channel) {
      setSubs(video.channel.Subsribers.length);
      setSubscribe(video.channel.Subsribers.includes(video.channel._id));
    }
  }, [video]);

  const handleKeyDown = (e: KeyboardEvent) => {
    const currentIndex = shorts.indexOf(id || "");
    if (e.code === "ArrowDown" && currentIndex < shorts.length - 1) {
      navigate(`/shorts/${shorts[currentIndex + 1]}`);
    } else if (e.code === "ArrowUp" && currentIndex > 0) {
      navigate(`/shorts/${shorts[currentIndex - 1]}`);
    } else if (e.code === "ArrowDown" && currentIndex === shorts.length - 1) {
      const token = getCookie("token");
      if (token) getMoreShorts(token);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const currentIndex = shorts.indexOf(id || "");
    if (touchStartY.current - touchEndY > 100) {
      if (shorts[currentIndex + 1]) navigate(`/shorts/${shorts[currentIndex + 1]}`);
    } else if (touchEndY - touchStartY.current > 100 && currentIndex > 0) {
      navigate(`/shorts/${shorts[currentIndex - 1]}`);
    }
  };

  const handleSubscribe = () => {
    if (video && video.channel) {
      socket?.emit("subscribeChannel", video.channel._id);
      setSubs((prev) => prev + 1);
      setSubscribe(true);
    }
  };

  const handleUnsubscribe = () => {
    if (video && video.channel) {
      socket?.emit("unsubscribeChannel", video.channel._id);
      setSubs((prev) => prev - 1);
      setSubscribe(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shorts, id]);

  return {
    dialog,
    setDialog,
    subs,
    subscribe,
    comments,
    setComments,
    handleKeyDown,
    handleTouchStart,
    handleTouchMove,
    handleSubscribe,
    handleUnsubscribe,
  };
}
