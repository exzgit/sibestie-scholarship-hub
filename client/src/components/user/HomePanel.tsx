
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, TrendingUp, BookOpen, Star, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Navigate, useNavigate } from "react-router-dom";

interface Scholarship {
  id: number;
  judul: string;
  tipe: string;
  author: string;
  headerImage: string;
  url: string;
  deskripsi: string;
  startDate: string;
  endDate: string;
}

const HomePanel = () => {
  const [rekomendasiBeasiswa, setRekomenBeasiswa] = useState<Scholarship[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8081/api/scholarships");
      const data = await response.json();
      if (response.ok) {
        // Urutkan berdasarkan ID (asumsi ID lebih tinggi = lebih baru) dan ambil 2 teratas
        const sortedData = [...data].sort((a, b) => b.id - a.id);
        setRekomenBeasiswa(sortedData);
        setError("");
      } else {
        setError("Gagal mengambil data beasiswa");
      }
    } catch (err) {
      setError("Tidak dapat terhubung ke server");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  const beasiswaTerbaru = rekomendasiBeasiswa.slice(0, 2);

  const navigate = useNavigate();

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
            <Button onClick={() => navigate('/user/beasiswa') } className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3">
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
        {!loading && beasiswaTerbaru.length > 0 && (
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Star className="text-yellow-500" size={24} />
                <CardTitle className="text-xl">Beasiswa Rekomendasi Untuk Anda</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {beasiswaTerbaru.map((beasiswa) => (
                  <div key={beasiswa.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    {beasiswa.headerImage && (
                      <img
                        src={beasiswa.headerImage}
                        alt={beasiswa.judul}
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-xs">
                          {beasiswa.tipe || 'Beasiswa'}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">{beasiswa.judul}</h3>
                      <p className="text-sm text-gray-600 mb-2">{beasiswa.author}</p>
                      <div className="flex items-center text-xs text-red-600 mb-3">
                        <Calendar size={14} className="mr-1" />
                        Deadline: {beasiswa.endDate}
                      </div>
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setSelectedScholarship(beasiswa)}>
                        Lihat Detail
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Latest News */}
        {/* <Card className="mb-8 shadow-lg">
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
        </Card> */}

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

      {/* Dialog Detail Beasiswa */}
      <Dialog
        open={!!selectedScholarship}
        onOpenChange={(open) => !open && setSelectedScholarship(null)}
      >
        <DialogContent className="w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg">
          {selectedScholarship && (
            <>
              <DialogHeader>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                  {selectedScholarship.judul}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  By {selectedScholarship.author}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Pendaftaran: {selectedScholarship.startDate} - {selectedScholarship.endDate}
                </p>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                {selectedScholarship.headerImage && (
                  <img
                    src={selectedScholarship.headerImage}
                    alt="Header"
                    className="w-full max-h-[300px] object-cover rounded-lg"
                  />
                )}
                <div
                  className="text-sm text-zinc-800 dark:text-zinc-200 prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: selectedScholarship.deskripsi,
                  }}
                />
                {selectedScholarship.url && (
                  <a
                    href={selectedScholarship.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm font-medium text-blue-600 dark:text-blue-400 underline"
                  >
                    Kunjungi Link Beasiswa
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePanel;
