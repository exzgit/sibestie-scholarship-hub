"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, CheckCircle, X, Clock, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function VerifikasiPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Verification status and feedback
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [verifikatorMessage, setVerifikatorMessage] = useState("");
  const [dataCompletenessRank, setDataCompletenessRank] = useState<number | null>(null);
  const [verifiedAt, setVerifiedAt] = useState("");
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  // Data User
  const [nik, setNik] = useState("");
  const [nisn, setNisn] = useState("");
  const [namaLengkap, setNamaLengkap] = useState(user?.name || "");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [tempatLahir, setTempatLahir] = useState("");
  const [alamat, setAlamat] = useState("");
  const [fotoKtp, setFotoKtp] = useState<File | null>(null);

  // Contact Information
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [email, setEmail] = useState(user?.email || "");

  // Social Media
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [youtube, setYoutube] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [telegram, setTelegram] = useState("");
  const [other, setOther] = useState("");

  // Data Keluarga
  const [namaIbu, setNamaIbu] = useState("");
  const [pekerjaanIbu, setPekerjaanIbu] = useState("");
  const [pendapatanIbu, setPendapatanIbu] = useState(0);
  const [namaAyah, setNamaAyah] = useState("");
  const [pekerjaanAyah, setPekerjaanAyah] = useState("");
  const [pendapatanAyah, setPendapatanAyah] = useState(0);
  const [alamatKeluarga, setAlamatKeluarga] = useState("");
  const [fotoKk, setFotoKk] = useState<File | null>(null);
  const totalPendapatan = pendapatanIbu + pendapatanAyah;
  
  // Data Anak
  const [saudara, setSaudara] = useState<Array<{ nama: string; status: string }>>([]);

  // Data Akademi
  const [asalSekolah, setAsalSekolah] = useState("");
  const [tahunLulus, setTahunLulus] = useState("");
  const [nilaiSemester1, setNilaiSemester1] = useState("");
  const [nilaiSemester2, setNilaiSemester2] = useState("");
  const [fotoIjazah, setFotoIjazah] = useState<File | null>(null);
  const [fotoSkl, setFotoSkl] = useState<File | null>(null);
  const [fotoSertifikat, setFotoSertifikat] = useState<File | null>(null);
  
  // File validation errors
  const [fileErrors, setFileErrors] = useState<{
    fotoKtp?: string;
    fotoKk?: string;
    fotoIjazah?: string;
  }>({});

  // Fetch verification status
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      if (!user?.id) return;
      
      try {
        const response = await axios.get(`http://127.0.0.1:8081/api/verifikasi/status/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setVerificationStatus(response.data.status);
        
        // If verification exists, fetch details for feedback
        if (response.data.status) {
          try {
            const detailResponse = await axios.get(`http://127.0.0.1:8081/api/verifikasi/${response.data.id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            const verificationData = detailResponse.data;
            setVerifikatorMessage(verificationData.verifikator_message || "");
            setDataCompletenessRank(verificationData.data_completeness_rank || null);
            setVerifiedAt(verificationData.verified_at || "");
          } catch (detailError) {
            console.error("Failed to fetch verification details:", detailError);
          }
        }
      } catch (error) {
        console.error("Failed to fetch verification status:", error);
      } finally {
        setIsLoadingStatus(false);
      }
    };

    fetchVerificationStatus();
  }, [user?.id]);

  const addSaudara = () => setSaudara([...saudara, { nama: "", status: "" }]);
  const removeSaudara = (idx: number) => setSaudara(saudara.filter((_, i) => i !== idx));
  const updateSaudara = (idx: number, key: "nama" | "status", value: string) => {
    setSaudara(saudara.map((s, i) => i === idx ? { ...s, [key]: value } : s));
  };

  // Handle file input with validation
  const handleFile = (setter: (f: File | null) => void, fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    // Clear previous error for this field
    setFileErrors(prev => ({
      ...prev,
      [fieldName]: undefined
    }));
    
    // Validate file size (max 2MB)
    if (file && file.size > 2 * 1024 * 1024) {
      setFileErrors(prev => ({
        ...prev,
        [fieldName]: "Ukuran file maksimal 2MB"
      }));
      return;
    }
    
    // Validate file type
    if (file && !file.type.startsWith('image/')) {
      setFileErrors(prev => ({
        ...prev,
        [fieldName]: "File harus berupa gambar"
      }));
      return;
    }
    
    setter(file);
  };

  // Convert file to base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Compress image before converting to base64
      const reader = new FileReader();
      const img = new Image();
      
      reader.onload = (event) => {
        img.onload = () => {
          // Create canvas for image compression
          const canvas = document.createElement('canvas');
          
          // Calculate new dimensions (max width/height 600px - lebih kecil)
          let width = img.width;
          let height = img.height;
          const maxSize = 600;
          
          if (width > height && width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
          
          // Resize image
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get compressed image as base64 with kualitas lebih rendah (0.5 = 50%)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
          resolve(compressedBase64);
        };
        
        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };
        
        img.src = event.target?.result as string;
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsDataURL(file);
    });
  };

  // Validate form data
  const validateForm = () => {
    const errors: string[] = [];
    
    // Required fields validation
    if (!nik) errors.push("NIK wajib diisi");
    else if (nik.length !== 16) errors.push("NIK harus 16 digit");
    
    if (!nisn) errors.push("NISN wajib diisi");
    if (!namaLengkap) errors.push("Nama lengkap wajib diisi");
    if (!tanggalLahir) errors.push("Tanggal lahir wajib diisi");
    if (!tempatLahir) errors.push("Tempat lahir wajib diisi");
    if (!alamat) errors.push("Alamat wajib diisi");
    
    if (!namaIbu) errors.push("Nama ibu wajib diisi");
    if (!pekerjaanIbu) errors.push("Pekerjaan ibu wajib diisi");
    if (!namaAyah) errors.push("Nama ayah wajib diisi");
    if (!pekerjaanAyah) errors.push("Pekerjaan ayah wajib diisi");
    if (!alamatKeluarga) errors.push("Alamat keluarga wajib diisi");
    
    if (!asalSekolah) errors.push("Asal sekolah wajib diisi");
    if (!tahunLulus) errors.push("Tahun lulus wajib diisi");
    if (!nilaiSemester1) errors.push("Nilai semester 1 wajib diisi");
    if (!nilaiSemester2) errors.push("Nilai semester 2 wajib diisi");
    
    // File validation
    const newFileErrors: {[key: string]: string} = {};
    if (!fotoKtp) newFileErrors.fotoKtp = "Foto KTP wajib diunggah";
    if (!fotoKk) newFileErrors.fotoKk = "Foto KK wajib diunggah";
    if (!fotoIjazah) newFileErrors.fotoIjazah = "Foto Ijazah wajib diunggah";
    
    setFileErrors(newFileErrors);
    
    return { isValid: errors.length === 0 && Object.keys(newFileErrors).length === 0, errors };
  };

  // API URL - bisa diganti sesuai kebutuhan
  const API_URL = "http://127.0.0.1:8081"; // atau IP address server
  const BACKUP_API_URL = "http://localhost:8081"; // URL alternatif

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate form
    const { isValid, errors } = validateForm();
    if (!isValid) {
      setError(errors.join(", "));
      return;
    }
    
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Anda harus login terlebih dahulu",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Coba kirim data tanpa gambar terlebih dahulu untuk menguji koneksi
      try {
        // Prepare data payload tanpa gambar (untuk tes koneksi)
        const testPayload = {
          user_id: parseInt(user.id),
          nik,
          nisn,
          nama_lengkap: namaLengkap,
          tanggal_lahir: tanggalLahir,
          tempat_lahir: tempatLahir,
          alamat,
          nama_ibu: namaIbu,
          pekerjaan_ibu: pekerjaanIbu,
          pendapatan_ibu: pendapatanIbu,
          nama_ayah: namaAyah,
          pekerjaan_ayah: pekerjaanAyah,
          pendapatan_ayah: pendapatanAyah,
          alamat_keluarga: alamatKeluarga,
          saudara: JSON.stringify(saudara),
          asal_sekolah: asalSekolah,
          tahun_lulus: tahunLulus,
          nilai_semester_1: nilaiSemester1,
          nilai_semester_2: nilaiSemester2,
          // Placeholder untuk gambar
          foto_ktp: "placeholder",
          foto_kk: "placeholder",
          foto_ijazah: "placeholder",
          foto_skl: "",
          foto_sertifikat: "",
        };
        
        // Cek koneksi dengan mengirim data kecil
        console.log("Menguji koneksi ke server...");
        await axios.post(`${API_URL}/api/verifikasi/test`, testPayload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          timeout: 5000 // 5 detik timeout untuk tes
        });
        
        console.log("Koneksi ke server berhasil, melanjutkan dengan pengiriman data lengkap...");
      } catch (testError: any) {
        console.error("Test connection failed:", testError);
        
        // Jika error karena endpoint test tidak ada, lanjutkan dengan pengiriman normal
        if (testError.response && testError.response.status === 404) {
          console.log("Endpoint test tidak tersedia, lanjutkan dengan pengiriman normal");
        } else {
          // Jika ada error koneksi lain, tampilkan pesan dan hentikan
          if (testError.code === 'ECONNABORTED') {
            setError("Koneksi ke server timeout. Server mungkin sibuk atau tidak tersedia.");
          } else if (testError.code === 'ERR_NETWORK') {
            setError("Tidak dapat terhubung ke server. Pastikan server backend berjalan di port 8081.");
          } else if (testError.response) {
            setError(`Error ${testError.response.status}: ${testError.response.data?.error || 'Terjadi kesalahan pada server'}`);
          } else {
            setError("Gagal terhubung ke server: " + testError.message);
          }
          setIsSubmitting(false);
          return;
        }
      }
      
      // Convert files to base64 strings
      let fotoKtpBase64 = "";
      let fotoKkBase64 = "";
      let fotoIjazahBase64 = "";
      let fotoSklBase64 = "";
      let fotoSertifikatBase64 = "";
      
      try {
        if (fotoKtp) {
          console.log("Memproses foto KTP...");
          fotoKtpBase64 = await fileToBase64(fotoKtp);
        }
        
        if (fotoKk) {
          console.log("Memproses foto KK...");
          fotoKkBase64 = await fileToBase64(fotoKk);
        }
        
        if (fotoIjazah) {
          console.log("Memproses foto Ijazah...");
          fotoIjazahBase64 = await fileToBase64(fotoIjazah);
        }
        
        if (fotoSkl) {
          console.log("Memproses foto SKL...");
          fotoSklBase64 = await fileToBase64(fotoSkl);
        }
        
        if (fotoSertifikat) {
          console.log("Memproses foto Sertifikat...");
          fotoSertifikatBase64 = await fileToBase64(fotoSertifikat);
        }
      } catch (imgError) {
        console.error("Error processing images:", imgError);
        setError("Gagal memproses gambar. Pastikan file gambar valid dan ukurannya tidak terlalu besar.");
        setIsSubmitting(false);
        return;
      }
      
      // Prepare data payload
      const payload = {
        user_id: parseInt(user.id),
        nik,
        nisn,
        nama_lengkap: namaLengkap,
        tanggal_lahir: tanggalLahir,
        tempat_lahir: tempatLahir,
        alamat,
        foto_ktp: fotoKtpBase64,
        nomor_telepon: nomorTelepon,
        email,
        instagram,
        facebook,
        tiktok,
        website,
        linkedin,
        twitter,
        youtube,
        whatsapp,
        telegram,
        other,
        nama_ibu: namaIbu,
        pekerjaan_ibu: pekerjaanIbu,
        pendapatan_ibu: pendapatanIbu,
        nama_ayah: namaAyah,
        pekerjaan_ayah: pekerjaanAyah,
        pendapatan_ayah: pendapatanAyah,
        alamat_keluarga: alamatKeluarga,
        foto_kk: fotoKkBase64,
        saudara: JSON.stringify(saudara),
        asal_sekolah: asalSekolah,
        tahun_lulus: tahunLulus,
        nilai_semester_1: nilaiSemester1,
        nilai_semester_2: nilaiSemester2,
        foto_ijazah: fotoIjazahBase64,
        foto_skl: fotoSklBase64,
        foto_sertifikat: fotoSertifikatBase64,
      };
      
      // Send data to backend
      try {
        console.log("Mengirim data lengkap ke server...");
        const response = await axios.post(`${API_URL}/api/verifikasi`, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          timeout: 30000 // 30 detik timeout
        });
        
        console.log("Data berhasil dikirim:", response.data);
        toast({
          title: "Berhasil",
          description: "Data verifikasi berhasil dikirim dan akan diproses oleh verifikator",
        });
        
        // Reset form fields after successful submission
        setNik("");
        setNisn("");
        setNamaLengkap(user?.name || "");
        setTanggalLahir("");
        setTempatLahir("");
        setAlamat("");
        setFotoKtp(null);
        setNomorTelepon("");
        setEmail(user?.email || "");
        setInstagram("");
        setFacebook("");
        setTiktok("");
        setWebsite("");
        setLinkedin("");
        setTwitter("");
        setYoutube("");
        setWhatsapp("");
        setTelegram("");
        setOther("");
        setNamaIbu("");
        setPekerjaanIbu("");
        setPendapatanIbu(0);
        setNamaAyah("");
        setPekerjaanAyah("");
        setPendapatanAyah(0);
        setAlamatKeluarga("");
        setFotoKk(null);
        setSaudara([]);
        setAsalSekolah("");
        setTahunLulus("");
        setNilaiSemester1("");
        setNilaiSemester2("");
        setFotoIjazah(null);
        setFotoSkl(null);
        setFotoSertifikat(null);
      } catch (apiError: any) {
        console.error("API request failed:", apiError);
        
        // Jika gagal dengan URL utama, coba dengan URL alternatif
        if (apiError.code === 'ERR_NETWORK') {
          try {
            console.log("Mencoba dengan URL alternatif...");
            const response = await axios.post(`${BACKUP_API_URL}/api/verifikasi`, payload, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              timeout: 30000 // 30 detik timeout
            });
            
            console.log("Data berhasil dikirim dengan URL alternatif:", response.data);
            toast({
              title: "Berhasil",
              description: "Data verifikasi berhasil dikirim dan akan diproses oleh verifikator",
            });
            
            // Reset form fields after successful submission
            setNik("");
            setNisn("");
            setNamaLengkap(user?.name || "");
            setTanggalLahir("");
            setTempatLahir("");
            setAlamat("");
            setFotoKtp(null);
            setNomorTelepon("");
            setEmail(user?.email || "");
            setInstagram("");
            setFacebook("");
            setTiktok("");
            setWebsite("");
            setLinkedin("");
            setTwitter("");
            setYoutube("");
            setWhatsapp("");
            setTelegram("");
            setOther("");
            setNamaIbu("");
            setPekerjaanIbu("");
            setPendapatanIbu(0);
            setNamaAyah("");
            setPekerjaanAyah("");
            setPendapatanAyah(0);
            setAlamatKeluarga("");
            setFotoKk(null);
            setSaudara([]);
            setAsalSekolah("");
            setTahunLulus("");
            setNilaiSemester1("");
            setNilaiSemester2("");
            setFotoIjazah(null);
            setFotoSkl(null);
            setFotoSertifikat(null);
            return;
          } catch (backupError: any) {
            console.error("Backup API request failed:", backupError);
            setError("Tidak dapat terhubung ke server pada kedua URL. Pastikan server backend berjalan.");
          }
        }
        
        if (apiError.code === 'ECONNABORTED') {
          setError("Permintaan timeout. Server mungkin sibuk atau data terlalu besar.");
        } else if (apiError.code === 'ERR_NETWORK') {
          setError("Tidak dapat terhubung ke server. Pastikan server backend berjalan di port 8081.");
        } else if (apiError.response) {
          // Server merespons dengan status error
          setError(`Error ${apiError.response.status}: ${apiError.response.data?.error || 'Terjadi kesalahan pada server'}`);
        } else if (apiError.request) {
          // Tidak ada respons dari server
          setError("Tidak ada respons dari server. Pastikan server backend berjalan.");
        } else {
          setError("Gagal mengirim data verifikasi: " + apiError.message);
        }
      }
      
    } catch (error: any) {
      console.error("Error submitting verification data:", error);
      setError(error.message || "Gagal mengirim data verifikasi. Silakan coba lagi.");
      toast({
        title: "Error",
        description: "Gagal mengirim data verifikasi. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="p-6 space-y-6 max-w-2xl mx-auto" onSubmit={handleSubmit}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Verification Status Card */}
      {!isLoadingStatus && (
        <Card className="shadow border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              Status Verifikasi
              {verificationStatus === 'pending' && <Clock className="ml-2 h-5 w-5 text-yellow-500" />}
              {verificationStatus === 'approved' && <CheckCircle className="ml-2 h-5 w-5 text-green-500" />}
              {verificationStatus === 'rejected' && <X className="ml-2 h-5 w-5 text-red-500" />}
              {!verificationStatus && <AlertCircle className="ml-2 h-5 w-5 text-gray-500" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!verificationStatus ? (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-2">Anda belum mengajukan verifikasi</p>
                <p className="text-sm text-gray-500">Silakan isi form di bawah ini untuk mengajukan verifikasi</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      verificationStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {verificationStatus === 'pending' ? 'Menunggu Verifikasi' : 
                     verificationStatus === 'approved' ? 'Terverifikasi' : 'Ditolak'}
                  </span>
                  {verificationStatus === 'approved' && (
                    <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
                  )}
                </div>
                
                {/* Display feedback if available */}
                {verifikatorMessage && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-700 mb-2">Feedback dari Verifikator:</p>
                    <p className="text-sm text-gray-600 mb-3">{verifikatorMessage}</p>
                    
                    {dataCompletenessRank && (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">Rating Kelengkapan Data:</span>
                        <div className="flex items-center">
                          {[...Array(10)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full mr-1 ${
                                i < dataCompletenessRank 
                                  ? 'bg-blue-500' 
                                  : 'bg-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-2">
                            {dataCompletenessRank}/10
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {verifiedAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        Diverifikasi pada: {new Date(verifiedAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                )}
                
                {verificationStatus === 'rejected' && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700">
                      Verifikasi Anda ditolak. Silakan perbaiki data sesuai feedback di atas dan ajukan ulang.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Data User */}
      <Card className="shadow border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl">Data User</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>NIK</Label>
            <Input 
              value={nik} 
              onChange={e => setNik(e.target.value)} 
              placeholder="Nomor Induk Kependudukan" 
              required 
              maxLength={16}
            />
          </div>
          <div>
            <Label>NISN</Label>
            <Input 
              value={nisn} 
              onChange={e => setNisn(e.target.value)} 
              placeholder="Nomor Induk Siswa Nasional" 
              required 
            />
          </div>
          <div>
            <Label>Nama Lengkap</Label>
            <Input 
              value={namaLengkap} 
              onChange={e => setNamaLengkap(e.target.value)} 
              placeholder="Nama sesuai KTP" 
              required 
            />
          </div>
          <div>
            <Label>Tanggal Lahir</Label>
            <Input 
              type="date" 
              value={tanggalLahir} 
              onChange={e => setTanggalLahir(e.target.value)} 
              required 
            />
          </div>
          <div>
            <Label>Tempat Lahir</Label>
            <Input 
              value={tempatLahir} 
              onChange={e => setTempatLahir(e.target.value)} 
              placeholder="Contoh: Bandung" 
              required 
            />
          </div>
          <div className="md:col-span-2">
            <Label>Alamat</Label>
            <Input 
              value={alamat} 
              onChange={e => setAlamat(e.target.value)} 
              placeholder="Alamat sesuai KTP" 
              required 
            />
          </div>
          <div className="md:col-span-2">
            <Label>Foto KTP</Label>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleFile(setFotoKtp, 'fotoKtp')} 
              required 
            />
            {fileErrors.fotoKtp && <p className="text-sm text-red-500 mt-1">{fileErrors.fotoKtp}</p>}
          </div>
          
          {/* Contact Information */}
          <div>
            <Label>Nomor Telepon</Label>
            <Input 
              value={nomorTelepon} 
              onChange={e => setNomorTelepon(e.target.value)} 
              placeholder="+6281234567890" 
              type="tel"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="email@example.com" 
              type="email"
            />
          </div>
          
          {/* Social Media */}
          <div>
            <Label>Instagram</Label>
            <Input 
              value={instagram} 
              onChange={e => setInstagram(e.target.value)} 
              placeholder="@username" 
            />
          </div>
          <div>
            <Label>Facebook</Label>
            <Input 
              value={facebook} 
              onChange={e => setFacebook(e.target.value)} 
              placeholder="Nama Facebook" 
            />
          </div>
          <div>
            <Label>TikTok</Label>
            <Input 
              value={tiktok} 
              onChange={e => setTiktok(e.target.value)} 
              placeholder="@username" 
            />
          </div>
          <div>
            <Label>Website</Label>
            <Input 
              value={website} 
              onChange={e => setWebsite(e.target.value)} 
              placeholder="https://example.com" 
            />
          </div>
          <div>
            <Label>LinkedIn</Label>
            <Input 
              value={linkedin} 
              onChange={e => setLinkedin(e.target.value)} 
              placeholder="username" 
            />
          </div>
          <div>
            <Label>Twitter</Label>
            <Input 
              value={twitter} 
              onChange={e => setTwitter(e.target.value)} 
              placeholder="@username" 
            />
          </div>
          <div>
            <Label>YouTube</Label>
            <Input 
              value={youtube} 
              onChange={e => setYoutube(e.target.value)} 
              placeholder="Channel name" 
            />
          </div>
          <div>
            <Label>WhatsApp</Label>
            <Input 
              value={whatsapp} 
              onChange={e => setWhatsapp(e.target.value)} 
              placeholder="+6281234567890" 
              type="tel"
            />
          </div>
          <div>
            <Label>Telegram</Label>
            <Input 
              value={telegram} 
              onChange={e => setTelegram(e.target.value)} 
              placeholder="@username" 
            />
          </div>
          <div className="md:col-span-2">
            <Label>Kontak Lainnya</Label>
            <Input 
              value={other} 
              onChange={e => setOther(e.target.value)} 
              placeholder="Informasi kontak tambahan" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Keluarga */}
      <Card className="shadow border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl">Data Keluarga</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nama Ibu</Label>
            <Input 
              value={namaIbu} 
              onChange={e => setNamaIbu(e.target.value)} 
              required 
            />
          </div>
          <div>
            <Label>Pekerjaan Ibu</Label>
            <Input 
              value={pekerjaanIbu} 
              onChange={e => setPekerjaanIbu(e.target.value)} 
              required 
            />
          </div>
          <div>
            <Label>Pendapatan Ibu</Label>
            <Input 
              type="number" 
              value={pendapatanIbu} 
              onChange={e => setPendapatanIbu(Number(e.target.value))} 
              required 
              min={0}
            />
          </div>
          <div>
            <Label>Nama Ayah</Label>
            <Input 
              value={namaAyah} 
              onChange={e => setNamaAyah(e.target.value)} 
              required 
            />
          </div>
          <div>
            <Label>Pekerjaan Ayah</Label>
            <Input 
              value={pekerjaanAyah} 
              onChange={e => setPekerjaanAyah(e.target.value)} 
              required 
            />
          </div>
          <div>
            <Label>Pendapatan Ayah</Label>
            <Input 
              type="number" 
              value={pendapatanAyah} 
              onChange={e => setPendapatanAyah(Number(e.target.value))} 
              required 
              min={0}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Total Pendapatan</Label>
            <Input 
              value={totalPendapatan} 
              readOnly 
              className="bg-zinc-100 font-bold" 
            />
          </div>
          <div className="md:col-span-2">
            <Label>Alamat Keluarga</Label>
            <Input 
              value={alamatKeluarga} 
              onChange={e => setAlamatKeluarga(e.target.value)} 
              required 
            />
          </div>
          <div className="md:col-span-2">
            <Label>Foto KK</Label>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleFile(setFotoKk, 'fotoKk')} 
              required 
            />
            {fileErrors.fotoKk && <p className="text-sm text-red-500 mt-1">{fileErrors.fotoKk}</p>}
          </div>
          {/* Data Saudara */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <Label>Data Anak</Label>
              <Button type="button" onClick={addSaudara} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs"><Plus size={26}/></Button>
            </div>
            <div className="space-y-2">
              {saudara.map((s, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    className="flex-1"
                    placeholder="Nama"
                    value={s.nama}
                    onChange={e => updateSaudara(idx, "nama", e.target.value)}
                  />
                  <Input
                    className="flex-1"
                    placeholder="Status (Pelajar/Bekerja/dll)"
                    value={s.status}
                    onChange={e => updateSaudara(idx, "status", e.target.value)}
                  />
                  {saudara.length > 0 && (
                    <Button type="button" variant="destructive" className="px-2 py-1" onClick={() => removeSaudara(idx)}>
                      Hapus
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Akademi */}
      <Card className="shadow border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl">Data Akademi</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Asal Sekolah</Label>
            <Input 
              value={asalSekolah} 
              onChange={e => setAsalSekolah(e.target.value)} 
              required 
            />
          </div>
          <div>
            <Label>Tahun Lulus</Label>
            <Input 
              value={tahunLulus} 
              onChange={e => setTahunLulus(e.target.value)} 
              required 
            />
          </div>
          <div>
            <Label>Nilai Semester 1</Label>
            <Input 
              value={nilaiSemester1} 
              onChange={e => setNilaiSemester1(e.target.value)} 
              required 
            />
          </div>
          <div>
            <Label>Nilai Semester 2</Label>
            <Input 
              value={nilaiSemester2} 
              onChange={e => setNilaiSemester2(e.target.value)} 
              required 
            />
          </div>
          <div className="md:col-span-2">
            <Label>Foto Ijazah</Label>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleFile(setFotoIjazah, 'fotoIjazah')} 
              required 
            />
            {fileErrors.fotoIjazah && <p className="text-sm text-red-500 mt-1">{fileErrors.fotoIjazah}</p>}
          </div>
          <div className="md:col-span-2">
            <Label>Foto SKL (Opsional jika tidak ada ijazah)</Label>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleFile(setFotoSkl, 'fotoSkl')} 
            />
          </div>
          <div className="md:col-span-2">
            <Label>Foto Sertifikat (Opsional)</Label>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleFile(setFotoSertifikat, 'fotoSertifikat')} 
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        {verificationStatus === 'approved' ? (
          <div className="flex items-center text-green-600 font-medium">
            <CheckCircle className="mr-2 h-5 w-5" />
            Verifikasi Selesai - Data Anda telah diverifikasi
          </div>
        ) : (
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSubmitting || verificationStatus === 'pending'}
          >
            {isSubmitting ? "Mengirim..." : 
             verificationStatus === 'pending' ? "Menunggu Verifikasi" :
             verificationStatus === 'rejected' ? "Ajukan Ulang" : "Simpan Data"}
          </Button>
        )}
      </div>
    </form>
  );
}