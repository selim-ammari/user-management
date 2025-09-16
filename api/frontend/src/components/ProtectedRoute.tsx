import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactElement }): React.ReactElement {
  const ctx = useContext(AuthContext);
  const location = useLocation();
  if (!ctx || !ctx.user) return <Navigate to="/login" replace />;
  if (location.pathname.startsWith('/admin') && ctx.user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}


