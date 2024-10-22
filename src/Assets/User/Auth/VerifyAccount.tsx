import Preloader from "@/Assets/Preloader";
import Logo from '/Logo.png';
import { useEssentials } from "@/Hooks/useEssentials";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import useVerify from "@/Hooks/User/VerifyAccount/useVerify";

export default function VerifyAccountComponent() {
    const { auth } = useEssentials();
    const { loading, message, user } = auth;
    const { RememberMe, Username, handleChange, updateAll, setRememberMe, show, setUsername } = useVerify()

    if (user) {
        return (
            <div className="container mx-auto px-4 py-8">
                {loading && <Preloader />}
                <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-center mb-6">
                            <img crossOrigin="anonymous" src={Logo} className="w-20 h-20 rounded-full border-2 border-primary shadow-lg" alt="Logo" />
                        </div>
                        <h1 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">Upload Your Profile Image</h1>
                        <div className="mb-6 flex flex-col items-center">
                            <img crossOrigin="anonymous" src={show} alt="Profile" className="w-28 h-28 rounded-full border-2 border-primary mb-4" />
                            <Label htmlFor="fileInput" className="cursor-pointer">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                                    <span>+</span>
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
                        <div className="mb-4">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter Username"
                                value={Username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center mb-4">
                            <Checkbox
                                id="rememberMe"
                                checked={RememberMe}
                                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                            />
                            <Label htmlFor="rememberMe" className="ml-2">
                                Remember Me
                            </Label>
                        </div>
                        <Button onClick={updateAll} className="w-full">
                            Update
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
            {loading && <Preloader />}
            <img crossOrigin="anonymous" src={Logo} className="w-24 h-24 rounded-full border-2 border-primary shadow-lg mb-6" alt="Logo" />
            <h1 className="text-4xl font-medium text-primary">!! {message} !!</h1>
        </div>
    );
};

