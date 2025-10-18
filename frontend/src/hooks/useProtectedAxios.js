import { protectedAxios } from "../utils/axiosInstance";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import {useAuth} from "./useAuth";

const useProtectedAxios = () => {
    const refresh = useRefreshToken();
    const { token } = useAuth();

    useEffect(() => {

        const requestIntercept = protectedAxios.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = protectedAxios.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return protectedAxios(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            protectedAxios.interceptors.request.eject(requestIntercept);
            protectedAxios.interceptors.response.eject(responseIntercept);
        }
    }, [token, refresh])

    return protectedAxios;
}

export default useProtectedAxios;