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
    }, []); // Este useEffect só será executado uma vez após a montagem do componente

    if (data.tipo === "user") {
        return <>{children}</>;
    } else {
        return null; // ou uma mensagem indicando que o redirecionamento está em andamento
    }
}
