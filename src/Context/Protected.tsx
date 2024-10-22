import { Navigate } from "react-router-dom";
import { getCookie } from "@/Functions/Cookies";

interface ProtectedRouteProps {
    children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const token = getCookie("token");
    if (!token) {
        return <Navigate to="/login" />;
    }
    return {children};
}
