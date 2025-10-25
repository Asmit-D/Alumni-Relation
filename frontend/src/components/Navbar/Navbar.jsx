import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import axios from '../../utils/axiosInstance.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useNavigate } from 'react-router-dom'

function Navbar() {
    const {token, setToken, setIsEditor} = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        console.log('logging out');
        axios.post('logout/')
        .then((response) => {
            setToken(null);
            setIsEditor(false);
            navigate('/login', {replace: true});
            console.log('Logged out successfully');
        })
        .catch((error) => {console.log(error);})
    }
return (
    <nav className='sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-lg shadow-black/20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center py-4'>
                <Link to={'/'} className='group'>
                    <h1 className='text-3xl md:text-4xl font-light text-white/90 tracking-wide transition-all duration-300 group-hover:text-white'>
                        Alumni Module
                    </h1>
                </Link>
                {token && (
                    <Button 
                        onClick={handleLogout} 
                        className='backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white/90 font-light rounded-full px-6 py-2 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30'
                    >
                        Logout
                    </Button>
                )}
            </div>
        </div>
    </nav>
)
}

export default Navbar