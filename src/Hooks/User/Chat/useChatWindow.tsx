import { useEffect, useRef, useState } from "react";
import { getCookie } from "@/Functions/Cookies";
import { useEssentials } from "@/Hooks/useEssentials";
import useOnline from "@/Hooks/useOnline";
import { resetState } from "@/Store/UserStore/Authentication/AuthSlice";
import { User } from "@/Store/UserStore/Authentication/Interfaces";
import {
  getChats,
  setChat,
  startChat,
} from "@/Store/UserStore/Chat-Management/ChatSlice";
import { AllChatState } from "@/Store/UserStore/Chat-Management/interfaces";
import { toast } from "sonner";
export function useChatWindow() {
  const { chat, auth, dispatch, navigate } = useEssentials();
  const [chats, setChats] = useState<AllChatState[]>([]);
  const [state, setState] = useState<boolean>(false);
  const [users, setUsers] = useState<User[] | null>(null);
  const [group, setGroup] = useState<string[] | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState({
    GroupName: "",
    Profile:
      "https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-group-icon-png-image_1796653.jpg",
  });
  const { online } = useOnline();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setForm({ ...form, Profile: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (data: string) => {
    setGroup((prevState) => {
      if (!prevState) return [data];
      return prevState.includes(data)
        ? prevState.filter((val) => val !== data)
        : [...prevState, data];
    });
  };

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      dispatch(getChats({ token })).then((state: any) => {
        if (!state.payload.user) {
          dispatch(resetState());
          return navigate("/login");
        }
        setChats(state.payload.allChats);
        const data = [
          ...state.payload.users.follow,
          ...state.payload.users.following,
        ].filter((user, i, arr) => {
          return arr.findIndex((u) => u.Username === user.Username) === i;
        });
        setUsers(data);
      });
    }
  }, []);

  const chatNow = (UserId: string) => {
    const token = getCookie("token");
    if (token) {
      dispatch(startChat({ UserId: [UserId], token })).then((state: any) => {
        if (state.payload.status === 202) return navigate("/login");
      });
    }
  };

  const createChat = () => {
    const token = getCookie("token");
    if (form.GroupName.length < 2) return toast.error("Add Groupname");
    if (token && group) {
      const obj = {
        GroupName: form.GroupName.length > 0 ? form.GroupName : undefined,
        Profile: form.Profile,
        token: token,
        UserId: group,
      };
      dispatch(startChat(obj)).then((state: any) => {
        if (state.payload.status === 202) return navigate("/login");
      });
    }
  };

  return {
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
  };
}
