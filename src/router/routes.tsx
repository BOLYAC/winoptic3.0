// src/router/routes.tsx

import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import Register from '@/pages/auth/Register';
import RequestResetPage from '@/pages/auth/PasswordRequest';
import ResetPasswordPage from '@/pages/auth/ResetPassword';
import Home from '@/pages/home';

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/password" element={<RequestResetPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
    </Routes>
  );
}

export default AppRoutes;
