import { User } from "../Authentication/Interfaces";
import { PostImage } from "../Post-Management/Interfaces";
import { Channel, Reactions } from "../Video-Management/Interfaces";

export interface LiveInterface {
    _id:string;
    Caption: string;
    Description: string;
    Key: string;
    Live: boolean;
    Duration: string;
    Start: Date;
    End: Date;
    Completed: boolean;
    Views: number;
    Likes: number;
    Dislikes: number;
    RelatedTags: string;
    UserId: string;
    Reports: number;
    Thumbnail: string;
    Restriction: number;
    reactions: Reactions[];
    from: string;
    Video: string;
    channel:Channel[]
}

export interface searchData {
    token: string;
    search: string;
}

export interface searchResponse {
    message: string;
    data: {
        users: User[];
        posts: PostImage[];
        channel: Channel[];
    }
    status: number;
}

export interface CommentReply {
    _id: string;
    Comment: string[];
    CommentId: string;
    Likes: number;
    tags: User[];
    user: User;
}

export interface Comments {
    PostId: string;
    Comment: string[];
    tags: User[];
    user: User;
    UserId: string;
    _id: string;
    replies: CommentReply[];
}


export interface addComment {
    PostId: string;
    token: string;
    Comment: string[];
}

export interface getComments {
    PostId: string;
    token: string;
}


export interface getCommentResponse {
    message: string;
    status: number;
    Comment: Comments[];
}

export interface addCommentResponse {
    message: string;
    status: number;
    Comment: Comments[];
}

export interface Category {
    Name: string;
    _id: string;
    Videos: number;
    Listed: boolean;
    CreatedAt: Date;
}

export interface trimVideo {
    video: File,
    start: number;
    end: number;
    token: string;
}


export interface createLive {
    Caption: string;
    token: string;
    Description: string;
    Hashtags: string[];
    Thumbnail: File;
    RelatedTags: string;
    Restriction: number;
}

export interface createLiveResponse {
    live: LiveInterface;
    message: string;
    status: number;
}

export interface getLiveVideos {
    token:string;
    isLive:boolean;
    type:string;
    videos:string[];
}

export interface getLiveVideosResponse {
    message:string;
    videos:LiveInterface[];
    status:number;
}

export interface getLiveVideo {
    key:string;
    token:string;
}
