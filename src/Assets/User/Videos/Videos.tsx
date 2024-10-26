import { lazy, Suspense, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import { useEssentials } from "@/Hooks/useEssentials";
import useVideos from "@/Hooks/User/Videos/useVideos";
const VideoFile = lazy(() => import("./VideoFile"));
import { Upload } from "lucide-react";

const VideoSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[200px] w-full rounded-md" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
);

export default function VideosComponent() {
  const { navigate } = useEssentials();
  const { Videos, loading, loadingVideo, hasMore, fetchVideos } = useVideos();
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasMore) {
      fetchVideos();
    }
  }, [inView, hasMore]);

  return (
    <div className="w-full h-auto mt-4">
      {Videos.length < 1 && !loadingVideo && !loading && (
        <div className="w-full h-full flex items-center justify-center">
          <div
            onClick={() => navigate("/upload/video")}
            className="h-[400px] animate-popup outline-2 mt-20 dark:text-white w-[400px] rounded-lg bg-blue-light dark:bg-background cursor-pointer transition-colors duration-200"
          >
            <div className="w-full mt-20 text-3xl font-bold flex items-center justify-center">
              <h1>Upload Videos</h1>
            </div>
            <br />
            <div className="flex font-semibold items-center justify-center">
              <Upload className="w-20 h-20 mt-2" />
            </div>
            <div className="text-sm font-semibold w-full flex items-center justify-center">
              <h1>No Videos Uploaded Yet</h1>
            </div>
          </div>
        </div>
      )}
      <div className="w-full">
        {Videos.length > 0 && (
          <div className="px-4 grid md:grid-cols-4 w-full grid-cols-1 gap-4">
            {Videos.map((video) => (
              <Suspense key={video.VideoLink} fallback={<VideoSkeleton />}>
                <VideoFile video={video} />
              </Suspense>
            ))}
          </div>
        )}

        {hasMore && (
          <div ref={ref} className="w-full mt-4">
            {loadingVideo && (
              <div className="px-4 grid md:grid-cols-4 sm:grid-cols-1 gap-4">
                {[...Array(4)].map((_, index) => (
                  <VideoSkeleton key={index} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
