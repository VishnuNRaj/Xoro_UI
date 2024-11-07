import { useState, useEffect, useCallback } from "react";
import { useEssentials } from "@/Hooks/useEssentials";
import useReaction from "../useReactions";
import { useSocket } from "@/Hooks/useSocket";
import { LiveInterface } from "@/Store/UserStore/CommonManagements/interfaces";

export default function useLikeDislikeLive(post: LiveInterface, comment: number) {
  const { dislikePost, likePost, removeReaction } = useReaction({
    base: "live",
  });
  const { auth } = useEssentials();
  const [count, setCount] = useState<{
    like: number;
    dislike: number;
    comment: number;
  }>({
    comment: 0,
    dislike: 0,
    like: 0,
  });
  const [like, setLike] = useState<boolean>(false);
  const [dislike, setDisLike] = useState<boolean>(false);
  const socket = useSocket();
  useEffect(() => {
    setCount({
      like: post.reactions[0].Likes.length,
      dislike: post.reactions[0].Dislikes.length,
      comment,
    });
    setLike(
      auth.user?._id ? post.reactions[0].Likes.includes(auth.user._id) : false
    );
    setDisLike(
      auth.user?._id
        ? post.reactions[0].Dislikes.includes(auth.user._id)
        : false
    );
  }, [comment, post, auth.user]);

  const handleLike = useCallback(async () => {
    if (!like || dislike) {
      await likePost(post._id);
      setCount((prev) => ({
        ...prev,
        like: prev.like + 1,
        dislike: prev.dislike - (dislike ? 1 : 0),
      }));
      socket?.emit("liked", post._id);
    } else {
      await removeReaction(post._id);
      setCount((prev) => ({ ...prev, like: prev.like - 1 }));
      socket?.emit("removedlike", post._id);
    }
    setDisLike(false);
    setLike((prev) => !prev);
  }, [like, dislike, post._id, likePost, removeReaction]);

  const handleDislike = useCallback(async () => {
    if (like || !dislike) {
      await dislikePost(post._id);
      setCount((prev) => ({
        ...prev,
        dislike: prev.dislike + 1,
        like: prev.like - (like ? 1 : 0),
      }));
      socket?.emit("disliked", post._id);
    } else {
      await removeReaction(post._id);
      setCount((prev) => ({ ...prev, dislike: prev.dislike - 1 }));
      socket?.emit("removeddislike", post._id);
    }
    setLike(false);
    setDisLike((prev) => !prev);
  }, [like, dislike, post._id, dislikePost, removeReaction]);

  return { count, like, dislike, handleLike, handleDislike };
}
