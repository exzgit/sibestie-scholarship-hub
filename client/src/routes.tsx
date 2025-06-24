// src/routes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import UserPage from "./pages/user";
import AdminPage from "./pages/admin";
import VerifikatorPage from "./pages/verifikator";
import NotFound from "./pages/NotFound";

import HomePanel from "./components/user/HomePanel";
import ProfilePanel from "./components/user/ProfilePanel";
import BeasiswaPanel from "./components/user/BeasiswaPanel";
import BeritaPanel from "./components/user/BeritaPanel";
import InformasiPanel from "./components/user/InformasiPanel";
import KonsultasiPanel from "./components/user/KonsultasiPanel";
import VerifikasiPanel from "./components/user/VerifikasiPanel";
import LoginRegister from "./components/user/LoginRegister";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { TableViewDataUser } from "./components/admin/AdminDataUser";
import { AdminScholarship } from "./components/admin/AdminScholarship";
import { AdminAccounting } from "./components/admin/AdminAccounting";
import { AdminStatistic } from "./components/admin/AdminStatistic";
import { AdminNews } from "./components/admin/AdminNews";
import { AdminProfile } from "./components/admin/AdminProfile";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { isAuthenticated, isRole } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  if (!allowedRoles.includes(isRole)) {
    // Redirect based on role
    if (isRole === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (isRole === "verifikator") {
      return <Navigate to="/verifikator" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  
  return <>{children}</>;
};

// Role-based redirect component
const RoleRedirect = () => {
  const { isAuthenticated, isRole } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  if (isRole === "admin") {
    return <Navigate to="/admin" replace />;
  } else if (isRole === "verifikator") {
    return <Navigate to="/verifikator" replace />;
  } else {
    return <Navigate to="/user" replace />;
  }
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect based on role */}
      <Route path="/" element={<RoleRedirect />} />
      
      {/* User routes */}
      <Route path="/user" element={<UserPage />}>
        <Route index element={<HomePanel />} />
        <Route path="profile" element={<ProfilePanel />} />
        <Route path="beasiswa" element={<BeasiswaPanel />} />
        <Route path="berita" element={<BeritaPanel />} />
        <Route path="informasi" element={<InformasiPanel />} />
        <Route path="konsultasi" element={<KonsultasiPanel />} />
        <Route path="verifikasi" element={<VerifikasiPanel />} />
        <Route path="auth/login" element={<LoginRegister />} />
      </Route>
      
      {/* Admin routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminPage />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="datauser" element={<TableViewDataUser />} />
        <Route path="beasiswa" element={<AdminScholarship />} />
        <Route path="laporan" element={<AdminStatistic />} />
        <Route path="donasi" element={<AdminAccounting />} />
        <Route path="berita" element={<AdminNews />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Verifikator routes */}
      <Route 
        path="/verifikator" 
        element={
          <ProtectedRoute allowedRoles={["verifikator"]}>
            <VerifikatorPage />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="datauser" element={<TableViewDataUser />} />
        <Route path="beasiswa" element={<AdminScholarship />} />
        <Route path="laporan" element={<AdminStatistic />} />
        <Route path="donasi" element={<AdminAccounting />} />
        <Route path="berita" element={<AdminNews />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Auth routes */}
      <Route path="/auth/login" element={<LoginRegister />} />
      
      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
