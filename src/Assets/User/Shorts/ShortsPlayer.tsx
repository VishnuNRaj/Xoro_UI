import { useRef, useEffect, useCallback, memo, useMemo } from "react";
import videojs from "video.js";
import Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";
import config from "@/Configs/config";
import useShortsPlayer from "@/Hooks/User/Shorts/useShortsPlayer";
import { Shorts } from "@/Store/UserStore/Shorts-Management/interfaces";

interface ShortsPlayerProps {
  videoCache: Record<string, Shorts>;
  shorts: string[];
  id: string | undefined;
  getMoreShorts: (token: string) => void;
}

function ShortsPlayer({
  videoCache,
  shorts,
  id,
  getMoreShorts,
}: ShortsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);
  const video = useMemo(() => (id ? videoCache[id] : null), [id, videoCache]);

  const {
    handleTouchStart,
    handleTouchMove,
    subs,
    subscribe,
    handleSubscribe,
    handleUnsubscribe,
  } = useShortsPlayer({ videoCache, shorts, id, getMoreShorts });

  const initializePlayer = useCallback(() => {
    if (!videoRef.current || !video) return;

    if (!playerRef.current) {
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
    }
    playerRef.current.src({
      src: `${config.SERVER}/shorts/${video.Key}/index.m3u8`,
      type: "application/x-mpegURL",
    });
  }, [video, playerRef]);

  useEffect(() => {
    initializePlayer();
    // return () => playerRef.current?.dispose();
  }, [initializePlayer]);

  if (!video) return null;

  return (
    <div className="w-full max-w-md">
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-black">
        <video
          ref={videoRef}
          className="video-js vjs-default-skin"
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
    </div>
  );
}

export default memo(ShortsPlayer);
