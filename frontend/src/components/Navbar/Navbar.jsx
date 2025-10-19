import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import axios from '../../utils/axiosInstance.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useNavigate } from 'react-router-dom'

function Navbar() {
    const {token, setToken} = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        console.log('logging out');
        axios.post('logout/')
        .then((response) => {
            setToken(null);
            navigate('/login', {replace: true});
            console.log('Logged out successfully');
        })
        .catch((error) => {console.log(error);})
    }
return (
    <>
    <div className='flex bg-gray-900/90 place-content-between place-items-center border-y-8 border-x-8 border-gray-900 px-8 py-2'>
        <Link to={'/'}>
            <div className='text-5xl font-semibold text-zinc-100'>Alumni Module</div>
        </Link>
        <Button onClick={handleLogout} className={`place-content-center bg-white/10 ${token ? '' : 'hidden'}`}>LOGOUT</Button>
    </div>
    </>
)
}

export default Navbar