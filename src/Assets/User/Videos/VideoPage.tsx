import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LikeDislikeVideo from './LikeDislikeVideo';
import useVideoPage from '@/Hooks/User/Videos/useVideoPage';
import CommentComponent from '@/Assets/Components/Comments';
import {useEssentials} from "@/Hooks/useEssentials";
export default function VideoPlayerComponent() {
  const {
    comments,
    loadingVideo,
    handlePlayerClick,
    setComments,
    videoData,
    videoRef,
    dialog,
    setDialog,
    handleSubscribeChange,
    subs,
    subscribe,
    width
  } = useVideoPage();
  const {navigate} = useEssentials()
  return (
    <div className='w-full dark:text-white h-auto animate-slideInFromLeft'>
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="sm:max-w-[425px]">
          {videoData && <CommentComponent comments={comments} setComments={setComments} PostId={videoData._id} />}
        </DialogContent>
      </Dialog>
      <div className='w-full flex flex-col gap-5 mt-3 px-2 md:px-4 lg:flex-row lg:mt-5'>
        <div className="w-full lg:w-4/6 flex flex-col">
          <div className='aspect-video w-full bg-background items-center rounded-md'>
            {loadingVideo ? (
              <Skeleton className="w-full h-full rounded-md" />
            ) : (
              <video 
                style={{ borderRadius: "5px", minHeight: width > 968 ? "60vh" : "auto" }} 
                poster={videoData?.Thumbnail} 
                onKeyDown={handlePlayerClick} 
                ref={videoRef} 
                controls 
                className='w-full rounded-lg border border-border video-js videoContainer vjs-default-skin'
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <div className='w-full rounded-lg items-center p-2 mt-4'>
            <h1 className='text-lg font-semibold text-foreground'>{videoData?.Caption}</h1>
            <div className='w-full mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-center space-x-3 mb-2 sm:mb-0'>
                <img src={videoData?.Channel[0].Logo} className='rounded-full w-10 h-10 object-cover' alt="Channel Logo" />
                <div>
                  <h2 onClick={()=>navigate(`/channel/${videoData?.Channel[0].ChannelLink}`)} className='font-semibold text-foreground'>{videoData?.Channel[0].Name}</h2>
                  <p className='text-sm text-muted-foreground'>
                    {subs > 0 ? `${subs > 1000 ? `${Math.floor(subs / 1000)}K` : subs} Subscribers` : 'No subscribers'}
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
              {videoData && (
                <LikeDislikeVideo
                  comment={comments.length}
                  dialog={dialog}
                  setDialog={setDialog}
                  post={videoData}
                  width={width}
                />
              )}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-2/6 border border-border max-h-[600px]  bg-blue-light dark:bg-background rounded-lg overflow-hidden">
          {videoData && <CommentComponent comments={comments} setComments={setComments} PostId={videoData._id} />}
        </div>
      </div>
    </div>
  );
}