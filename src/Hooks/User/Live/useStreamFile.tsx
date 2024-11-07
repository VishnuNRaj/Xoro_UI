import config from "@/Configs/config";
import { useEssentials } from "@/Hooks/useEssentials";
import { LiveInterface } from "@/Store/UserStore/CommonManagements/interfaces";
import { useEffect, useRef, useState } from "react";
import videojs from "video.js";

export default function useStreamFile({ video }: { video: LiveInterface }) {
  const [state, setState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const { navigate } = useEssentials();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videoSource = video.Completed
      ? video.Video
      : `${config.SERVER}/live/${video.Key}/index.m3u8`;
    if (videoRef.current) {
      const player = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        preload: "auto",
        sources: [
          {
            src: videoSource,
            type: "application/x-mpegURL",
          },
        ],
      });

      player.on("canplaythrough", () => {
        setIsLoading(false);
      });

      return () => {
        if (player) {
          player.dispose();
        }
      };
    }
  }, [video]);

  return { state, isLoading, videoRef, navigate, setState };
}
