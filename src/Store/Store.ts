import { configureStore, combineReducers, Reducer } from '@reduxjs/toolkit';
import authReducer from './UserStore/Authentication/AuthSlice';
import authSliceAdmin, { resetAdminState } from './AdminStore/Authentication/AuthSlice';
import { AuthState } from './UserStore/Authentication/Interfaces';
import { AdminAuth } from './AdminStore/Authentication/Interfaces';
import AdminUserSlice, { resetAdminUserState } from './AdminStore/Management/UserManagement/AdminUserSlice';
import { UserManage } from './AdminStore/Management/UserManagement/Interfaces';
import { PostState } from './UserStore/Post-Management/Interfaces';
import postSlice from './UserStore/Post-Management/PostSlice';
import { profileState } from './UserStore/ProfileManagement/interfaces';
import profileSlice from './UserStore/ProfileManagement/ProfileSlice';
import { videoState } from './UserStore/Video-Management/Interfaces';
import VideoSlice from './UserStore/Video-Management/VideoSlice';
import ChatSlice from './UserStore/Chat-Management/ChatSlice';
import CategoryAdmin from "./AdminStore/Management/CategoryManagement/CategorySlice"
import VoucherAdmin from "./AdminStore/Management/VoucherManagement/voucherSlice"
import { CategoryState } from "./AdminStore/Management/CategoryManagement/Interfaces"
import { ChatState } from './UserStore/Chat-Management/interfaces';
import { shortState } from './UserStore/Shorts-Management/interfaces';
import shortSlice from "./UserStore/Shorts-Management/shortSlice"
import { VoucherState } from './AdminStore/Management/VoucherManagement/interface';
interface RootReducerInterface {
  auth: AuthState;
  admin: AdminAuth;
  adminuser: UserManage;
  post: PostState;
  profile: profileState;
  video: videoState,
  chat: ChatState,
  categoryadmin: CategoryState,
  voucheradmin: VoucherState,
  shorts: shortState
}

const rootReducer: Reducer<RootReducerInterface> = combineReducers({
  auth: authReducer,
  admin: authSliceAdmin,
  adminuser: AdminUserSlice,
  post: postSlice,
  profile: profileSlice,
  video: VideoSlice,
  chat: ChatSlice,
  categoryadmin: CategoryAdmin,
  voucheradmin: VoucherAdmin,
  shorts: shortSlice,
});



export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const resetAdminStates = () => (dispatch: AppDispatch) => {
  dispatch(resetAdminState());
  dispatch(resetAdminUserState());
};


const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
