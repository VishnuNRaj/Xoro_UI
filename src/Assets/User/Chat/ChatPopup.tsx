import React from "react";
import ChatWindow from "./ChatWindow";
import ChatComponent from "./ChatComponent";
import { useEssentials } from "@/Hooks/useEssentials";
import { setChat } from "@/Store/UserStore/Chat-Management/ChatSlice";

interface ChatPopupProps {
  chatWindow: boolean;
  setChatWindow: React.Dispatch<
    React.SetStateAction<"notifications" | "chat" | null>
  >;
}

export default function ChatPopup({
  chatWindow,
  setChatWindow,
}: ChatPopupProps) {
  const { chat, dispatch } = useEssentials();

  const closeChat = () => {
    dispatch(setChat(null));
    setChatWindow(null);
  };

  if (!chatWindow) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 top-20 bg-blue-light dark:bg-background w-[360px] border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="min-h-[400px] max-h-screen h-full overflow-hidden mb-2">
        {!chat.chat ? (
          <ChatWindow close={closeChat} />
        ) : (
          <ChatComponent close={closeChat} />
        )}
      </div>
    </div>
  );
}
