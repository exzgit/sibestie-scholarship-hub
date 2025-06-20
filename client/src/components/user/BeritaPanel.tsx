
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BeritaPanel = () => {
  const berita = [
    {
      id: 1,
      judul: "Pembukaan Beasiswa LPDP 2024 untuk Program S1",
      tanggal: "15 Januari 2024",
      ringkasan: "Kementerian Keuangan membuka program beasiswa LPDP untuk mahasiswa berprestasi yang ingin melanjutkan studi S1.",
      kategori: "Beasiswa",
      gambar: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      judul: "Tips Sukses Wawancara Beasiswa",
      tanggal: "12 Januari 2024",
      ringkasan: "Panduan lengkap untuk mempersiapkan diri menghadapi tahap wawancara dalam seleksi beasiswa.",
      kategori: "Tips",
      gambar: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      judul: "Beasiswa KIP Kuliah 2024 Sudah Dibuka",
      tanggal: "10 Januari 2024",
      ringkasan: "Program KIP Kuliah kembali dibuka untuk siswa kurang mampu yang memiliki prestasi akademik baik.",
      kategori: "Beasiswa",
      gambar: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=400&h=200&fit=crop"
    },
    {
      id: 4,
      judul: "Cara Menulis Essay Beasiswa yang Menarik",
      tanggal: "8 Januari 2024",
      ringkasan: "Teknik dan strategi menulis essay yang dapat meningkatkan peluang diterima beasiswa impian Anda.",
      kategori: "Tips",
      gambar: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop"
    },
    {
      id: 5,
      judul: "Beasiswa Unggulan Dinas Pendidikan 2024",
      tanggal: "5 Januari 2024",
      ringkasan: "Dinas Pendidikan berbagai daerah mulai membuka program beasiswa unggulan untuk siswa berprestasi.",
      kategori: "Beasiswa",
      gambar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Berita Terbaru</h1>
        <p className="text-gray-600">Informasi terkini seputar dunia beasiswa dan pendidikan</p>
      </div>

      <div className="space-y-6">
        {berita.map((item) => (
          <Card key={item.id} className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img
                  src={item.gambar}
                  alt={item.judul}
                  className="w-full h-48 md:h-full object-cover"
                />
              </div>
              <div className="md:w-2/3">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.kategori === 'Beasiswa' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.kategori}
                    </span>
                    <span className="text-sm text-gray-500">{item.tanggal}</span>
                  </div>
                  <CardTitle className="text-lg">{item.judul}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{item.ringkasan}</p>
                  <Button variant="outline" size="sm">
                    Lihat Selengkapnya
                  </Button>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BeritaPanel;
