import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LikeDislikeVideo from './LikeDislikeVideo';
import useVideoPage from '@/Hooks/User/Videos/useVideoPage';
import CommentComponent from '../Home/CommentComponent';

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

  return (
    <div className='w-full h-auto animate-slideInFromLeft'>
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="sm:max-w-[425px]">
          {videoData && <CommentComponent comments={comments} setComments={setComments} PostId={videoData._id} />}
        </DialogContent>
      </Dialog>
      <div className='w-full flex flex-col md:flex-row gap-5 md:mt-5 md:px-4 px-2 mt-3'>
        <div className={`${width > 968 ? "md:w-4/6" : "w-full"} flex`}>
          <div className='aspect-video w-full md:h-[75vh] bg-background items-center rounded-md'>
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
        </div>
        {width > 968 && (
          <div className="md:w-2/6 border border-border max-h-full bg-background rounded-lg overflow-hidden">
            {videoData && <CommentComponent comments={comments} setComments={setComments} PostId={videoData._id} />}
          </div>
        )}
      </div>
      <div className='md:w-4/6 w-full md:px-2'>
        <div className='w-full rounded-lg items-center md:p-2'>
          <h1 className='text-lg font-semibold text-foreground px-4'>{videoData?.Caption}</h1>
          <div className='w-full md:mt-2 h-[60px] flex justify-between items-center'>
            <div className='flex items-center space-x-3'>
              <img src={videoData?.Channel[0].Logo} className='rounded-full w-10 h-10 object-cover' alt="Channel Logo" />
              <div>
                <h2 className='font-semibold text-foreground'>{videoData?.Channel[0].Name}</h2>
                <p className='text-sm text-muted-foreground'>
                  {subs > 0 ? `${subs > 1000 ? `${Math.floor(subs / 1000)}K` : subs} Subscribers` : 'No subscribers'}
                </p>
              </div>
              <Button 
                variant={subscribe ? "secondary" : "destructive"}
                onClick={handleSubscribeChange}
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
    </div>
  );
};

