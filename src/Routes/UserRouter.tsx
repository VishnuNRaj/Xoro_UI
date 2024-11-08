import Offcanvas from "@/Assets/Canvas";
import Home from "@/Pages/User/Home";
import Login from "@/Pages/User/Login";
import Post from "@/Pages/User/Post";
import PostUpload from "@/Pages/User/PostUpload";
import Profile from "@/Pages/User/Profile";
import UserProfile from "@/Pages/User/UserProfile";
import { Routes, Route } from "react-router-dom";
import Register from "@/Pages/User/Register";
import VerifyAccount from "@/Pages/User/VerifyAccount";
import VideoUpload from "@/Pages/User/VideoUpload";
import Videos from "@/Pages/User/Videos";
import VideoPlayer from "@/Pages/User/VideoPlayer";
import Shorts from "@/Pages/User/Shorts";
import Stream from "@/Pages/User/Stream";
import LiveVideos from "@/Pages/User/LiveVideos";
import LivePage from "@/Pages/User/LivePage";
// import ProtectedRoute from "@/Context/Protected";
// import Icon from "@/Assets/User/Chat/Icon";

export default function UserRoutes() {
  return (
    <>
      <div className="w-full mb-2 h-[70px]">
        <Offcanvas />
      </div>
      <Routes>
        <Route path="/login" Component={Login} />
        <Route path="/register" Component={Register} />
      </Routes>
      {/* <ProtectedRoute> */}
      <>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/profile" Component={Profile} />
          <Route path="/profile/:ProfileLink" Component={UserProfile} />
          <Route path="/post/:id" Component={Post} />
          <Route path="/upload/post" Component={PostUpload} />
          <Route
            path="/verify-account/:VerificationLink/:UserId"
            Component={VerifyAccount}
          />

          <Route path="/videos/:VideoLink" Component={VideoPlayer} />
          <Route path="/videos" Component={Videos} />
          <Route path="/upload/video" Component={VideoUpload} />

          <Route path="/shorts" Component={Shorts} />
          <Route path="/shorts/:id" Component={Shorts} />

          <Route path="/stream" Component={Stream} />
          <Route path="/live" Component={LiveVideos} />
          <Route path="/live/:key" Component={LivePage} />
        </Routes>
      </>
      {/* </ProtectedRoute> */}
    </>
  );
}
