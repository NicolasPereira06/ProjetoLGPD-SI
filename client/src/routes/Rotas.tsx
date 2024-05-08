import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import Terms from "../pages/SignUp/Terms";
import UserScreen from "../pages/UserScreen/UserScreen"

export const Rotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/userscreen" element={<UserScreen />} />
                <Route path="/" element={<Navigate to={'/login'} />} />
                <Route path="*" element={<h1>PÁGINA NÃO ENCONTRADA</h1>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default Rotas;