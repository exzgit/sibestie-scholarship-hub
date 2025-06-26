import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

const ProfilePanel = () => {
  const { user, logout, checkVerificationStatus } = useAuth();
  const navigate = useNavigate();

  // Use data from user context (from KTP registration)
  const userData = {
    foto: "",
    name: user?.name || 'user.example',
    email: user?.email || 'user@example.com',
  };

  // Check verification status on component mount
  useEffect(() => {
    if (user && user.role === 'user') {
      checkVerificationStatus();
    }
  }, []);

  const handleVerificationClick = () => {
    navigate('/user/verifikasi');
  };

  // Function to get verification status display text
  const getVerificationStatusText = () => {
    if (user?.isVerified) {
      return 'Akun Anda sudah terverifikasi';
    }
    
    switch (user?.verificationStatus) {
      case 'pending':
        return 'Menunggu proses verifikasi';
      case 'rejected':
        return 'Verifikasi ditolak';
      default:
        return 'Akun belum terverifikasi';
    }
  };

  // Function to get verification status color
  const getVerificationStatusColor = () => {
    if (user?.isVerified) {
      return 'bg-green-500';
    }
    
    switch (user?.verificationStatus) {
      case 'pending':
        return 'bg-yellow-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Function to determine if verification button should be shown
  const shouldShowVerificationButton = () => {
    if (user?.isVerified) {
      return false; // Already verified
    }
    
    return user?.verificationStatus !== 'pending'; // Show button if not pending
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Profile</h1>
        <p className="text-gray-600">Kelola informasi akun Anda</p>
      </div>

      {/* Verification Status */}
      {user?.verificationStatus !== 'verified' && (
        <Card className="mb-6 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${getVerificationStatusColor()}`}></div>
                <div className="flex items-center">
                  <h3 className="font-semibold">Status Verifikasi</h3>
                </div>
                <p className="text-sm text-gray-600">
                  {getVerificationStatusText()}
                </p>
              </div>
              {shouldShowVerificationButton() && (
                <Button onClick={handleVerificationClick} className={`bg-blue-600 hover:bg-blue-700 ${user?.verificationStatus === 'rejected' ? 'hidden' : null}`}>
                  {user?.verificationStatus === 'rejected' ? 'Ajukan Verifikasi Ulang' : 'Verifikasi Akun'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Picture and Basic Info */}
      <Card className="mb-6 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={userData.foto} alt={userData.name} />
              <AvatarFallback className="text-xl">
                {userData.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center justify-center">
              {userData.name}
              {user?.verificationStatus === 'verified' && (
                <CheckCircle className="ml-2 h-6 w-6 text-green-500" />
              )}
            </h2>
            <p className="text-gray-600 mb-4">{userData.email}</p>
            {/* <Button variant="outline" size="sm">
              Ubah Foto Profile
            </Button> */}
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      {/* <Card className="mb-6 shadow-md">
        <CardHeader>
          <CardTitle>Informasi Personal (Data KTP)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">NIK</label>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-800">{userData.nik || 'Belum diisi'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">NISN</label>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-800">{userData.nisn || 'Belum diisi'}</div>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Nama Lengkap (sesuai KTP)</label>
            <div className="p-3 bg-gray-50 rounded-lg text-gray-800">{userData.namaLengkap || 'Belum diisi'}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Nomor Telepon</label>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-800">{userData.nomorTelepon || 'Belum diisi'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-800">{userData.email}</div>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Alamat (sesuai KTP)</label>
            <div className="p-3 bg-gray-50 rounded-lg text-gray-800">{userData.alamat || 'Belum diisi'}</div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Pendidikan Terakhir</label>
            <div className="p-3 bg-gray-50 rounded-lg text-gray-800">{userData.pendidikanTerakhir || 'Belum diisi'}</div>
          </div>
        </CardContent>
      </Card> */}

      {/* Action Buttons */}
      {/* <div className="space-y-3">
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Edit Profile
        </Button>
        <Button variant="outline" className="w-full">
          Ubah Password
        </Button>
        <Button 
          variant="outline" 
          className="w-full border-red-200 text-red-600 hover:bg-red-50"
          onClick={() => {logout(); navigate('/auth/login')}}
        >
          Logout
        </Button>
      </div> */}

      {/* Account Stats */}
      {/* <Card className="mt-6 shadow-md">
        <CardHeader>
          <CardTitle>Statistik Akun</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Beasiswa Disimpan</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">5</div>
              <div className="text-sm text-gray-600">Aplikasi Dikirim</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">2</div>
              <div className="text-sm text-gray-600">Dalam Proses</div>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default ProfilePanel;
