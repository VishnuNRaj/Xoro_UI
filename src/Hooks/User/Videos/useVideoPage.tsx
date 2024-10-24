import { useState, useCallback } from "react";
import useWindowDimensions from "@/Hooks/useWindowDimesions";
import useVideoPlayer from "./useVideoPlayer";

export default function useVideoPage() {
  const {
    comments,
    loadingVideo,
    handlePlayerClick,
    videoData,
    videoRef,
    subs,
    subscribe,
    handleSubscribe,
    handleUnsubscribe,
    setComments,
  } = useVideoPlayer();
  const { width } = useWindowDimensions();
  const [dialog, setDialog] = useState(false);

  const handleDialogChange = useCallback((isOpen: boolean) => {
    setDialog(isOpen);
  }, []);

  const handleSubscribeChange = useCallback(() => {
    if (subscribe) {
      handleUnsubscribe();
    } else {
      handleSubscribe();
    }
  }, [subscribe, handleSubscribe, handleUnsubscribe]);

  return {
    comments,
    loadingVideo,
    handlePlayerClick,
    setComments,
    videoData,
    videoRef,
    dialog,
    setDialog: handleDialogChange,
    handleSubscribeChange,
    subs,
    subscribe,
    width,
  };
}
