import { Button } from "@/components/ui/button";
import { MessageCircle, ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import { Video } from '@/Store/UserStore/Video-Management/Interfaces';
import useLikeDislikeVideo from "@/Hooks/User/Videos/useLikeDislikeVideo";

interface LikeDislikeVideoProps {
  post: Video;
  dialog: boolean;
  setDialog: (isOpen: boolean) => void;
  comment: number;
  width: number;
}

export default function LikeDislikeVideo ({ post, dialog, setDialog, comment, width }:LikeDislikeVideoProps) {
  const { count, like, dislike, handleLike, handleDislike } = useLikeDislikeVideo(post, comment);

  return (
    <div className="flex items-center justify-between md:mx-4 ml-4 mt-3 mb-2 font-semibold">
      <div className="flex space-x-2">
        {width < 968 && (
          <Button variant="ghost" size="icon" onClick={() => setDialog(!dialog)}>
            <MessageCircle className="h-5 w-5" />
          </Button>
        )}
        <Button variant="ghost" size="icon">
          <Send className="h-5 w-5" />
        </Button>
        <div className='flex bg-secondary rounded-full'>
          <Button
            variant={like ? "default" : "secondary"}
            size="sm"
            className="rounded-l-full"
            onClick={handleLike}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            {count.like > 0 && (
              <span>{count.like > 1000 ? `${Math.floor(count.like / 1000)}K` : count.like}</span>
            )}
          </Button>
          <Button
            variant={dislike ? "destructive" : "secondary"}
            size="sm"
            className="rounded-r-full"
            onClick={handleDislike}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

