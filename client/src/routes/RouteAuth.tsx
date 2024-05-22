import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function PrivateRouteUser({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const data = {
        id: localStorage.getItem('userId'),
        tipo: localStorage.getItem('userType')
    };

    useEffect(() => {
        if (data.tipo !== "user") {
            navigate('/login');
        }
    }, []);

    if (data.tipo === "user") {
        return <>{children}</>;
    } else {
        return null;
    }
}

export function PrivateRouteAdmin({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const data = {
        id: localStorage.getItem('userId'),
        tipo: localStorage.getItem('userType')
    };

    useEffect(() => {
        if (data.tipo !== "admin") {
            navigate('/login');
        }
    }, []);

    if (data.tipo === "admin") {
        return <>{children}</>;
    } else {
        return null;
    }
}