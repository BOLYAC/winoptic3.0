// src/router/routes.tsx

import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import Register from '@/pages/auth/Register';
import Password from '@/pages/auth/PasswordReset';


function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/password" element={<Password />} />
    </Routes>
  );
}

export default AppRoutes;
