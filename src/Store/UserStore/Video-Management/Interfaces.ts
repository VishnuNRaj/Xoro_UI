import { SetStateAction } from "react";
import { User } from "../Authentication/Interfaces";
import { LiveInterface } from "../CommonManagements/interfaces";
import { Shorts } from "../Shorts-Management/interfaces";

export interface Channel {
    _id: string;
    Name: string,
    UserId: string;
    Type: string[];
    Subsribers: string[];
    Reports: number;
    Logo: string;
    Description:string;
    videos:Video[];
    live:LiveInterface[];
    shorts:Shorts[];
    ChannelLink:string;
}
export interface Reactions {
    PostId: string;
    Views: string[];
    Likes: string[];
    users: User[];
    Dislikes: string[];
    LikesDetails: User[];
    DislikesDetails: User[];
}
export interface Video {
    _id: string;
    Caption: string;
    UserId: string;
    Video: string;
    Thumbnail: string;
    Duration: string;
    Postdate: Date;
    Settings: {
        CommentsOn: boolean;
        PremiumContent: boolean;
        ListedContent: boolean;
    },
    Restriction: number;
    Hashtags: string[];
    RelatedTags: string;
    Views: number;
    Likes: number;
    Dislikes: number;
    Liked: boolean;
    Disliked: boolean;
    Viewed: boolean;
    Description: string;
    VideoLink: string;
    Uploaded: boolean
    Channel: Channel[];
    reactions: Reactions[]
}
export interface videoState {
    Channel: Channel | null;
    Videos: Video[];
    loadingVideo: boolean;
}

export interface uploadVideo {
    Caption: string;
    Description: string;
    Hashtags: string[];
    Settings: {
        CommentsOn: boolean;
        PremiumContent: boolean;
        ListedContent: boolean;
    },
    Restriction: number;
    Thumbnail: string;
    Video: File;
    Duration: string;
    RelatedTags: string;
    token: string;
    setProgress: React.Dispatch<SetStateAction<number | null>>
}

export interface uploadVideoResponse {
    status: number;
    message: string;
}
export interface getVideos {
    random: number;
    skip: number;
    token?: string;
}

export interface getVideosResponse {
    status: number;
    message: string;
    user: User;
    Videos: Video[];
}

export interface getVideo {
    VideoLink: string;
    token?: string;
}

export interface getVideoResponse {
    status: number;
    message: string;
    user: User;
    Video: Video;
}