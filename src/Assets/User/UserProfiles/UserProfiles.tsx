import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Lock,
  Image,
  Plus,
  MessageCircle,
  UserPlus,
  Send,
  Facebook,
  Twitter,
} from "lucide-react";
import Preloader from "@/Assets/Preloader";
import ImgComponent from "./PostMap";
import useUserProfiles from "@/Hooks/User/Profile/useUserProfiles";
import useConnections from "@/Hooks/User/Profile/useConnections";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DialogTrigger } from "@radix-ui/react-dialog";
export default function ProfileComponent() {
  const {
    user,
    userData,
    loading,
    loadingProfile,
    post,
    type,
    setType,
    Connection,
    FollowUser,
    UnfollowUser,
    handleShare,
    getShareUrl,
    isShareOpen,
    setIsShareOpen,
  } = useUserProfiles();
  const {} = useConnections();

  return (
    <div
      className={`min-h-screen max-w-screen-lg mx-auto w-full transition-colors duration-300`}
    >
      {loading || loadingProfile ? <Preloader /> : null}
      <Card className="mx-auto rounded-none sm:rounded-lg overflow-hidden shadow-lg bg-blue-light dark:text-white dark:bg-background">
        <div className="relative h-48 sm:h-64 md:h-80">
          <img
            alt="Profile banner"
            className="w-full h-full rounded-md object-cover"
            src={userData?.Banner || "/Loading.png"}
          />
          <div className="absolute top-4 right-4 flex space-x-2">
            <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  className="w-10 h-10 rounded-md hover:bg-primary-dark text-surface font-semibold"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-blue-light dark:bg-background dark:text-white">
                <DialogHeader>
                  <DialogTitle>Share this post</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Input readOnly value={getShareUrl()} className="flex-1" />
                    <Button
                      onClick={() => handleShare()}
                      className="text-white"
                    >
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
          </div>
        </div>
        <div className="relative px-4 sm:px-6 pb-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-20 sm:-mt-24 mb-4 sm:mb-0">
            <div className="relative">
              <img
                alt="Profile picture"
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-background dark:border-background-dark object-cover shadow-lg"
                src={userData?.Profile || "/User.png"}
              />
              {userData?.ProfileLock && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full"
                >
                  <Lock className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left flex-grow">
              <h1 className="text-2xl font-bold text-foreground dark:text-foreground-dark">
                {userData?.Name || ""}
              </h1>
              <p className="text-primary dark:text-primary-dark">
                @{userData?.Username || ""}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-2 text-white">
              {userData && user && userData?._id !== user?._id && (
                <>
                  <Button variant="secondary" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button
                    onClick={Connection.Follower ? UnfollowUser : FollowUser}
                    size="sm"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {Connection.Follower ? "Unfollow" : "Follow"}
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center">
            {userData?.Description.length === 0 ? (
              <>
                <Button variant={"default"} className="hover:bg-primary-dark">
                  {" "}
                  <Plus />
                  No Descriptions
                </Button>
              </>
            ) : (
              <>
                {userData && userData?.Description.length > 0 && (
                  <ul>
                    {userData.Description.map((description, index) => (
                      <li key={index}>{description}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
          <div className="w-full flex justify-center items-center text-center border-border dark:border-border-dark pt-4">
            <div className="flex items-center max-w-xl justify-between w-full mt-6 pt-4 border-t text-center">
              <Button variant="ghost" className="hover:bg-transparent">
                <div>
                  <p className="text-xl font-bold">
                    {post?.Images.length || "0"}
                  </p>
                  <p className="text-muted-foreground dark:text-muted-foreground-dark">
                    Posts
                  </p>
                </div>
              </Button>
              <Button variant="ghost" className="hover:bg-transparent">
                <div>
                  <p className="text-xl font-bold">
                    {userData?.connections[0].Followers.length || "0"}
                  </p>
                  <p className="text-muted-foreground dark:text-muted-foreground-dark">
                    Followers
                  </p>
                </div>
              </Button>
              <Button variant="ghost" className="hover:bg-transparent">
                <div>
                  <p className="text-xl font-bold">
                    {userData?.connections[0].Following.length || "0"}
                  </p>
                  <p className="text-muted-foreground dark:text-muted-foreground-dark">
                    Following
                  </p>
                </div>
              </Button>
            </div>
          </div>
          <div className="flex justify-center mt-6 ">
            <div className="flex rounded-md gap-2 bg-transparent">
              <Button
                className={`hover:bg-primary-dark ${
                  type === "Images" && "text-white"
                }`}
                variant={type === "Images" ? "default" : "ghost"}
                onClick={() => setType("Images")}
              >
                <Image className="h-4 w-4 mr-2" />
                Images
              </Button>
            </div>
          </div>
          <div className="mt-6">
            {type === "Images" && <ImgComponent post={post?.Images as []} />}
          </div>
        </div>
      </Card>
    </div>
  );
}
