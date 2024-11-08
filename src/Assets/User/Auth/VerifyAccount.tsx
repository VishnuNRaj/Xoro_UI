import { useEssentials } from "@/Hooks/useEssentials";
import useVerify from "@/Hooks/User/VerifyAccount/useVerify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User } from "lucide-react";
import Preloader from "@/Assets/Preloader";

export default function VerifyAccountComponent() {
  const { auth } = useEssentials();
  const { loading, message, user } = auth;
  const {
    RememberMe,
    Username,
    handleChange,
    updateAll,
    setRememberMe,
    show,
    setUsername,
  } = useVerify();
  if (loading) return <Preloader />;
  if (user) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <Card className="w-full bg-blue-light dark:bg-background dark:text-white max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex justify-center text-center">
              Upload Your Profile Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-28 h-28">
                <AvatarImage src={show} alt="Profile" />
                <AvatarFallback>
                  <User className="w-14 h-14" />
                </AvatarFallback>
              </Avatar>
              <Label htmlFor="fileInput" className="cursor-pointer mt-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <Input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter Username"
                value={Username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={RememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="rememberMe">Remember Me</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="default"
              onClick={updateAll}
              className="w-full text-white"
            >
              Update
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full bg-blue-light dark:bg-background dark:text-white max-w-md">
        <CardHeader>
          <Avatar className="w-24 h-24 mx-auto">
            <AvatarImage src="/Logo.png" alt="Logo" />
            <AvatarFallback>Logo</AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-medium text-center">!! {message} !!</p>
        </CardContent>
      </Card>
    </div>
  );
}
