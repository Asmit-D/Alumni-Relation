import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../contexts/auth'

function Navbar() {
    const {token, setToken, setIsEditor} = useAuth();
    const handleLogout = () => {
        console.log('logging out');

        setToken(null);
        setIsEditor(false);

        axios.post(import.meta.env.VITE_BASE_URL + 'logout/')
        .then((response) => {
            console.log(response.data);
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