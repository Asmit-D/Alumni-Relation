import { useState, useEffect } from 'react';
import Layout from './Layout.jsx';
import AlumniList from './pages/AlumniList.jsx';
import AlumniPage from './pages/AlumniPage.jsx';
import Login from './pages/Login.jsx';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/auth.js';
import { setupInterceptors } from './utils/axiosInstance.js';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
	<Route path="/" element={<Layout />}>
	  <Route path="login" element={<Login />} />
	  <Route element={<ProtectedRoute />}>
		<Route path="" element={<AlumniList />} />
		<Route path=":id" element={<AlumniPage />} />
	  </Route>
	
	</Route>
  )
);
function App() {

  const [token, setTokenState] = useState(localStorage.getItem('token') || null);
  const setToken = (newToken)=>{
	setTokenState(newToken);
	if (newToken) {
	  localStorage.setItem('token', newToken);
	} else {
	  localStorage.removeItem('token');
	}
  }

  const [is_Editor, setIsEditorState] = useState(JSON.parse(localStorage.getItem("is_editor")) || false);
  const setIsEditor = (isEditor) => {
	setIsEditorState(isEditor);
	localStorage.setItem('is_editor', JSON.stringify(isEditor));
  }

  useEffect(() => {
	console.log("Token in AuthContext:", token);
  }, [token]);


  useEffect(() => {
	setupInterceptors(setToken);
  }
  , []);

  return (
	<>
	<AuthProvider value={{token, setToken, is_Editor, setIsEditor}}>
	  <RouterProvider router={router} />
	</AuthProvider>
	</>
  )
}

export default App
