import { useMemo } from "react";
import { format } from "date-fns";
import { Settings, X, ArrowLeft } from "lucide-react";
import { useChat } from "@/Hooks/User/Chat/useChat";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatLoader from "@/Assets/ChatLoader";
import ChatInput from "./ChatInput";

interface ChatComponentProps {
  close: () => void;
}

interface GroupedMessage {
  _id: string;
  SenderId: string;
  Messages: Array<{
    _id: string;
    Message: string;
    Time: Date;
    Seen: string[];
  }>;
}

export default function ChatComponent({ close }: ChatComponentProps) {
  const {
    auth,
    chat,
    typing,
    loading,
    users,
    chats,
    messageContainerRef,
    handleBack,
    setLoading,
  } = useChat();

  const groupMessages = (messages: typeof chats): GroupedMessage[] => {
    return messages.reduce((acc: GroupedMessage[], current) => {
      if (
        acc.length === 0 ||
        acc[acc.length - 1].SenderId !== current.SenderId
      ) {
        acc.push({
          _id: current._id,
          SenderId: current.SenderId,
          Messages: [
            {
              _id: current._id,
              Message: current.Message,
              Time: current.Time,
              Seen: current.Seen,
            },
          ],
        });
      } else {
        acc[acc.length - 1].Messages.push({
          _id: current._id,
          Message: current.Message,
          Time: current.Time,
          Seen: current.Seen,
        });
      }
      return acc;
    }, []);
  };

  const groupedChats = useMemo(() => groupMessages(chats), [chats]);

  return (
    <section className="flex flex-col rounded-md bg-blue-light dark:bg-background justify-center antialiased p-1 text-gray-900 dark:text-white">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full border-b border-gray-700 dark:border-white">
          <header className="py-3 px-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="mr-4"
                >
                  <ArrowLeft className="h-6 w-6" />
                  <span className="sr-only">Go back</span>
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={
                      chat.chat?.Profile ||
                      chat.chat?.users.find(
                        (user) => user._id !== auth?.user?._id
                      )?.Profile
                    }
                    alt="Profile"
                  />
                  <AvatarFallback>
                    {(chat.chat?.GroupName && chat.chat?.Users.length > 2
                      ? chat.chat?.GroupName
                      : chat.chat?.users.find(
                          (user) => user._id !== auth?.user?._id
                        )?.Name || ""
                    ).charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <h2 className="text-md font-bold">
                    {chat.chat?.GroupName && chat.chat?.Users.length > 2
                      ? chat.chat?.GroupName
                      : chat.chat?.users.find(
                          (user) => user._id !== auth?.user?._id
                        )?.Name}
                  </h2>
                  {typing.length === 0 ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {chat.chat?.GroupName && chat.chat?.Users.length > 2
                        ? `you, @${
                            chat.chat?.users.find(
                              (values) => values._id !== auth?.user?._id
                            )?.Username
                          } & ${chat.chat?.users?.length - 2} others`
                        : "@" +
                          chat.chat?.users.find(
                            (user) => user._id !== auth?.user?._id
                          )?.Username}
                    </p>
                  ) : (
                    <p className="text-sm text-blue-500">
                      {typing[0]} is typing
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={close}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close chat</span>
                </Button>
              </div>
            </div>
          </header>
        </div>

        <div className="flex-1 w-full overflow-hidden">
          {!chat.loadingChat ? (
            <ScrollArea className="h-[calc(100vh-240px)] pb-16 relative w-full">
              <div
                ref={messageContainerRef}
                className="flex flex-col p-1 mb-10"
              >
                {groupedChats.map((group) => (
                  <div
                    key={group._id}
                    className={`flex ${
                      group.SenderId === auth?.user?._id
                        ? "justify-end"
                        : "justify-start"
                    } mb-4`}
                  >
                    <div
                      className={`flex ${
                        group.SenderId === auth?.user?._id
                          ? "flex-row-reverse"
                          : "flex-row"
                      } items-end`}
                    >
                      <Avatar className="h-8 w-8 mb-2 mx-1">
                        <AvatarImage
                          src={
                            users.find((usr) => usr._id === group.SenderId)
                              ?.Profile
                          }
                          alt=""
                        />
                        <AvatarFallback>
                          {users
                            .find((usr) => usr._id === group.SenderId)
                            ?.Name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`flex flex-col ${
                          group.SenderId === auth?.user?._id
                            ? "items-end"
                            : "items-start"
                        }`}
                      >
                        {group.Messages.map((message, index) => (
                          <div
                            key={message._id}
                            className={`max-w-xs ${
                              group.SenderId === auth?.user?._id
                                ? "bg-blue-300 dark:bg-cyan-900"
                                : "bg-gray-200 dark:bg-blue-dark"
                            } rounded-lg px-4 py-2 ${
                              index !== 0 ? "mt-1" : ""
                            }`}
                          >
                            <p
                              className={`text-sm ${
                                group.SenderId === auth?.user?._id
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-900 dark:text-white"
                              }`}
                            >
                              {message.Message}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-500">
                                {format(message.Time, "p")}
                              </span>
                              {index === group.Messages.length - 1 && (
                                <span className="ml-2">
                                  {message.Seen.length === users.length ? (
                                    <svg
                                      className="w-4 h-4 text-blue-500"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="w-4 h-4 text-gray-400"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                    </svg>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <ChatInput loading={loading} setLoading={setLoading} />
              </div>
            </ScrollArea>
          ) : (
            <div className="p-4">
              <ChatLoader />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
