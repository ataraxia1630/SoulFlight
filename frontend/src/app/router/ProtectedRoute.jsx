import { Navigate } from "react-router-dom";
import useAuthStore from "@/app/store/authStore";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;

{
  /* 
<ProtectedRoute allowedRoles={['PROVIDER']}>
  <ProviderDashboard />
</ProtectedRoute>; 
*/
}
