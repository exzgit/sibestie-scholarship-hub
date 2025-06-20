import { useState, useEffect } from "react";
import {
  LayoutDashboard, UserCheck, School, ChartBar,
  LucidePiggyBank, Newspaper, User, IdCard,
  BarChart
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

import { TableViewDataUser } from "@/components/admin/AdminDataUser";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminScholarship } from "@/components/admin/AdminScholarship";
import { AdminStatistic } from "@/components/admin/AdminStatistic";
import { AdminProfile } from "@/components/admin/AdminProfile";
import { AdminNews } from "@/components/admin/AdminNews";
import { AdminAccounting } from "@/components/admin/AdminAccounting";

const VerifikatorPage = () => {
  const [activePanel, setActivePanel] = useState("dashboard");
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

  const navItems = [
    { key: "dashboard", icon: <LayoutDashboard size={24} /> },
    { key: "datauser", icon: <IdCard size={24} /> },
    { key: "beasiswa", icon: <School size={24} /> },
    { key: "laporan", icon: <BarChart size={24} /> },
    { key: "donasi", icon: <LucidePiggyBank size={24} /> },
    { key: "berita", icon: <Newspaper size={24} /> },
  ];

  const renderPanel = () => {
    switch (activePanel) {
      case "dashboard": return <AdminDashboard />;
      case "datauser": return <TableViewDataUser />;
      case "beasiswa": return <AdminScholarship />;
      case "laporan": return <AdminStatistic />;
      case "donasi": return <AdminAccounting />;
      case "berita": return <AdminNews />;
      case "profil": return <AdminProfile />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <>
      {/* Mobile warning */}
      <div className="flex md:hidden min-h-screen bg-gradient-to-b from-white to-zinc-100 dark:from-[#0d0d0d] dark:to-[#111] items-center justify-center px-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md rounded-2xl p-6 w-full max-w-md text-center animate-fade-in-up">
          <div className="text-5xl mb-4">📵</div>
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
            Akses Terbatas
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            Halaman <span className="font-medium text-blue-500">Admin Dashboard</span> hanya tersedia untuk perangkat dengan layar lebar seperti <span className="font-medium">desktop</span> atau <span className="font-medium">tablet</span>.
          </p>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
            Silakan buka halaman ini di perangkat yang lebih besar untuk pengalaman terbaik.
          </p>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="flex hidden md:block min-h-screen bg-gradient-to-b from-white to-zinc-100 dark:from-[#0d0d0d] dark:to-[#111]">
        
        {/* Sidebar */}
        <div className="h-screen w-18 fixed border-r shadow-sm bg-white dark:bg-zinc-900 flex flex-col justify-between py-4 px-2">
          <div className="flex flex-col items-center gap-4">
            <h1 className="font-extrabold text-blue-600 text-3xl border-b pb-3">SB</h1>
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setActivePanel(item.key)}
                className={`p-2 rounded-full flex items-center justify-center transition 
                  ${activePanel === item.key
                    ? "bg-blue-500 text-white shadow-md"
                    : "hover:bg-blue-100 dark:hover:bg-zinc-800 text-blue-500"}`}
              >
                {item.icon}
              </button>
            ))}
          </div>

          {/* Profile */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setActivePanel("profil")}
              className={`p-2 rounded-full flex items-center justify-center transition 
                ${activePanel === "profil"
                  ? "bg-blue-500 text-white shadow-md"
                  : "hover:bg-blue-100 dark:hover:bg-zinc-800 text-blue-500"}`}
            >
              <User size={24} />
            </button>
          </div>
        </div>

        {/* Panel Konten */}
        <div className="flex-1 ml-14 transition-all duration-300 overflow-y-auto">
          {renderPanel()}
        </div>
      </div>
    </>
  );
};

export default VerifikatorPage;
