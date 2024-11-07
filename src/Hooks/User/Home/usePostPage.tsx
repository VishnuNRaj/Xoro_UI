import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { getCookie } from "@/Functions/Cookies";
import { getPost } from "@/Store/UserStore/Post-Management/PostSlice";
import { setUser } from "@/Store/UserStore/Authentication/AuthSlice";
import { useEssentials } from "@/Hooks/useEssentials";
import { PostImage } from "@/Store/UserStore/Post-Management/Interfaces";
import { Comments } from "@/Store/UserStore/CommonManagements/interfaces";
import useReaction from "../useReactions";

export default function usePostData() {
  const { id } = useParams();

  const [post, setPost] = useState<PostImage | null>(null);
  const [play, setPlay] = useState(false);
  const [like, setLike] = useState(false);
  const [dislike, setDisLike] = useState(false);
  const { auth, dispatch, navigate } = useEssentials();
  const [comments, setComments] = useState<Comments[]>([]);
  const [count, setCount] = useState<{
    like: number;
    dislike: number;
    comment: number;
  }>({
    comment: 0,
    dislike: 0,
    like: 0,
  });
  const [dialog, setDialog] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { likePost, dislikePost, removeReaction } = useReaction({
    base: "post",
  });

  useEffect(() => {
    const token: string | undefined = getCookie("token");
    if (token && id) {
      dispatch(getPost({ token, id })).then(({ payload }: any) => {
        if (!payload.user) return navigate("/login");
        dispatch(setUser(payload.user));
        if (!payload.post) {
          toast.error("No Post Found");
          return navigate("/");
        }
        setPost(payload.post);
      });
    } else if (!id) {
      toast.error("No Post Found");
      return navigate("/");
    } else navigate("/login");
  }, [id]);

  useEffect(() => {
    if (post) {
      const result = post.reactions.Likes.find(
        (val) => val === auth?.user?._id
      );
      setLike(result ? true : false);
      const result2 = post.reactions.Dislikes.find(
        (val) => val === auth?.user?._id
      );
      setDisLike(result2 ? true : false);
      setCount({
        ...count,
        like: post.reactions.Likes.length,
        dislike: post.reactions.Dislikes.length,
      });
      setComments(post.comments);
    }
  }, [post]);

  const handleDialogToggle = () => {
    setDialog(!dialog);
  };

  const [isShareOpen, setIsShareOpen] = useState(false);
  const getShareUrl = () => {
    if (post) {
      const baseUrl = window.location.origin;
      return `${baseUrl}/post/${post.ShareLink}`;
    }
    return "";
  };

  const handleShare = (platform?: string) => {
    const videoUrl = getShareUrl();
    let shareUrl = videoUrl;

    if (post) {
      switch (platform) {
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            videoUrl
          )}`;
          break;
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            videoUrl
          )}&text=${encodeURIComponent(post.ShareLink)}`;
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

  const handleLike = async () => {
    if (post) {
      if (!like || dislike) {
        await likePost(post._id);
        setCount({
          ...count,
          like: count.like + 1,
          dislike: count.dislike - (dislike ? 1 : 0),
        });
      } else {
        await removeReaction(post._id);
        setCount({ ...count, like: count.like - 1 });
      }
      setDisLike(false);
      setLike(!like);
    }
  };

  const handleDislike = async () => {
    if (post) {
      if (like || !dislike) {
        await dislikePost(post._id);
        setCount({
          ...count,
          dislike: count.like + 1,
          like: count.like - (like ? 1 : 0),
        });
      } else {
        await removeReaction(post._id);
        setCount({ ...count, dislike: count.dislike - 1 });
      }
      setLike(false);
      setDisLike(!dislike);
    }
  };

  const handlePlayPause = (isPlaying: boolean) => {
    setPlay(isPlaying);
    if (isPlaying) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  };

  return {
    post,
    play,
    like,
    dislike,
    comments,
    count,
    dialog,
    videoRef,
    handleDialogToggle,
    setDialog,
    handleLike,
    handleDislike,
    handlePlayPause,
    setPost,
    setCount,
    setComments,
    setPlay,
    isShareOpen,
    setIsShareOpen,
    handleShare,
    getShareUrl
  };
}
