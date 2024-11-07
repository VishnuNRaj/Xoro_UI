import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Trash2, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useNotifications from "@/Hooks/User/Notification/useNotifications";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<"notifications" | "chat" | null>>;
}

export default function Notifications({ setOpen }: Props) {
  const { allow, notifications, hasMore, toggleAllow, clear, loadMore } = useNotifications();

  return (
    <div className="fixed bottom-20 right-4 z-50 top-20 w-[360px] border border-gray-200 dark:border-gray-700 rounded-lg bg-blue-light dark:bg-background">
      <div className="min-h-[400px] max-h-screen h-full flex flex-col">
        <div className="w-full p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <Button variant="default" className="dark:text-white bg-blue-300 dark:bg-blue-dark" size="sm" onClick={toggleAllow}>
            <Bell className="mr-2 h-4 w-4" />
            {allow ? "Disallow" : "Allow"}
          </Button>
          <Button variant="default" className="text-white bg-accent-dark hover:bg-accent-light" size="sm" onClick={clear}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setOpen(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-grow">
          {notifications.map((msg,idx) => (
            <div key={idx} className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={msg.Link} alt="Notification" />
                  <AvatarFallback>N</AvatarFallback>
                </Avatar>
                <p className="text-sm text-gray-900 dark:text-gray-100">{msg.Message}</p>
              </div>
            </div>
          ))}
          {hasMore && (
            <Button variant="ghost" className="w-full" onClick={loadMore}>
              Load More
            </Button>
          )}
          {!hasMore && notifications.length > 0 && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
              No More Notifications
            </p>
          )}
          {notifications.length === 0 && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
              No notifications
            </p>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}