import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useHttpClient } from './HttpClient';
import './theme.css';
import SearchPage from './pages/SearchPage';
import DisplayPage from './pages/DisplayPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReviewPage from './pages/ReviewPage';
import BadLoginPage from './pages/BadLoginPage';
import LogoutPage from './pages/LogoutPage';

export default function App() {
  const httpClient = useHttpClient();

  useEffect(() => {
    httpClient.get('/api/hello').then(response => {
      console.log('Message from backend:', response.data.message);
    }).catch(error => {
      console.error('Error fetching hello from backend:', error);
    });
  }, [httpClient]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/displaypage" element={<DisplayPage />} />
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reviewpage" element={<ReviewPage />} />
        <Route path="/needtologin" element={<BadLoginPage />} />
        <Route path="/logoutpage" element={<LogoutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById('root')!); // Use createRoot from react-dom

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
