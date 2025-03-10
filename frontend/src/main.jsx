import React, { StrictMode } from 'react';
import axios from 'axios';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import AlumniList from './pages/AlumniList.jsx';
import AlumniPage from './pages/AlumniPage.jsx';
import App from './App.jsx';
import './index.css';

async function alumniLoader() {
  try {
    const response = await axios.get("http://127.0.0.1:8000/alumni/");
    return response.data; // Return the data
  } catch (error) {
    console.log(error);
  }
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<AlumniList />} loader={alumniLoader} />
    <Route path="/:id" element={<AlumniPage />} />
    </>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
