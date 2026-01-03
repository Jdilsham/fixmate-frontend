import { jwtDecode } from "jwt-decode";

export function getAuthUser(){
    const token = localStorage.getItem("token");
    if(!token) return null;

    const payload = jwtDecode(token);
    if(!payload ) return null;

    return{
        username: payload.sub,
        role: payload.role,
    }
}