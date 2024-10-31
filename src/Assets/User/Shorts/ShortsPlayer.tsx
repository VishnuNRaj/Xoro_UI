import { useRef, useEffect, useCallback } from "react";
import videojs from "video.js";
import Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";
// import LikeDislikeVideo from './LikeDislikeVideo';
import config from "@/Configs/config";
// import useWindowDimensions from "@/Hooks/useWindowDimesions";
// import { useEssentials } from "@/Hooks/useEssentials";
import useShortsPlayer from "@/Hooks/User/Shorts/useShortsPlayer";
import { Shorts } from "@/Store/UserStore/Shorts-Management/interfaces";

interface ShortsPlayerProps {
  video: Shorts | null;
  shorts: string[];
  id: string | undefined;
  getMoreShorts: (token: string) => void;
}

export default function ShortsPlayer({
  video,
  shorts,
  id,
  getMoreShorts,
}: ShortsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);
//   const { navigate } = useEssentials();
  // const { width } = useWindowDimensions();
  const {
    // handleKeyDown,
    handleTouchStart,
    handleTouchMove,
    // dialog,
    // setDialog,
    subs,
    subscribe,
    handleSubscribe,
    handleUnsubscribe,
  } = useShortsPlayer({ video, shorts, id, getMoreShorts });

  const initializePlayer = useCallback(() => {
    if (videoRef.current && video) {
      if (playerRef.current) {
        playerRef.current.src({
          src: `${config.SERVER}/shorts/${video.Key}/index.m3u8`,
          type: "application/x-mpegURL",
        });
      } else {
        const player = videojs(videoRef.current, {
          controls: true,
          autoplay: true,
          fluid: true,
          liveui: true,
          loop: true,
          preload: "auto",
          aspectRatio: "9:16",
          controlBar: {
            playToggle: false,
            volumePanel: false,
            currentTimeDisplay: false,
            timeDivider: true,
            durationDisplay: true,
            progressControl: true,
            liveDisplay: false,
            seekToLive: false,
            remainingTimeDisplay: false,
            customControlSpacer: true,
            playbackRateMenuButton: true,
            chaptersButton: false,
            descriptionsButton: false,
            subsCapsButton: true,
            audioTrackButton: false,
            pictureInPictureToggle: false,
            fullscreenToggle: false,
          },
        });
        playerRef.current = player;
        player.src({
          src: `${config.SERVER}/shorts/${video.Key}/index.m3u8`,
          type: "application/x-mpegURL",
        });
      }
    }
  }, [video]);

  useEffect(() => {
    initializePlayer();
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [initializePlayer]);

  if (!video) return null;

  return (
    <div className="w-full max-w-md">
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-black">
        <video
          ref={videoRef}
          className="video-js vjs-default-skin"
        //   onKeyUpCapture={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={video.channel.Logo}
            alt={video.channel.Name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {video.channel.Name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subs > 0
                ? `${
                    subs > 1000 ? `${Math.floor(subs / 1000)}K` : subs
                  } Subscribers`
                : "No subscribers"}
            </p>
          </div>
        </div>
        <button
          onClick={subscribe ? handleUnsubscribe : handleSubscribe}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            subscribe
              ? "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {subscribe ? "Unsubscribe" : "Subscribe"}
        </button>
      </div>
      {/* <LikeDislikeVideo
        post={video}
        dialog={dialog}
        setDialog={setDialog}
        comment={video.Comments.length}
        width={width}
      /> */}
    </div>
  );
}
