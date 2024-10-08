import { User } from "../Authentication/Interfaces";
import { Comments } from "../CommonManagements/interfaces";
import { Reactions } from "../Video-Management/Interfaces";

export interface PostImage {
    _id: string;
    Images: {
        postType: string,
        link: string,
    }[];
    Caption: string;
    Hashtags: string[];
    Tags: string[];
    Comments: number;
    Hidden: boolean;
    Likes: number;
    Dislikes: number;
    ShareLink: string;
    PostDate: Date;
    CommentsOn: boolean;
    user: User;
    tags: User[];
    reactions: Reactions;
    comments: Comments[];
}

export interface PostState {
    message: string;
    post: PostImage[];
    loadingPost: boolean;
}

export interface addPost {
    Images: File[];
    Caption: string;
    Hashtags: string[];
    Tags: string[];
    token: string;
    CommentsOn: boolean;
    Hidden: boolean;
}

export interface showPost {
    token: string;
}

export interface addPostResponse {
    message: string;
    status: number;
}


export interface showPostResponse {
    message: string;
    status: number;
    post?: PostImage[],
    user?: User | null;
}

export interface deletePost {
    token: string;
    PostId: string;
}

export interface deletePostResponse {
    message: string;
    status: number;
}

export interface getPosts {
    token: string;
    skip: number;
}
export interface getPostsResponse {
    post: PostImage[];
    user: User;
    status: number;
    message: string;
}

export interface likeDislikeRemove {
    token: string;
    postId: string;
    type: string;
    base: string;
}

export interface likeDislikeRemoveResponse {
    message: string;
    status: number;
}

export interface getPost {
    id: string;
    token: string;
}

export interface getPostResponse {
    post: PostImage;
    user: User;
    status: number;
    message: string;
}