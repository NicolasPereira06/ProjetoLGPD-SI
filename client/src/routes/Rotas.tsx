import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import Terms from "../pages/SignUp/Terms";
import UserScreen from "../pages/UserScreen/UserScreen"
import { PrivateRouteAdmin, PrivateRouteUser } from "./RouteAuth";

export const Rotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/terms" element={<Terms />} />
                <Route 
                    path="/userscreen" 
                    element={
                        <PrivateRouteUser>
                            <UserScreen />
                        </PrivateRouteUser>
                    }     
                />
                {/* <Route 
                    path="/adminscreen" 
                    element={
                        <PrivateRouteAdmin>
                        </PrivateRouteAdmin>
                    }     
                /> */}
                <Route path="/" element={<Navigate to={'/login'} />} />
                <Route path="*" element={<Navigate to={'/login'} />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default Rotas;