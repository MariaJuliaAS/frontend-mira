import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouterProps {
    children: ReactNode;
}

export function PrivateRoutes({ children }: PrivateRouterProps) {
    const token = localStorage.getItem("@tokenMira");

    if (!token) {
        return <Navigate to="/login" />
    }

    return <>{children}</>
}