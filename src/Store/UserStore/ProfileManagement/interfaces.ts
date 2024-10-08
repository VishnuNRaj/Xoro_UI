import { User } from "../Authentication/Interfaces";
import { PostImage } from "../Post-Management/Interfaces";
import { Channel } from "../Video-Management/Interfaces";

export interface profileState {
    loadingProfile:boolean;
    users:User[];
    posts:PostImage[];
}
export interface EditProfilePic {
    Image:File;
    token:string;
}

export interface EditProfilePicResponse {
    message:string;
    user:User | null;
    status:number;
}

export interface EditBanner {
    Image:File;
    token:string;
}

export interface EditBannerResponse {
    message:string;
    user:User | null;
    status:number;
}

export interface profileSettings {
    Private:boolean;
    Notification:boolean;
    ProfileLock:boolean;
    token:string;
}

export interface profileSettingsResponse {
    message:string;
    status:number;
    user:User;
}

export interface searchUsers {
    token:string;
    search:string;
}

export interface searchUsersResponse {
    user?:User;
    users?:Array<User>
    message:string;
    status:number;
}

export interface editProfile {
    Name:string;
    Username:string;
    token:string;
    Description:string[];
}

export interface editProfileResponse {
    message:string;
    status:number;
    user:User;
}

export interface getProfile {
    token:string;
    ProfileLink:string;
}

export interface getProfileResponse {
    message:string;
    status:number;
    user:User;
    userData:User;
    post:{
        Images:PostImage[]
    }
}

export interface followUser {
    token:string;
    UserId:string;
}

export interface followUserResponse {
    message:string;
    status:number;
}


export interface createChannel {
    Name:string;
    Description:string;
    Type:string[];
    Logo:File;
    token:string;
}

export interface editChannel {
    Name:string;
    Description:string;
    Type:string[];
    Logo:string | null;
    token:string;
}

export interface createChannelResponse {
    message:string;
    status:number;
}

export interface getChannel {
    token:string;
    id?:string;
}

export interface getChannelResponse {
    message:string;
    Channel:Channel;
    status:number;
}