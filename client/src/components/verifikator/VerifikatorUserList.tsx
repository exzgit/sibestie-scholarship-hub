import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import axios from "axios";

interface VerificationUser {
  id: number;
  user_id: number;
  nama_lengkap: string;
  email: string;
  status: string;
  created_at: string;
}

const VerifikatorUserList = () => {
  const [users, setUsers] = useState<VerificationUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await axios.get("http://localhost:8081/api/verification-users");
        
        // Ensure response.data is an array
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error("Response is not an array:", response.data);
          setUsers([]);
          setError("Data format tidak valid");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
        setError("Gagal memuat data verifikasi");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">Daftar User Meminta Verifikasi</h1>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-2 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">Daftar User Meminta Verifikasi</h1>
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Daftar User Meminta Verifikasi</h1>
      <div className="overflow-x-auto rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200">
          <thead className="bg-zinc-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-600">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-600">Nama</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-600">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-600">Status</th>
              <th className="px-6 py-3 text-sm font-semibold text-right text-zinc-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y max-h-screen overflow-y-auto divide-zinc-200">
            {users.map((user, idx) => (
              <tr key={user.id}>
                <td className="px-6 py-4 text-sm text-zinc-700">{idx + 1}</td>
                <td className="px-6 py-4 text-sm text-zinc-900">
                  <div className="flex items-center">
                    {user.nama_lengkap}
                    {user.status === 'approved' && (
                      <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-700">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    user.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    user.status === 'approved' ? 'bg-green-100 text-green-700' :
                    user.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {user.status === 'approved' ? (
                    <span className="text-sm text-green-600 font-medium">Terverifikasi</span>
                  ) : (
                    <Button
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => navigate(`/verifikator/datauser/${user.id}`)}
                    >
                      Lihat Detail
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-zinc-500">
                  Tidak ada user yang meminta verifikasi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VerifikatorUserList; 