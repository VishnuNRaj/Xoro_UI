import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Facebook,
  Twitter,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import useLikeDislikeLive from "@/Hooks/User/Live/useLikeDislikeLive";
import { LiveInterface } from "@/Store/UserStore/CommonManagements/interfaces";

interface LikeDislikeVideoProps {
  post: LiveInterface;
  dialog: boolean;
  setDialog: (isOpen: boolean) => void;
  comment: number;
  width: number;
}

export default function LikeDislikeLive({
  post,
  dialog,
  setDialog,
  comment,
  width,
}: LikeDislikeVideoProps) {
  const { count, like, dislike, handleLike, handleDislike } =
    useLikeDislikeLive(post, comment);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/live/${post.Key}`;
  };

  const handleShare = (platform?: string) => {
    const videoUrl = getShareUrl();
    let shareUrl = videoUrl;

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          videoUrl
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          videoUrl
        )}&text=${encodeURIComponent(post.Caption)}`;
        break;
      default:
        navigator.clipboard.writeText(videoUrl);
        toast.success("Copied to Clipboard");
        return;
    }

    if (platform) {
      window.open(shareUrl, "_blank");
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-start gap-2 mt-2 sm:mt-0 sm:justify-end">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center hover:bg-transparent space-x-1 ${
                like ? "text-secondary" : "dark:text-white"
              }`}
            >
              <ThumbsUp className={`h-5 w-5 ${like ? "fill-current" : ""}`} />
              <span>
                {count.like > 0 &&
                  (count.like > 1000
                    ? `${Math.floor(count.like / 1000)}K`
                    : count.like)}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{like ? "Unlike" : "Like"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDislike}
              className={`flex items-center hover:bg-transparent space-x-1 ${
                dislike ? "text-secondary" : "dark:text-white"
              }`}
            >
              <ThumbsDown
                className={`h-5 w-5 ${dislike ? "fill-current" : ""}`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{dislike ? "Remove dislike" : "Dislike"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 bg-primary-dark hover:bg-primary-light text-white hover:text-foreground"
          >
            <Share2 className="h-5 w-5" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-blue-light dark:bg-background dark:text-white">
          <DialogHeader>
            <DialogTitle>Share this live</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2">
              <Input readOnly value={getShareUrl()} className="flex-1" />
              <Button onClick={() => handleShare()} className="text-white">
                Copy
              </Button>
            </div>
            <div className="flex justify-center space-x-4 text-white">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => handleShare("twitter")}
              >
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {width < 968 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDialog(!dialog)}
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{comment}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Comments</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
