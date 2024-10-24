import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { resetState } from "@/Store/UserStore/Authentication/AuthSlice";
import { removeCookie } from '@/Functions/Cookies';
import { useEssentials } from "@/Hooks/useEssentials";
import { TvMinimalPlay, Tv, Home, Video, Podcast, TvMinimal, Contact, Menu, ArrowLeft, Upload, Camera, User, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Link } from "react-router-dom";
import ModeToggle from "./Components/ModeToggle";

const buttonsArray = [
    { text: "Home", redirect: "/", icon: <Home /> },
    { text: "Videos", redirect: "/videos", icon: <Video /> },
    { text: "Shorts", redirect: "/shorts", icon: <TvMinimalPlay /> },
    { text: "Live", redirect: "/live", icon: <Tv /> },
    { text: "Stream now", redirect: "/stream", icon: <Podcast /> },
    { text: "Channel", redirect: "/channel", icon: <TvMinimal /> },
    { text: "Contact", redirect: "/contact", icon: <Contact /> }
];

const Offcanvas: React.FC = memo(() => {
    const { navigate, dispatch, auth } = useEssentials();

    const logout = () => {
        removeCookie('token');
        dispatch(resetState());
        navigate('/login');
    };

    return (
        <nav className="fixed w-full z-20 top-0 start-0 bg-blue-light text-white dark:bg-background bg-opacity-70 border-b border-border">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between h-[70px] px-4">
                <div className="flex items-center space-x-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full text-white">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent title="Offcanvas" side="left" className="w-[300px] sm:w-[400px] bg-blue-light dark:bg-background">
                            <nav className="flex flex-col h-full">
                                <div className="flex items-center justify-between p-4 border-b border-border">
                                    <h2 className="text-lg font-semibold flex gap-4 items-center justify-center dark:text-white">
                                        <img src="/Logo.png" className="w-10 h-10 bg-transparent bg-blend-normal" alt="" />
                                        Welcome to xoro
                                    </h2>
                                    <SheetTrigger asChild>
                                        <Button variant="secondary" size="icon">
                                            <X className="h-5 w-5 text-white" />
                                        </Button>
                                    </SheetTrigger>
                                </div>
                                <div className="flex-1 overflow-auto py-4">
                                    <div className="space-y-2">
                                        {buttonsArray.map((button, index) => (
                                            <SheetTrigger asChild key={index} className="duration-400 animate-popup" >
                                                <Button key={index} variant="ghost" className="w-full hover:bg-blue-300 dark:hover:bg-blue-dark flex gap-4 dark:text-white justify-start" asChild>
                                                    <Link to={button.redirect}>
                                                        {button.icon}
                                                        {button.text}
                                                    </Link>
                                                </Button>
                                            </SheetTrigger>

                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 border-t border-border">
                                    {auth && auth?.user && (
                                        <Button onClick={logout} className="w-full bg-destructive text-destructive-foreground hover:bg-secondary dark:text-white">
                                            Logout
                                        </Button>
                                    )}
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <Button variant="secondary" onClick={() => navigate(-1)} size="icon" className="rounded-full ">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex items-center space-x-2">
                    {!auth || !auth?.user ? (
                        <>
                            <Button variant="default" className="cursor-pointer" onClick={() => navigate("/login")}>Login</Button>
                            <Button variant="default" onClick={() => navigate("/register")} className="cursor-pointer" >Register</Button>
                        </>
                    ) : (
                        <>
                            <Button variant="default" onClick={() => navigate("/upload/video")} size="icon" className="rounded-full cursor-pointer">
                                <Upload className="h-5 w-5" />
                            </Button>
                            <Button variant="default" onClick={() => navigate("/upload/post")} size="icon" className="rounded-full cursor-pointer">
                                <Camera className="h-5 w-5" />
                            </Button>
                            <div onClick={() => navigate("/profile")} className="h-9 rounded-full cursor-pointer bg-primary flex items-center gap-2 px-3 justify-center">
                                <User className="h-5 w-5 text-primary-foreground" />
                                <span className="text-white font-semibold text-sm hidden md:inline">{auth.user.Name}</span>
                            </div>
                        </>
                    )}
                    <ModeToggle />

                </div>
            </div>
        </nav>
    );
});

export default Offcanvas;
