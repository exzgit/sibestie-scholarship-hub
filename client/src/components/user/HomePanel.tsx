
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, TrendingUp, BookOpen, Star, Calendar } from "lucide-react";

const HomePanel = () => {
  const rekomendasiBeasiswa = [
    {
      id: 1,
      judul: "Beasiswa KIP Kuliah 2024",
      provider: "Kemendikbud",
      deadline: "15 April 2024",
      jenjang: "S1",
      coverageAmount: "100%",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      judul: "Beasiswa Djarum Plus",
      provider: "Djarum Foundation",
      deadline: "28 Maret 2024",
      jenjang: "D3-S1",
      coverageAmount: "Parsial",
      image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=400&h=200&fit=crop"
    }
  ];

  const beritaTerbaru = [
    {
      id: 1,
      judul: "Tips Lolos Seleksi Beasiswa LPDP 2024",
      tanggal: "2 hari yang lalu",
      kategori: "Tips",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=150&fit=crop"
    },
    {
      id: 2,
      judul: "Pembukaan 50 Beasiswa Baru Bulan Ini",
      tanggal: "1 minggu yang lalu",
      kategori: "Info",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=150&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header Banner */}
      <div className="relative h-72 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop"
          alt="Students graduation"
          className="w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h1 className="text-4xl font-bold mb-4">Sibestie</h1>
            <p className="text-xl opacity-90 mb-6">Gerbang Mudah Menuju Pendidikan Tinggi!</p>
            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3">
              Mulai Pencarian Beasiswa
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {/* Welcome Section */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop"
                alt="Student with laptop"
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Selamat Datang di Sibestie!</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Platform terpercaya yang membantu siswa dan mahasiswa mendapatkan beasiswa untuk jenjang D1, D3, dan S1. 
                  Temukan beasiswa yang sesuai dengan profil dan kebutuhan Anda.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-3xl font-bold text-blue-600 mb-1">500+</div>
                <div className="text-sm text-gray-600 font-medium">Beasiswa Tersedia</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="text-3xl font-bold text-green-600 mb-1">10K+</div>
                <div className="text-sm text-gray-600 font-medium">Siswa Terbantu</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="text-3xl font-bold text-purple-600 mb-1">95%</div>
                <div className="text-sm text-gray-600 font-medium">Tingkat Keberhasilan</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Scholarships */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Star className="text-yellow-500" size={24} />
              <CardTitle className="text-xl">Beasiswa Rekomendasi Untuk Anda</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rekomendasiBeasiswa.map((beasiswa) => (
                <div key={beasiswa.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <img
                    src={beasiswa.image}
                    alt={beasiswa.judul}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-xs">
                        {beasiswa.jenjang}
                      </Badge>
                      <span className="text-xs text-green-600 font-medium">
                        {beasiswa.coverageAmount}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">{beasiswa.judul}</h3>
                    <p className="text-sm text-gray-600 mb-2">{beasiswa.provider}</p>
                    <div className="flex items-center text-xs text-red-600 mb-3">
                      <Calendar size={14} className="mr-1" />
                      Deadline: {beasiswa.deadline}
                    </div>
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                      Lihat Detail
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Latest News */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-blue-500" size={24} />
              <CardTitle className="text-xl">Berita & Tips Terbaru</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {beritaTerbaru.map((berita) => (
                <div key={berita.id} className="flex space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <img
                    src={berita.image}
                    alt={berita.judul}
                    className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {berita.kategori}
                      </Badge>
                      <span className="text-xs text-gray-500">{berita.tanggal}</span>
                    </div>
                    <h3 className="font-medium text-gray-800 mb-2">{berita.judul}</h3>
                    <Button variant="outline" size="sm" className="text-xs">
                      Baca Selengkapnya
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Cari Beasiswa</h3>
              <p className="text-xs text-gray-600">Temukan beasiswa sesuai kriteria</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                <Users className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Konsultasi</h3>
              <p className="text-xs text-gray-600">Dapatkan bantuan gratis</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                <Clock className="text-purple-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Deadline</h3>
              <p className="text-xs text-gray-600">Pantau jadwal penting</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-yellow-200 transition-colors">
                <Star className="text-yellow-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Favorit</h3>
              <p className="text-xs text-gray-600">Beasiswa yang disimpan</p>
            </CardContent>
          </Card>
        </div>

        {/* Educational Tips */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Tips Sukses Mendapatkan Beasiswa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Persiapkan Dokumen Lengkap</h3>
                    <p className="text-sm text-gray-600">Pastikan semua dokumen yang dibutuhkan sudah siap dan sesuai ketentuan.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Tulis Essay yang Menarik</h3>
                    <p className="text-sm text-gray-600">Ceritakan motivasi dan tujuan Anda dengan jelas dan meyakinkan.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Perhatikan Deadline</h3>
                    <p className="text-sm text-gray-600">Jangan sampai terlewat batas waktu pendaftaran beasiswa.</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=250&fit=crop"
                  alt="Students studying"
                  className="rounded-lg shadow-md max-w-full h-auto"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePanel;
