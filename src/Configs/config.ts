interface configuration {
    BASE:string;
    USER: string;
    ADMIN: string;
    POST: string;
    PORT: number;
    SECRET: string;
    PROFILE:string;
    VIDEO:string;
    CHAT:string;
    SERVER:string;
    SOCKET:string;
}


const config: configuration = {
    BASE:import.meta.env.VITE_APP_BASE_URL,
    USER: import.meta.env.VITE_APP_USER_API_URL,
    ADMIN: import.meta.env.VITE_APP_ADMIN_API_URL,
    POST: import.meta.env.VITE_APP_POST_API_URL,
    PORT: parseInt(import.meta.env.VITE_APP_PORT),
    SECRET: import.meta.env.VITE_APP_SECRET,
    PROFILE:import.meta.env.VITE_APP_PROFILE_API_URL,
    VIDEO:import.meta.env.VITE_APP_VIDEO_API_URL,
    CHAT:import.meta.env.VITE_APP_CHAT_API_URL,
    SERVER:import.meta.env.VITE_APP_SERVER_URL,
    SOCKET:import.meta.env.VITE_APP_SOCKET_URL
}

export default config;