import { useState, useRef, useEffect } from "react";
import { PostImage } from "@/Store/UserStore/Post-Management/Interfaces";
import useReaction from "../useReactions";
import { useEssentials } from "@/Hooks/useEssentials";
import { toast } from "sonner";

export default function usePost(postData: PostImage) {
  const [post, setPost] = useState(postData);
  const [play, setPlay] = useState(false);
  const [like, setLike] = useState(false);
  const [dislike, setDisLike] = useState(false);
  const { auth } = useEssentials();
  const [comments, setComments] = useState(postData.comments || []);
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
    const result = post.reactions.Likes.find((val) => val === auth?.user?._id);
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
  }, [postData]);

  const handleDialogToggle = () => {
    setDialog(!dialog);
  };

  const handleLike = async () => {
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
  };

  const handleDislike = async () => {
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
  };

  const handlePlayPause = (isPlaying: boolean) => {
    setPlay(isPlaying);
    if (isPlaying) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  };

  const [isShareOpen, setIsShareOpen] = useState(false);
  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/post/${post.ShareLink}`;
  };

  const handleShare = (platform?: string) => {
    const videoUrl = getShareUrl();
    let shareUrl = videoUrl;

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          videoUrl
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          videoUrl
        )}&text=${encodeURIComponent(post.Caption)}`;
        break;
      default:
        navigator.clipboard.writeText(videoUrl);
        toast.success("Copied to Clipboard");
        return;
    }

    if (platform) {
      window.open(shareUrl, "_blank");
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
