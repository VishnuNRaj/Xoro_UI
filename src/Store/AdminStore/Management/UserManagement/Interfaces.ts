export interface GetUsers {
    token:string;
}
export interface GetUsersResponse {
    message: string;
    status:number;
    users:any;
}

export interface UserManage {
    users:any[];
    message:string;
    loadingUsers:boolean;
}


export interface UpdateUser {
    token:string;
    UserId:string;
    Reason:string;
    Terminate:boolean;
    Suspended:boolean;
    SuspendedTill:number | null;
}

export interface UpdateUserResponse {
    message:string;
    status:number;
}