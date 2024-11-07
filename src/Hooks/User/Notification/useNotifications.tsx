import { useRef, useEffect, useState } from "react";
import { getNotifications } from "@/Store/UserStore/CommonManagements/CommonService";
import { Notification as Notify } from "@/Store/UserStore/Authentication/Interfaces";
import { useSocket } from "@/Hooks/useSocket";
import { useEssentials } from "@/Hooks/useEssentials";
import { getCookie } from "@/Functions/Cookies";
import fction from "@/Functions/WebPush";

export default function useNotifications() {
  const [allow, setAllow] = useState(false);
  const [notifications, setNotifications] = useState<Notify[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const socket = useSocket();
  const skipRef = useRef(0);
  const { auth, navigate } = useEssentials();

  const getAllowed = async () => {
    const response: any = await fction(false);
    if (response && socket && auth.user) {
      socket?.emit("allowed", auth.user._id, response.endpoint);
    }
  };

  const getNotify = async (token: string) => {
    try {
      const response = await getNotifications({
        token,
        key: skipRef.current.toString(),
      });
      if (response.status === 202) navigate("/login");
      if (!response?.notifications || !response.notifications?.messages) {
        setHasMore(false);
        return;
      }
      if (response.notifications && response.notifications.messages) {
        setNotifications((prev) => [...prev, ...response.notifications.messages]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const token = getCookie("token");
    if (socket && token) {
      getAllowed();
      getNotify(token);
    } else if (!token) navigate("/login");
  }, [socket]);

  useEffect(() => {
    socket?.on("allow_notification", ({ send }: { send: boolean }) => {
      setAllow(send);
    });
  }, [socket]);

  const toggleAllow = async () => {
    const response: any = await fction(false);
    if (response && socket && auth.user) {
      if (allow) {
        socket?.emit("disallow", auth.user._id, response.endpoint);
        setAllow(false);
      } else {
        socket?.emit("allow", auth.user._id, response.endpoint);
        setAllow(true);
      }
    }
  };

  const clear = () => {
    socket?.emit("emptyMsg", auth.user?._id);
    setNotifications([]);
  };

  const loadMore = async () => {
    skipRef.current += 25;
    const token = getCookie("token");
    if (token) {
      await getNotify(token);
    } else navigate("/login");
  };

  return {
    allow,
    notifications,
    hasMore,
    toggleAllow,
    clear,
    loadMore,
  };
}