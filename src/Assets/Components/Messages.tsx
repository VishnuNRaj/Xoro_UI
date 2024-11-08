import { useEffect } from "react";
import { Toaster, toast } from "sonner";
import { Chat } from "@/Store/UserStore/Chat-Management/interfaces";
import { User } from "@/Store/UserStore/Authentication/Interfaces";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSocket } from "@/Hooks/useSocket";
import { useEssentials } from "@/Hooks/useEssentials";
import useOnline from "@/Hooks/useOnline";

interface NotificationData {
  Link: string;
  SenderId: string;
  Message: string;
}

export default function Messages() {
  const { chat, auth } = useEssentials();
  const { user } = auth;
  const socket = useSocket();
  const { online, setOnline } = useOnline();

  useEffect(() => {
    if (user && socket) {
      socket.emit("join", user._id);
    }
  }, [user, socket]);

  const showNotification = (
    data: NotificationData | { user: User; _doc: Chat }
  ) => {
    toast(
      <div className="flex items-start space-x-3">
        <Avatar>
          <AvatarImage
            src={"Link" in data ? data.Link : data.user.Profile}
            alt={"SenderId" in data ? data.SenderId : data.user.Username}
          />
          <AvatarFallback>
            {("SenderId" in data ? data.SenderId : data.user.Username)[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">
            {"SenderId" in data ? data.SenderId : data.user.Username}
          </p>
          <p className="text-sm text-muted-foreground">
            {"Message" in data ? data.Message : data._doc.Message}
          </p>
        </div>
      </div>,
      {
        duration: 4000,
        position: "top-right",
        action: {
          label: "Close",
          onClick: () => toast.dismiss(),
        },
      }
    );
  };

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data: { user: User; _doc: Chat }) => {
      if (
        (!chat && data.user._id !== user?._id) ||
        (chat?.RoomId !== data._doc.RoomId && data.user._id !== user?._id)
      ) {
        showNotification(data);
      }
    };

    const handleStartChat = (RoomId: string) => {
      socket.emit("join", RoomId);
    };

    const handleNewOnline = (data: User) => {
      setOnline([...online, data]);
    };

    const handleNotification = (data: NotificationData) => {
      console.log(data);
      showNotification(data);
    };

    socket.on("newOnline", handleNewOnline);
    socket.on("message", handleMessage);
    socket.on("start-chat", handleStartChat);
    socket.on("notification", handleNotification);

    return () => {
      socket.off("newOnline", handleNewOnline);
      socket.off("message", handleMessage);
      socket.off("start-chat", handleStartChat);
      socket.off("notification", handleNotification);
    };
  }, [socket, chat, user, setOnline]);

  return <Toaster richColors />;
}
