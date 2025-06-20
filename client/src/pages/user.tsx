
import { useEffect, useState } from "react";
import { Home, Newspaper, Award, Info, Phone, User } from "lucide-react";
import HomePanel from "../components/user/HomePanel";
import BeritaPanel from "../components/user/BeritaPanel";
import BeasiswaPanel from "../components/user/BeasiswaPanel";
import InformasiPanel from "../components/user/InformasiPanel";
import KonsultasiPanel from "../components/user/KonsultasiPanel";
import ProfilePanel from "../components/user/ProfilePanel";
import LoginRegister from "../components/user/LoginRegister";
import { useAuth } from "../contexts/AuthContext";
import VerifikasiPanel from "@/components/user/VerifikasiPanel";

const UserPage = () => {
  const [activePanel, setActivePanel] = useState("home");
  const { isAuthenticated, isRole } = useAuth();

  // Cek localStorage saat pertama render
  useEffect(() => {
    const savedPanel = localStorage.getItem("adminActivePanel");
    if (savedPanel) setActivePanel(savedPanel);
  }, []);

  // Simpan setiap kali panel berubah
  useEffect(() => {
    localStorage.setItem("adminActivePanel", activePanel);
  }, [activePanel]);
  
  const renderPanel = () => {
    switch (activePanel) {
      case "home":
        return <HomePanel />;
      case "berita":
        return <BeritaPanel />;
      case "beasiswa":
        return <BeasiswaPanel />;
      case "informasi":
        return <InformasiPanel />;
      case "konsultasi":
        return <KonsultasiPanel />;
      case "profile":
        if (!isAuthenticated) {
          return <LoginRegister />;
        }
        return <ProfilePanel onVerificationClick={() => setActivePanel("verifikasi")} />;
      case "verifikasi":
        return <VerifikasiPanel />;
      default:
        return <HomePanel />;
    }
  };

  const navigationItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "berita", icon: Newspaper, label: "Berita" },
    { id: "beasiswa", icon: Award, label: "Beasiswa" },
    { id: "informasi", icon: Info, label: "Info" },
    { id: "konsultasi", icon: Phone, label: "Konsultasi" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
      {/* Main Content */}
      <div className="min-h-screen overflow-y-auto">
        {renderPanel()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center py-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePanel(item.id)}
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
