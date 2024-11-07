import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, MessageCircle, LogOut, Menu } from "lucide-react";
import ChatPopup from "@/Assets/User/Chat/ChatPopup";
import Notifications from "@/Assets/User/Notification/Notifications";
import { removeCookie } from "@/Functions/Cookies";
import { resetState } from "@/Store/UserStore/Authentication/AuthSlice";
import { useEssentials } from "@/Hooks/useEssentials";

const menuItems = [
  {
    icon: LogOut,
    label: "Logout",
    color: "bg-accent-light",
    hover: "bg-accent-dark",
  },
  {
    icon: MessageCircle,
    label: "Chat",
    color: "bg-secondary-light",
    hover: "bg-secondary-dark",
  },
  {
    icon: Bell,
    label: "Notifications",
    color: "bg-secondary-light",
    hover: "bg-secondary-dark",
  },
];

export default function LinearMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePopup, setActivePopup] = useState<
    "notifications" | "chat" | null
  >(null);
  const { dispatch, navigate } = useEssentials();
  const logout = () => {
    removeCookie("token");
    dispatch(resetState());
    navigate("/login");
  };
  const toggleMenu = () => setIsOpen(!isOpen);

  const handleItemClick = (label: string) => {
    if (label === "Notifications") {
      setActivePopup("notifications");
    } else if (label === "Chat") {
      setActivePopup("chat");
    } else if (label === "Logout") {
      logout()
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative flex items-center justify-end">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute right-full flex items-center space-x-2 pr-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  className={`rounded-full p-3 text-white shadow-lg ${item.color} hover:${item.hover}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleItemClick(item.label)}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="sr-only">{item.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={toggleMenu}
          className="rounded-full bg-blue-light dark:bg-background p-3 text-gray-800 shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-white"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <AnimatePresence>
        {activePopup === "notifications" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Notifications setOpen={setActivePopup} />
          </motion.div>
        )}
        {activePopup === "chat" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <ChatPopup
              chatWindow={activePopup === "chat"}
              setChatWindow={setActivePopup}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
