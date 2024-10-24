import { Video } from "@/Store/UserStore/Video-Management/Interfaces";
import { useEssentials } from "@/Hooks/useEssentials";
import useVideoFile from "@/Hooks/User/Videos/useVideoFile";

interface Props {
  video: Video;
}

export default function VideoFile({ video }: Props) {
  const { navigate } = useEssentials();
  const { duration, videoRef } = useVideoFile(video);

  return (
    <div
      key={video.VideoLink}
      className="flex dark:bg-background bg-blue-light dark:text-white border border-border flex-col rounded-md w-full h-full"
      onClick={() => navigate(`/videos/${video.VideoLink}`)}
    >
      <video className="w-full" src={video.Video} ref={videoRef} hidden></video>
      <div className="rounded-md bg-background relative">
        <img
          className="w-full rounded-t-md object-cover aspect-video"
          src={video.Thumbnail}
          alt="video_thumbnail"
          loading="lazy"
        />
      </div>
      <div className="flex flex-row mt-2 ml-4">
        <img
          src={video.Channel[0]?.Logo}
          alt="channel_logo"
          className="rounded-full h-8 w-8 mt-1 object-cover"
          loading="lazy"
        />
        <div className="w-[80%]">
          <span className="text-foreground text-ellipsis break-words font-semibold max-w-full text-sm px-2 line-clamp-1">
            {video.Caption === "" ? "No Captions Given" : video.Caption}
          </span>
          <span className="text-muted-foreground font-semibold text-xs px-2">
            {video.Channel[0]?.Name}
          </span>
          <span className="text-muted-foreground font-medium text-xs pl-2">
            {video.Views} views • {duration}
          </span>
        </div>
      </div>
    </div>
  );
}
