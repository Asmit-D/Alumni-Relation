import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <div>
      <Link to="/alumni"><h1>Alumni</h1></Link>
      <Outlet />
    </div>
  )
}

export default App
