// import { Socket } from "socket.io-client";
import { User } from "../Authentication/Interfaces";

export interface Chat {
    Message: string;
    Seen:string[];
    FileLink: string;
    FileType: string;
    SenderId: string;
    RoomId: string;
    Time: Date;
    user: User
    Username:string;
    _id:string;
}

export interface Notification {
    Message: string;
    SenderId: string;
    Link: string;
    Type: string;
    Seen: boolean;
    Time: Date;
    _id:string;
}

export interface AllChatState {
    _id:string;
    Users: {
        UserId:string;
        Admin:boolean;
    }[];
    users:User[];
    LastClear:{
        UserId:string;
        Time:Date;
    };
    GroupName: string;
    Profile:string;
    RoomId:string;
    messages:Chat[];
    latestMessage:Chat;
}
export interface ChatState {
    chat: AllChatState | null;
    loadingChat: boolean;
    Notifications: Notification[];
    RoomId:string;
}

export interface getChats {
    token: string;
}

export interface getChatsResponse {
    message: string;
    status: number;
    allChat:AllChatState[];
}

export interface startChat {
    UserId:string[];
    token:string;
    GroupName?:string;
    Profile?:string;
}

export interface startChatResponse {
    message:string;
    status:number;
    newChat:AllChatState;
    users:User[];
}

export interface getChat {
    RoomId:string;
    token:string;
}

export interface getChatResponse {
    Chat:AllChatState;
    status:number;
    message:string;
}