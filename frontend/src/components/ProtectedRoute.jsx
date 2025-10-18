import { useEffect, useState } from 'react'
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function ProtectedRoute() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        if (!token) {
            navigate('/login', { replace: true });
        }
        else setChecked(true);
    }, [token, navigate]);

    if (!token && !checked) return null;

    return <Outlet />;
}

export default ProtectedRoute