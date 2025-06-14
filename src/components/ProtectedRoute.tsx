
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Calculator } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredTier?: 'free' | 'premium' | 'enterprise';
}

const ProtectedRoute = ({ children, requiredTier = 'free' }: ProtectedRouteProps) => {
  const { user, subscription, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Calculator className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tierHierarchy = { free: 0, premium: 1, enterprise: 2 };
  const hasRequiredTier = tierHierarchy[subscription.tier] >= tierHierarchy[requiredTier];

  if (!hasRequiredTier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Calculator className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade Required</h2>
          <p className="text-gray-600 mb-6">
            This feature requires a {requiredTier} subscription or higher.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
