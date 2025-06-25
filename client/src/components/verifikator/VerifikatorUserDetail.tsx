import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, X, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

interface VerificationData {
  id: number;
  user_id: number;
  nama_lengkap: string;
  nik: string;
  nisn: string;
  tanggal_lahir: string;
  tempat_lahir: string;
  alamat: string;
  foto_ktp: string;
  nomor_telepon: string;
  email: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  website: string;
  linkedin: string;
  twitter: string;
  youtube: string;
  whatsapp: string;
  telegram: string;
  other: string;
  nama_ibu: string;
  pekerjaan_ibu: string;
  pendapatan_ibu: number;
  nama_ayah: string;
  pekerjaan_ayah: string;
  pendapatan_ayah: number;
  alamat_keluarga: string;
  foto_kk: string;
  saudara: string;
  asal_sekolah: string;
  tahun_lulus: string;
  nilai_semester_1: string;
  nilai_semester_2: string;
  foto_ijazah: string;
  foto_skl: string;
  foto_sertifikat: string;
  status: "pending" | "approved" | "rejected";
  verifikator_message?: string;
  data_completeness_rank?: number;
  verifikator_id?: number;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

const VerifikatorUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<VerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [saudara, setSaudara] = useState<Array<{ nama: string; status: string }>>([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [dataCompletenessRank, setDataCompletenessRank] = useState(5);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8081/api/verifikasi/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setUserData(response.data);
        
        if (response.data.saudara) {
          try {
            const parsedSaudara = JSON.parse(response.data.saudara);
            setSaudara(parsedSaudara);
          } catch (e) {
            console.error("Failed to parse saudara data:", e);
            setSaudara([]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user verification data:", err);
        setError("Gagal memuat data verifikasi pengguna");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleApprove = async () => {
    if (!userData || !feedbackMessage.trim()) {
      setError("Pesan feedback wajib diisi");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await axios.post(`http://127.0.0.1:8081/api/verifikasi/${id}/approve`, {
        message: feedbackMessage,
        data_completeness_rank: dataCompletenessRank
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setUserData({
        ...userData,
        status: "approved",
        verifikator_message: feedbackMessage,
        data_completeness_rank: dataCompletenessRank,
        verified_at: new Date().toISOString()
      });
      
      setError("");
      setShowFeedbackForm(false);
      setFeedbackMessage("");
      setDataCompletenessRank(5);
    } catch (err) {
      console.error("Failed to approve verification:", err);
      setError("Gagal menyetujui verifikasi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!userData || !feedbackMessage.trim()) {
      setError("Pesan feedback wajib diisi");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await axios.post(`http://127.0.0.1:8081/api/verifikasi/${id}/reject`, {
        message: feedbackMessage,
        data_completeness_rank: dataCompletenessRank
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setUserData({
        ...userData,
        status: "rejected",
        verifikator_message: feedbackMessage,
        data_completeness_rank: dataCompletenessRank,
        verified_at: new Date().toISOString()
      });
      
      setError("");
      setShowFeedbackForm(false);
      setFeedbackMessage("");
      setDataCompletenessRank(5);
    } catch (err) {
      console.error("Failed to reject verification:", err);
      setError("Gagal menolak verifikasi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Data verifikasi tidak ditemukan</AlertDescription>
        </Alert>
        <Button onClick={() => navigate(-1)} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-700">Detail Verifikasi User</h1>
            {userData.status === 'approved' && (
              <CheckCircle className="ml-3 h-6 w-6 text-green-500" />
            )}
          </div>
          <p className="text-gray-500">ID Verifikasi: {userData.id}</p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
      </div>
      
      {/* Status Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Status Verifikasi</p>
              <div className="flex items-center mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${userData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    userData.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {userData.status === 'pending' ? 'Menunggu Verifikasi' : 
                   userData.status === 'approved' ? 'Terverifikasi' : 'Ditolak'}
                </span>
              </div>
              
              {userData.verifikator_message && (
                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Feedback Verifikator</h3>
                  <p className="text-blue-800 mb-3">{userData.verifikator_message}</p>
                  {userData.data_completeness_rank && (
                    <div className="flex items-center mb-3">
                      <span className="text-sm text-blue-700 mr-2">Rating Kelengkapan Data:</span>
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full mx-1 ${
                              i < userData.data_completeness_rank ? 'bg-blue-500' : 'bg-blue-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium text-blue-700">
                        {userData.data_completeness_rank}/10
                      </span>
                    </div>
                  )}
                  {userData.verified_at && (
                    <p className="text-xs text-blue-600">
                      Diverifikasi pada: {new Date(userData.verified_at).toLocaleString('id-ID')}
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              {userData.status === 'pending' && (
                <>
                  <Button 
                    onClick={() => setShowFeedbackForm(true)} 
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Verifikasi
                  </Button>
                  <Button 
                    onClick={() => setShowFeedbackForm(true)} 
                    disabled={isSubmitting}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <X className="mr-2 h-4 w-4" /> Tolak
                  </Button>
                </>
              )}
              {userData.status === 'approved' && (
                <span className="text-sm text-green-600 font-medium flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verifikasi Selesai
                </span>
              )}
              {userData.status === 'rejected' && (
                <span className="text-sm text-red-600 font-medium flex items-center">
                  <X className="mr-2 h-4 w-4" />
                  Verifikasi Ditolak
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Feedback Form Modal */}
      {showFeedbackForm && userData.status === 'pending' && (
        <Card className="mb-6 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Feedback Verifikator</CardTitle>
            <CardDescription>
              Berikan pesan dan rating kelengkapan data untuk user ini
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="feedback-message">Pesan Feedback *</Label>
              <Textarea
                id="feedback-message"
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Berikan feedback detail tentang verifikasi ini..."
                className="mt-1"
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="data-rank">Rating Kelengkapan Data *</Label>
              <div className="flex items-center mt-2 space-x-4">
                <Slider
                  value={[dataCompletenessRank]}
                  onValueChange={(value) => setDataCompletenessRank(value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm font-medium min-w-[3rem]">
                  {dataCompletenessRank}/10
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Sangat Kurang</span>
                <span>Sangat Lengkap</span>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleApprove} 
                disabled={isSubmitting || !feedbackMessage.trim()}
                className="bg-green-600 hover:bg-green-700 text-white flex-1"
              >
                <CheckCircle className="mr-2 h-4 w-4" /> 
                {isSubmitting ? 'Memproses...' : 'Setujui & Kirim Feedback'}
              </Button>
              <Button 
                onClick={handleReject} 
                disabled={isSubmitting || !feedbackMessage.trim()}
                className="bg-red-600 hover:bg-red-700 text-white flex-1"
              >
                <X className="mr-2 h-4 w-4" /> 
                {isSubmitting ? 'Memproses...' : 'Tolak & Kirim Feedback'}
              </Button>
              <Button 
                onClick={() => {
                  setShowFeedbackForm(false);
                  setFeedbackMessage("");
                  setDataCompletenessRank(5);
                }}
                variant="outline"
              >
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Tabs for different data categories */}
      <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="personal">Data Pribadi</TabsTrigger>
          <TabsTrigger value="family">Data Keluarga</TabsTrigger>
          <TabsTrigger value="academic">Data Akademik</TabsTrigger>
        </TabsList>
        
        {/* Personal Data Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Data Pribadi</CardTitle>
              <CardDescription>Informasi pribadi yang disubmit oleh user</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nama Lengkap</p>
                  <p className="text-base">{userData.nama_lengkap}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">NIK</p>
                  <p className="text-base">{userData.nik}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">NISN</p>
                  <p className="text-base">{userData.nisn}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tanggal Lahir</p>
                  <p className="text-base">{formatDate(userData.tanggal_lahir)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tempat Lahir</p>
                  <p className="text-base">{userData.tempat_lahir}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Alamat</p>
                  <p className="text-base">{userData.alamat}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Nomor Telepon</p>
                  <p className="text-base">{userData.nomor_telepon}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-base">{userData.email}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Foto KTP</p>
                {userData.foto_ktp ? (
                  <div className="border rounded-md p-2 bg-gray-50">
                    <img 
                      src={userData.foto_ktp.startsWith('data:') ? userData.foto_ktp : `data:image/jpeg;base64,${userData.foto_ktp}`} 
                      alt="KTP" 
                      className="max-h-60 mx-auto"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Tidak ada foto KTP</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Family Data Tab */}
        <TabsContent value="family">
          <Card>
            <CardHeader>
              <CardTitle>Data Keluarga</CardTitle>
              <CardDescription>Informasi keluarga dan ekonomi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nama Ibu</p>
                  <p className="text-base">{userData.nama_ibu}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Pekerjaan Ibu</p>
                  <p className="text-base">{userData.pekerjaan_ibu}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Pendapatan Ibu</p>
                  <p className="text-base">{formatCurrency(userData.pendapatan_ibu)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Nama Ayah</p>
                  <p className="text-base">{userData.nama_ayah}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Pekerjaan Ayah</p>
                  <p className="text-base">{userData.pekerjaan_ayah}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Pendapatan Ayah</p>
                  <p className="text-base">{formatCurrency(userData.pendapatan_ayah)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Total Pendapatan</p>
                  <p className="text-base font-semibold text-green-600">
                    {formatCurrency(userData.pendapatan_ibu + userData.pendapatan_ayah)}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Alamat Keluarga</p>
                  <p className="text-base">{userData.alamat_keluarga}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Foto KK</p>
                {userData.foto_kk ? (
                  <div className="border rounded-md p-2 bg-gray-50">
                    <img 
                      src={userData.foto_kk.startsWith('data:') ? userData.foto_kk : `data:image/jpeg;base64,${userData.foto_kk}`} 
                      alt="KK" 
                      className="max-h-60 mx-auto"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Tidak ada foto KK</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Academic Data Tab */}
        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle>Data Akademik</CardTitle>
              <CardDescription>Informasi pendidikan dan prestasi akademik</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Asal Sekolah</p>
                  <p className="text-base">{userData.asal_sekolah}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tahun Lulus</p>
                  <p className="text-base">{userData.tahun_lulus}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Nilai Semester 1</p>
                  <p className="text-base">{userData.nilai_semester_1}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Nilai Semester 2</p>
                  <p className="text-base">{userData.nilai_semester_2}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Foto Ijazah</p>
                {userData.foto_ijazah ? (
                  <div className="border rounded-md p-2 bg-gray-50">
                    <img 
                      src={userData.foto_ijazah.startsWith('data:') ? userData.foto_ijazah : `data:image/jpeg;base64,${userData.foto_ijazah}`} 
                      alt="Ijazah" 
                      className="max-h-60 mx-auto"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Tidak ada foto Ijazah</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VerifikatorUserDetail; 