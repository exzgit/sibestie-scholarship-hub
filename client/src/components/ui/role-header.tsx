import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, Shield, Users } from "lucide-react";

const RoleHeader = () => {
  const { user, logout, isRole } = useAuth();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "verifikator":
        return <Users className="w-4 h-4" />;
      case "user":
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "verifikator":
        return "Verifikator";
      case "user":
        return "User";
      default:
        return "Unknown";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "verifikator":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "user":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getRoleColor(isRole)}`}>
          {getRoleIcon(isRole)}
          <span className="text-sm font-medium">{getRoleLabel(isRole)}</span>
        </div>
        <div className="text-sm text-gray-600">
          Selamat datang, <span className="font-medium">{user.name}</span>
        </div>
      </div>
      
      <Button
        onClick={logout}
        variant="outline"
        size="sm"
        className="flex items-center space-x-2 text-gray-600 hover:text-red-600 hover:border-red-300"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </Button>
    </div>
  );
};

export default RoleHeader; 