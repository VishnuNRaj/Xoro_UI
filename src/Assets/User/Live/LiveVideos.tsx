import { useEssentials } from "@/Hooks/useEssentials";
import useWindowDimensions from "@/Hooks/useWindowDimesions";
import useStreamList from "@/Hooks/User/Live/useStreamList";
import useCategory from "@/Hooks/useCategory";
import StreamFile from "./StreamFile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tv } from "lucide-react";

export default function LiveVideosComponent() {
  const {
    category,
    emptySearch,
    getAllCategory,
    handleSearchChange,
    search,
    emptyCategory,
  } = useCategory();
  const { isLive, handleLive, cat, setCat, videos, loading } = useStreamList();
  const { width } = useWindowDimensions();
  const { navigate } = useEssentials();

  return (
    <div className="w-full p-4 bg-gray-200 h-full dark:bg-transparent dark:text-white">
      <div className={`w-full ${width > 450 ? "flex" : ""} justify-between`}>
        <div
          className={`flex ${
            width > 450 ? "w-[300px]" : "w-full"
          } mr-4 h-[40px]`}
        >
          <div className="flex px-4 items-center font-semibold w-full flex-shrink-0 h-full gap-5">
            <Button
              onClick={() => handleLive(true)}
              variant={isLive ? "default" : "secondary"}
              className="w-full text-white"
            >
              Streaming
            </Button>
            <Button
              onClick={() => handleLive(false)}
              variant={!isLive ? "default" : "secondary"}
              className="w-full text-white"
            >
              Completed
            </Button>
          </div>
        </div>
        <div
          className={`flex relative ${
            width > 450 ? "w-[300px]" : "w-full mt-5"
          } mr-4 h-[40px]`}
        >
          <div className="flex items-center justify-center flex-shrink-0 h-full w-full">
            <Input
              value={search ? search : cat}
              onChange={async (e) => {
                if (e.target.value.trim().length === 0) {
                  setCat("");
                  handleSearchChange(e);
                  await getAllCategory();
                } else handleSearchChange(e);
              }}
              placeholder="Genres"
              onBlur={(e) =>
                e.target.value.trim().length === 0 && emptyCategory()
              }
              onFocus={(e) =>
                e.target.value.trim().length > 0
                  ? handleSearchChange(e)
                  : getAllCategory()
              }
              className="w-full h-full bg-blue-light dark:bg-background dark:text-white"
            />
          </div>
          {category && category.length > 0 && (
            <ScrollArea className="absolute w-full top-[40px] mt-3 max-h-[150px] bg-blue-light dark:bg-background z-50 rounded-md shadow-md">
              {category.map((value) => (
                <Button
                  key={value.Name}
                  variant="ghost"
                  className="w-full justify-start hover:bg-blue-100 dark:hover:bg-blue-dark"
                  onClick={() => {
                    setCat(value.Name);
                    emptySearch();
                  }}
                >
                  {value.Name}
                </Button>
              ))}
            </ScrollArea>
          )}
        </div>
      </div>
      <div className="w-full mt-6 mb-6 flex items-center justify-center">
        {loading ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 w-full">
            {[...Array(8)].map((_, index) => (
              <Skeleton key={index} className="w-full h-[200px] rounded-lg" />
            ))}
          </div>
        ) : videos && videos.length > 0 ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 w-full">
            {videos.map((video) => (
              <div key={video._id}>
                <StreamFile video={video} />
              </div>
            ))}
          </div>
        ) : (
          <div
            onClick={() => navigate("/stream")}
            className="h-[400px] animate-popup outline-2 mt-5 w-[400px] rounded-lg bg-blue-light dark:bg-background flex flex-col items-center justify-center cursor-pointer"
          >
            <h1 className="text-2xl font-semibold mb-4">
              {isLive ? "No Active Streams" : "No Completed Live Streams"}
            </h1>
            <Tv className="w-24 h-24 mb-4" />
            <p className="text-sm font-semibold">Start Streaming</p>
          </div>
        )}
      </div>
    </div>
  );
}
