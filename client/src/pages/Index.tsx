
import { useAuth } from "../contexts/AuthContext";
import UserPage from "./user";
import AdminPage from "./admin";
import VerifikatorPage from "./verifikator";

const Index = () => {
  const { isAuthenticated, isRole } = useAuth();

  if (isRole == "admin") {
    return (
      <AdminPage />
    );
  } else if (isRole == "verifikator") {
    return (
      <VerifikatorPage/>
    );
  } else {
    return (
      <UserPage/>
    );
  }
};

export default Index;
