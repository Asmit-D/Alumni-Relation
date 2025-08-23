import { createContext, useContext } from "react";

export const AuthContext = createContext({
    token:"",
    isEditor: false,
    setToken: () => {},
    setIsEditor: () => {},
});

export const AuthProvider = AuthContext.Provider;

export const useAuth = () => {
    return useContext(AuthContext);
};