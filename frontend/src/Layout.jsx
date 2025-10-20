import Navbar from './components/Navbar/Navbar'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Navbar />
        <Outlet />
    </div>
  )
}

export default Layout