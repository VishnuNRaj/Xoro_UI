import { getCookie } from "@/Functions/Cookies";
import { useEssentials } from "@/Hooks/useEssentials";
import { useSocket } from "@/Hooks/useSocket";
import { setUser } from "@/Store/UserStore/Authentication/AuthSlice";
import { User } from "@/Store/UserStore/Authentication/Interfaces";
import { PostImage } from "@/Store/UserStore/Post-Management/Interfaces";
import {
  followUser,
  unfollowUser,
  getProfile,
} from "@/Store/UserStore/ProfileManagement/ProfileSlice";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function useUserProfiles() {
  const { navigate, dispatch, auth, profile } = useEssentials();
  const socket = useSocket();
  const [userData, setUserData] = useState<User | null>(null);
  const [post, setPost] = useState<{
    Images: PostImage[];
  } | null>(null);
  const { loading, user } = auth;
  const { loadingProfile } = profile;
  const [type, setType] = useState<string>("Images");
  const [Connection, setConnection] = useState<{
    Following: boolean;
    Follower: boolean;
  }>({
    Following: false,
    Follower: false,
  });
  const { ProfileLink } = useParams();

  const [isShareOpen, setIsShareOpen] = useState(false);
  const getShareUrl = () => {
    if (userData) {
      const baseUrl = window.location.origin;
      return `${baseUrl}/profile/${userData.ProfileLink}`;
    }
    return "";
  };

  const handleShare = (platform?: string) => {
    const videoUrl = getShareUrl();
    let shareUrl = videoUrl;

    if (userData) {
      switch (platform) {
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            videoUrl
          )}`;
          break;
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            videoUrl
          )}&text=${encodeURIComponent(userData?.Name)}`;
          break;
        default:
          navigator.clipboard.writeText(videoUrl);
          toast.success("Copied to Clipboard");
          return;
      }
    }

    if (platform) {
      window.open(shareUrl, "_blank");
    }
  };
  useEffect(() => {
    const token = getCookie("token");
    if (token && ProfileLink) {
      dispatch(getProfile({ token, ProfileLink })).then((state: any) => {
        if (!state.payload.user) {
          navigate("/login");
        }
        if (!state.payload.userData) navigate(-1);
        const data: User = state.payload.userData;
        console.log(state.payload.post);
        dispatch(setUser(state.payload.user));
        setUserData(data);
        setConnection({
          Following: data.connections[0].Following.some(
            (connection) => connection === state.payload.user._id
          ),
          Follower: data.connections[0].Followers.some(
            (connection) => connection === state.payload.user._id
          ),
        });
        if (!state.payload.userData.Settings.Private)
          setPost(state.payload.post);
      });
    } else if (!ProfileLink) navigate(-1);
  }, [ProfileLink]);

  function FollowUser() {
    const token: string | undefined = getCookie("token");
    if (token)
      dispatch(followUser({ token, UserId: userData?._id as string })).then(
        (state: any) => {
          if (!userData?.Settings.Private)
            setConnection({ ...Connection, Follower: true });
          if (socket)
            socket.emit("notification", {
              data: state.payload.notification,
              UserId: userData?._id,
            });
        }
      );
    else navigate("/login");
  }
  function UnfollowUser() {
    const token: string | undefined = getCookie("token");
    if (token)
      dispatch(unfollowUser({ token, UserId: userData?._id as string })).then(
        () => {
          setConnection({ ...Connection, Follower: false });
        }
      );
  }
  return {
    type,
    setType,
    Connection,
    loading,
    loadingProfile,
    user,
    userData,
    post,
    socket,
    navigate,
    FollowUser,
    UnfollowUser,
    handleShare,
    getShareUrl,
    isShareOpen,
    setIsShareOpen
  };
}
