import axios from '../utils/axiosInstance';
import { useAuth } from './useAuth';

const useRefreshToken = () => {
    const { setToken } = useAuth();

    const refresh = async () => {
        const response = await axios.post('token/refresh/', {
            withCredentials: true
        });
        setToken(response.data.access);
        return response.data.access;
    }
    return refresh;
};

export default useRefreshToken;