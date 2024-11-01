import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import ChatLoader from "@/Assets/ChatLoader";
import { Settings, X, MessageSquarePlus, Users } from "lucide-react";
import { useChatWindow } from "@/Hooks/User/Chat/useChatWindow";

interface ChatWindowProps {
  close: () => void;
}

export default function ChatWindow({ close }: ChatWindowProps) {
  const {
    state,
    group,
    chat,
    chats,
    users,
    online,
    auth,
    form,
    inputRef,
    setState,
    setGroup,
    handleChange,
    handleCheckboxChange,
    chatNow,
    createChat,
    dispatch,
    setChat,
    setForm,
  } = useChatWindow();

  return (
    <div className="w-full flex items-center justify-center">
      <div className="rounded-lg shadow-lg w-full bg-blue-light dark:bg-background text-darken dark:text-white">
        {state ? (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                New {group ? "Group" : ""} Chat
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setState(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {chat.loadingChat && <ChatLoader />}
            {!group && (
              <Button
                variant="secondary"
                className="w-full justify-start text-white"
                onClick={() => setGroup([])}
              >
                <Users className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            )}
            {group && (
              <div className="flex items-center space-x-4 mb-4">
                <Avatar
                  className="h-10 w-10 cursor-pointer"
                  onClick={() => inputRef.current?.click()}
                >
                  <AvatarImage src={form.Profile} />
                  <AvatarFallback>GP</AvatarFallback>
                </Avatar>
                <Input
                  type="text"
                  placeholder="Group Name"
                  value={form.GroupName}
                  onChange={(e) =>
                    setForm({ ...form, GroupName: e.target.value })
                  }
                />
                <input
                  type="file"
                  onChange={handleChange}
                  ref={inputRef}
                  hidden
                />
              </div>
            )}
            <ScrollArea className="h-[60vh] pb-10 space-y-2">
              {users?.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center px-1 rounded-md shadow-lg dark:hover:bg-blue-dark justify-between h-[70px] hover:bg-blue-300"
                >
                  <div className="flex items-center justify-center gap-5">
                  {group && (
                      <Checkbox
                        id={`user-${user._id}`}
                        checked={group.includes(user._id)}
                        onCheckedChange={() => handleCheckboxChange(user._id)}
                      />
                    )}
                    <Avatar>
                    <AvatarImage src={user.Profile} />
                    <AvatarFallback>{user.Name[0]}</AvatarFallback>
                  </Avatar>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center">
                    <p className="font-medium text-ellipsis">{user.Name}</p>
                    <p className="text-sm dark:text-white">@{user.Username}</p>
                  </div>
                  {!group && (
                    <Button
                      variant="default"
                      size="sm"
                      className="text-white font-semibold"
                      onClick={() => chatNow(user._id)}
                    >
                      <MessageSquarePlus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </ScrollArea>
            {group && (
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setGroup(null);
                    setForm({
                      GroupName: "",
                      Profile:
                        "https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-group-icon-png-image_1796653.jpg",
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={createChat}>Create</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <div className="p-4 border-b border-darken dark:border-gray-600">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={auth.user?.Profile} />
                    <AvatarFallback>{auth.user?.Name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">{auth.user?.Name}</h2>
                    <p className="text-sm">@{auth.user?.Username}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="default"
                    className="bg-transparent hover:bg-transparent"
                    size="icon"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="default"
                    className="bg-transparent hover:bg-transparent"
                    size="icon"
                    onClick={close}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <ScrollArea className="h-[60vh]">
              {chat.loadingChat ? (
                <div className="flex justify-center items-center h-full">
                  <ChatLoader />
                </div>
              ) : (
                <div className="p-4">
                  <h3 className="text-sm font-semibold uppercase mb-2">
                    Chats
                  </h3>
                  {chats.length < 1 ? (
                    <p className="text-center py-4">Start Messaging</p>
                  ) : (
                    chats.map((val) => (
                      <Button
                        key={val._id}
                        variant="default"
                        className="w-full bg-transparent shadow-lg hover:bg-blue-100 dark:hover:bg-blue-dark justify-start h-[70px] mb-2"
                        onClick={() => dispatch(setChat(val))}
                      >
                        <Avatar className="mr-2">
                          <AvatarImage
                            src={
                              val.GroupName
                                ? val.Profile
                                : val.users.find(
                                    (user) => user._id !== auth?.user?._id
                                  )?.Profile
                            }
                          />
                          <AvatarFallback>
                            {val.GroupName
                              ? "G"
                              : val.users.find(
                                  (user) => user._id !== auth?.user?._id
                                )?.Name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-medium">
                            {val.GroupName
                              ? val.GroupName
                              : val.users.find(
                                  (user) => user._id !== auth?.user?._id
                                )?.Name}
                          </p>
                          <p className="text-sm dark:text-gray-300">
                            {val?.latestMessage
                              ? val.latestMessage.Message
                              : "Say Hello"}
                          </p>
                        </div>
                        {online.find(
                          (usr) =>
                            usr._id ===
                            val.users.find(
                              (user) => user._id !== auth?.user?._id
                            )?._id
                        ) && (
                          <div className="w-2 h-2 bg-green-500 rounded-full ml-auto" />
                        )}
                      </Button>
                    ))
                  )}
                </div>
              )}
            </ScrollArea>
            <Button
              className="absolute bottom-6 text-white right-4"
              onClick={() => setState(true)}
            >
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
