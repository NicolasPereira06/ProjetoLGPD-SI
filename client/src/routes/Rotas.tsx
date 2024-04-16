import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";

export const Rotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/" element={<Navigate to={'/login'} />} />
                <Route path="*" element={<h1>PÁGINA NÃO ENCONTRADA</h1>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default Rotas;