import { useEffect, useState } from "react";
import { Home, Newspaper, Award, Info, Phone, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import RoleHeader from "../components/ui/role-header";

const UserPage = () => {
  const [activePanel, setActivePanel] = useState("home");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Update active panel based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/user" || path === "/user/") {
      setActivePanel("home");
    } else if (path === "/user/beasiswa") {
      setActivePanel("beasiswa");
    } else if (path === "/user/informasi") {
      setActivePanel("informasi");
    } else if (path === "/user/konsultasi") {
      setActivePanel("konsultasi");
    } else if (path === "/user/profile") {
      setActivePanel("profile");
    } else if (path === "/user/verifikasi") {
      setActivePanel("verifikasi");
    }
  }, [location.pathname]);

  // Cek localStorage saat pertama render
  useEffect(() => {
    const savedPanel = localStorage.getItem("userActivePanel");
    if (savedPanel) setActivePanel(savedPanel);
  }, []);

  // Simpan setiap kali panel berubah
  useEffect(() => {
    localStorage.setItem("userActivePanel", activePanel);
  }, [activePanel]);

  const navigationItems = [
    { id: "home", icon: Home, label: "Home", path: "/user"},
    { id: "beasiswa", icon: Award, label: "Beasiswa", path: "/user/beasiswa" },
    { id: "informasi", icon: Info, label: "Info", path: "/user/informasi" },
    { id: "konsultasi", icon: Phone, label: "Konsultasi", path: "/user/konsultasi" },
    { id: "profile", icon: User, label: "Profile", path: isAuthenticated ? "/user/profile" : "/auth/login" },
  ];

  const handleNavigation = (item: any) => {
    setActivePanel(item.id);
    navigate(item.path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
      {/* Role Header */}
      <RoleHeader />
      
      {/* Main Content */}
      <div className="min-h-screen overflow-y-auto">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center py-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                activePanel === item.id
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              <item.icon size={20} className="mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
