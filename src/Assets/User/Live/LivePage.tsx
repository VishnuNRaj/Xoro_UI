import "video.js/dist/video-js.css";
import { Skeleton } from "@/components/ui/skeleton";
import CommentComponent from "@/Assets/Components/Comments";
import useWindowDimensions from "@/Hooks/useWindowDimesions";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useViewStream from "@/Hooks/User/Live/useViewStream";
import LikeDislikeLive from "./LikeDislikeLive";
import { useEssentials } from "@/Hooks/useEssentials";

export default function LivePageComponent(){
  const { width } = useWindowDimensions();
  const {
    live,
    comments,
    setComments,
    loading,
    videoRef,
    subscribe,
    subs,
    handleSubscribeChange,
    handlePlayerClick,
    dialog,
    setDialog
  } = useViewStream();
  const { navigate } = useEssentials();
  return (
    <div className="w-full dark:text-white h-auto animate-slideInFromLeft">
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="sm:max-w-[425px]">
          {live && (
            <CommentComponent
              comments={comments}
              setComments={setComments}
              PostId={live._id}
            />
          )}
        </DialogContent>
      </Dialog>
      <div className="w-full flex flex-col gap-5 mt-3 px-2 md:px-4 lg:flex-row lg:mt-5">
        <div className="w-full lg:w-4/6 flex flex-col">
          <div className="aspect-video w-full bg-background items-center rounded-md">
            {loading ? (
              <Skeleton className="w-full h-full rounded-md" />
            ) : (
              <video
                style={{
                  borderRadius: "5px",
                  minHeight: width > 968 ? "60vh" : "auto",
                }}
                poster={live?.Thumbnail}
                onKeyDown={handlePlayerClick}
                ref={videoRef}
                controls
                className="w-full rounded-lg border border-border video-js videoContainer vjs-default-skin"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <div className="w-full rounded-lg items-center p-2 mt-4">
            <h1 className="text-lg font-semibold text-foreground">
              {live?.Caption}
            </h1>
            <div className="w-full mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <img
                  src={live?.channel[0].Logo}
                  className="rounded-full w-10 h-10 object-cover"
                  alt="Channel Logo"
                />
                <div>
                  <h2
                    onClick={() =>
                      navigate(`/channel/${live?.channel[0].ChannelLink}`)
                    }
                    className="font-semibold text-foreground"
                  >
                    {live?.channel[0].Name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {subs > 0
                      ? `${
                          subs > 1000 ? `${Math.floor(subs / 1000)}K` : subs
                        } Subscribers`
                      : "No subscribers"}
                  </p>
                </div>
                <Button
                  variant={subscribe ? "secondary" : "default"}
                  onClick={handleSubscribeChange}
                  className="text-white bg-accent-dark hover:bg-accent-light rounded-full"
                >
                  {subscribe ? "Unsubscribe" : "Subscribe"}
                </Button>
              </div>
              {live && (
                <LikeDislikeLive
                  comment={comments.length}
                  dialog={dialog}
                  setDialog={setDialog}
                  post={live}
                  width={width}
                />
              )}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-2/6 border border-border max-h-[600px]  bg-blue-light dark:bg-background rounded-lg overflow-hidden">
          {live && (
            <CommentComponent
              comments={comments}
              setComments={setComments}
              PostId={live._id}
              live={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

