import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle, RefreshCcw } from "lucide-react";
import axios from "axios";

// Raw API response data interface
interface ApiVerificationUser {
  id: number;
  user_id: number;
  nama_lengkap?: string;
  email?: string;
  status?: string;
  created_at?: string;
  // Other possible fields that might be in the API response
  data?: unknown;
  message?: string;
}

// Normalized user data for the component
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

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await axios.get("http://localhost:8081/api/verification-users");
      
      // Handle null response specifically
      if (response.data === null) {
        // If the server returns null, treat it as an empty array
        setUsers([]);
        return;
      }
      
      // Properly handle different response formats
      if (Array.isArray(response.data)) {
        // Normalize data to ensure it matches our interface
        const normalizedData = response.data.map((user: ApiVerificationUser) => ({
          id: user.id || 0,
          user_id: user.user_id || 0,
          nama_lengkap: user.nama_lengkap || 'Tidak ada nama',
          email: user.email || 'Tidak ada email',
          status: (user.status || 'pending').toLowerCase(),
          created_at: user.created_at || new Date().toISOString()
        }));
        
        setUsers(normalizedData);
      } else if (typeof response.data === 'object' && response.data !== null) {
        // Handle case where response is an object (possibly with data property)
        const dataArray = response.data.data || [];
        if (Array.isArray(dataArray)) {
          const normalizedData = dataArray.map((user: ApiVerificationUser) => ({
            id: user.id || 0,
            user_id: user.user_id || 0,
            nama_lengkap: user.nama_lengkap || 'Tidak ada nama',
            email: user.email || 'Tidak ada email',
            status: (user.status || 'pending').toLowerCase(),
            created_at: user.created_at || new Date().toISOString()
          }));
          setUsers(normalizedData);
        } else {
          console.error("Response data is not in expected format:", response.data);
          setUsers([]);
          setError("Data format tidak valid: respon tidak berisi array");
        }
      } else {
        console.error("Response is not valid:", response.data);
        setUsers([]);
        setError("Data format tidak valid: respon bukan array atau objek");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setError("Gagal memuat data verifikasi. Server mungkin tidak merespon.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const navigate = useNavigate();

  const formatStatus = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return 'Menunggu';
      case 'approved':
        return 'Disetujui';
      case 'rejected':
        return 'Ditolak';
      default:
        return 'Tidak diketahui';
    }
  };

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
            onClick={() => fetchUsers()} 
            className="mt-4 bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <RefreshCcw size={16} />
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Daftar User Meminta Verifikasi</h1>
        <Button 
          onClick={fetchUsers} 
          variant="outline" 
          className="flex items-center gap-2 border-blue-200"
        >
          <RefreshCcw size={16} />
          Refresh Data
        </Button>
      </div>
      
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
                    {formatStatus(user.status)}
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