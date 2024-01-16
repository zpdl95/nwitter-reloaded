import React from 'react';
import { useAuthContext } from '../context/auth-context';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthContext();
  if (user === null) {
    return <Navigate to={'/'} />;
  }
  return children;
}
