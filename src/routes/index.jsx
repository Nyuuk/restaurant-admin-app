import { createBrowserRouter, createRoutesFromElements, Navigate, Route, Router } from 'react-router-dom';

// Pages
import Login from '../pages/auth/Login';
import { AuthProvider } from '../context/AuthContext';

// Auth guard component
const ProtectedRoute = ({ children }) => {
  // This is a simple check. In a real app, you'd use a more robust auth check
  const isAuthenticated = localStorage.getItem('token');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Create router
const router = createBrowserRouter(createRoutesFromElements(
  <Route>
    <AuthProvider>
      <Route path='*' element={<Navigate to={'/login'} replace />} />
      <Route path='/login' element={<Login />} />
    </AuthProvider>
  </Route>
));

export default router;