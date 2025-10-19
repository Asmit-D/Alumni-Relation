import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import useRefreshToken from '../hooks/useRefreshToken';
import {useAuth} from '../hooks/useAuth';

const PersistLogin = () => {
    const refresh = useRefreshToken();
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setIsLoading(false);
            }
        }

        if (!token) {
            verifyRefreshToken();
        }
        else {
            setIsLoading(false);
        }
    }, [])

    

    return (
        <>
            {isLoading ? <p>Loading...</p> : <Outlet />}
        </>
    )
}

export default PersistLogin