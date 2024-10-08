import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '@/Store/Store';
import { AuthState } from '@/Store/UserStore/Authentication/Interfaces';
import { AdminAuth } from '@/Store/AdminStore/Authentication/Interfaces';
import { UserManage } from '@/Store/AdminStore/Management/UserManagement/Interfaces';
import { PostState } from '@/Store/UserStore/Post-Management/Interfaces';
import { profileState } from '@/Store/UserStore/ProfileManagement/interfaces';
import { videoState } from '@/Store/UserStore/Video-Management/Interfaces';
import { useMemo } from 'react';
import { ChatState } from '@/Store/UserStore/Chat-Management/interfaces';
import { CategoryState } from '@/Store/AdminStore/Management/CategoryManagement/Interfaces';
import { shortState } from '@/Store/UserStore/Shorts-Management/interfaces';

interface RootReducerInterface {
    navigate: NavigateFunction;
    dispatch: AppDispatch;
    auth: AuthState;
    Admin: AdminAuth;
    adminuser: UserManage;
    post: PostState;
    profile: profileState;
    video: videoState
    Post: PostState;
    chat: ChatState;
    categoryadmin: CategoryState;
    shorts: shortState;
    // progress:number;
    // setProgress:React.Dispatch<SetStateAction<number | null>>
}



export const useEssentials = (): RootReducerInterface => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { auth, admin, adminuser, post, profile, video, chat, categoryadmin, shorts, voucheradmin } = useSelector(
        (state: RootState) => ({
            auth: state.auth,
            admin: state.admin,
            adminuser: state.adminuser,
            post: state.post,
            profile: state.profile,
            video: state.video,
            chat: state.chat,
            categoryadmin: state.categoryadmin,
            shorts: state.shorts,
            voucheradmin: state.voucheradmin,
            // progress,setProgress
        }),
        shallowEqual
    );

    return useMemo(() => ({
        dispatch,
        navigate,
        auth,
        Admin: admin,
        adminuser,
        post,
        Post: post,
        profile,
        video,
        chat,
        categoryadmin,
        shorts,
        voucheradmin
    }), [dispatch, navigate, voucheradmin, auth, admin, adminuser, post, profile, video, chat, shorts, categoryadmin]);
};
