// import SidebarComponent from "@/Assets/Sidebar";
import Login from "@/Pages/User/Login";
import Profile from "@/Pages/User/Profile";
import { Routes, Route } from "react-router-dom";

export default function UserRoutes() {

    return (
        <>
                <Routes>
                    <Route path="/login" Component={Login} />
                    <Route path="/" Component={Profile} />
                </Routes>
        </>
    );
};

