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
import VerifikatorUserList from "./components/verifikator/VerifikatorUserList";
import VerifikatorUserDetail from "./components/verifikator/VerifikatorUserDetail";

// Protected Route Component for specific roles
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { isAuthenticated, isRole } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  if (!allowedRoles.includes(isRole)) {
    // Redirect based on role to their default page
    if (isRole === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (isRole === "verifikator") {
      return <Navigate to="/verifikator" replace />;
    } else if (isRole === "user") {
      return <Navigate to="/user" replace />;
    } else {
      // Fallback for unknown roles
      return <Navigate to="/auth/login" replace />;
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
  
  // Redirect based on role to their default page
  if (isRole === "admin") {
    return <Navigate to="/admin" replace />;
  } else if (isRole === "verifikator") {
    return <Navigate to="/verifikator" replace />;
  } else if (isRole === "user") {
    return <Navigate to="/user" replace />;
  } else {
    // Fallback for unknown roles
    return <Navigate to="/auth/login" replace />;
  }
};

// Component to handle unauthorized access
const UnauthorizedAccess = () => {
  const { isRole } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-red-600">403</h1>
        <p className="text-xl text-gray-600 mb-4">Akses Ditolak</p>
        <p className="text-gray-500 mb-4">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <p className="text-sm text-gray-400">
          Role Anda: <span className="font-medium">{isRole || 'Tidak diketahui'}</span>
        </p>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect based on role */}
      <Route path="/" element={<RoleRedirect />} />
      
      {/* User routes - Only accessible by user role */}
      <Route 
        path="/user" 
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserPage />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePanel />} />
        <Route path="profile" element={<ProfilePanel />} />
        <Route path="beasiswa" element={<BeasiswaPanel />} />
        <Route path="berita" element={<BeritaPanel />} />
        <Route path="informasi" element={<InformasiPanel />} />
        <Route path="konsultasi" element={<KonsultasiPanel />} />
        <Route path="verifikasi" element={<VerifikasiPanel />} />
      </Route>
      
      {/* Admin routes - Only accessible by admin role */}
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

      {/* Verifikator routes - Only accessible by verifikator role */}
      <Route 
        path="/verifikator" 
        element={
          <ProtectedRoute allowedRoles={["verifikator"]}>
            <VerifikatorPage />
          </ProtectedRoute>
        }
      >
        <Route path="datauser" element={<VerifikatorUserList />} />
        <Route path="datauser/:id" element={<VerifikatorUserDetail />} />
      </Route>

      {/* Auth routes - Accessible by all */}
      <Route path="/auth/login" element={<LoginRegister />} />
      
      {/* Unauthorized access page */}
      <Route path="/unauthorized" element={<UnauthorizedAccess />} />
      
      {/* Catch all - Show 404 for unknown routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
