export interface linkedInConfigInterface {
    CliendID: string;
    Secret: string;
    RedirectURL: string;
}
export const linkedInConfig = (): linkedInConfigInterface => {
    return <linkedInConfigInterface>{
        CliendID: import.meta.env.VITE_APP_LINKEDIN_CLIENT_ID || '',
        Secret: import.meta.env.VITE_APP_LINKEDIN_CLIENT_SECRET || '',
        RedirectURL: import.meta.env.VITE_APP_REDIRECT_URL || '',
    }
}