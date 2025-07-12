import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle, 
  TrendingUp, 
  FileText, 
  AlertCircle,
  Calendar,
  Activity
} from "lucide-react";
import axios from "axios";

interface VerificationStats {
  total_users: number;
  verified_users: number;
  pending_users: number;
  rejected_users: number;
}

interface RecentVerification {
  id: number;
  nama_lengkap: string;
  status: string;
  created_at: string;
}

const VerifikatorDashboard = () => {
  const [stats, setStats] = useState<VerificationStats>({
    total_users: 0,
    verified_users: 0,
    pending_users: 0,
    rejected_users: 0
  });
  const [recentVerifications, setRecentVerifications] = useState<RecentVerification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Fetch verification statistics
        const statsResponse = await axios.get("http://localhost:8081/api/verifikasi/stats");
        setStats(statsResponse.data);

        // Fetch recent verifications
        const recentResponse = await axios.get("http://localhost:8081/api/verification-users");
        if (Array.isArray(recentResponse.data)) {
          // Get the 5 most recent verifications
          const recent = recentResponse.data
            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);
          setRecentVerifications(recent);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Gagal memuat data dashboard");
        
        // Set mock data for development
        setStats({
          total_users: 25,
          verified_users: 12,
          pending_users: 8,
          rejected_users: 5
        });
        setRecentVerifications([
          {
            id: 1,
            nama_lengkap: "Ahmad Fadillah",
            status: "pending",
            created_at: "2024-01-15T10:30:00Z"
          },
          {
            id: 2,
            nama_lengkap: "Siti Nurhaliza",
            status: "approved",
            created_at: "2024-01-14T15:45:00Z"
          },
          {
            id: 3,
            nama_lengkap: "Budi Santoso",
            status: "rejected",
            created_at: "2024-01-13T09:20:00Z"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const approvalRate = stats.total_users > 0 ? (stats.verified_users / stats.total_users) * 100 : 0;
  const pendingRate = stats.total_users > 0 ? (stats.pending_users / stats.total_users) * 100 : 0;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Verifikator</h1>
          <p className="text-gray-600 mt-1">Selamat datang! Kelola verifikasi beasiswa dengan mudah.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">
            {new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Verifikasi</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.total_users}</div>
            <p className="text-xs text-gray-500">Semua pengajuan</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Menunggu Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.pending_users}</div>
            <p className="text-xs text-gray-500">Perlu ditinjau</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Diverifikasi</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.verified_users}</div>
            <p className="text-xs text-gray-500">Lolos verifikasi</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ditolak</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.rejected_users}</div>
            <p className="text-xs text-gray-500">Tidak memenuhi syarat</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span>Statistik Verifikasi</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tingkat Persetujuan</span>
                <span className="font-medium">{approvalRate.toFixed(1)}%</span>
              </div>
              <Progress value={approvalRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Menunggu Review</span>
                <span className="font-medium">{pendingRate.toFixed(1)}%</span>
              </div>
              <Progress value={pendingRate} className="h-2" />
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rata-rata waktu review</span>
                <span className="text-sm font-medium text-gray-900">2.5 hari</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span>Aktivitas Terbaru</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVerifications.map((verification) => (
                <div key={verification.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                      {getStatusIcon(verification.status)}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium text-gray-900">{verification.nama_lengkap}</p>
                        {verification.status === 'approved' && (
                          <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{formatDate(verification.created_at)}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(verification.status)}>
                    {verification.status}
                  </Badge>
                </div>
              ))}
              {recentVerifications.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>Tidak ada aktivitas terbaru</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-600 hover:bg-blue-700">
              <Users className="w-6 h-6" />
              <span>Lihat Semua Verifikasi</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-yellow-600 hover:bg-yellow-700">
              <Clock className="w-6 h-6" />
              <span>Review Pending</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-6 h-6" />
              <span>Laporan Verifikasi</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VerifikatorDashboard;
