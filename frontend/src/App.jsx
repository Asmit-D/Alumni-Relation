import { useState, useEffect } from "react";
import Layout from "./Layout.jsx";
import AlumniList from "./pages/AlumniList.jsx";
import AlumniPage from "./pages/AlumniPage.jsx";
import Login from "./pages/Login.jsx";
import {
	createBrowserRouter,
	RouterProvider,
	createRoutesFromElements,
	Route,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

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
	

	return (
		<>
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
		</>
	);
}

export default App;
