// Example: React + React Router
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Or check auth context

  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;