import { User } from "../Authentication/Interfaces";
import { Channel, Reactions } from "../Video-Management/Interfaces";

export interface Shorts {
    _id:string;
    Caption: string;
    Video: string;
    Key: string;
    Views: number;
    Likes: number;
    Dislikes: number;
    reactions:Reactions[];
    Comments:number;
    ChannelId:string;
    Hashtags:string[];
    Context:string;
    Settings:{
        Private:boolean;
        CommentsOn:boolean;
    };
    UploadDate:Date;
    Duration:string;
    Uploaded:boolean;
    VideoLink:string;
    channel:Channel;
};

export interface shortState {
    Shorts:Shorts[];
    loadingShorts:boolean;
}

export interface uploadShorts {
    Caption:string;
    Shorts:File;
    Context:string;
    CommentsOn:boolean;
    Hashtags:string[];
    Private:boolean;
    token:string;
}

export interface uploadShortsResponse {
    message:string;
    status:number;
}

export interface getShorts {
    token:string;
    shorts:string[]
}

export interface getShortsResponse {
    message:string;
    shorts:string[];
    total:number;
    status:number;
}

export interface getShortsVideo {
    id:string;
    token:string;
}

export interface getShortsVideoResponse {
    message:string;
    status:number;
    shorts:Shorts;
    user:User;
}