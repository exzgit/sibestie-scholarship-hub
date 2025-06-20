
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const KonsultasiPanel = () => {
  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Konsultasi</h1>
        <p className="text-sm md:text-base text-gray-600">Hubungi tim ahli kami untuk mendapatkan bantuan</p>
      </div>

      {/* Contact Information */}
      <Card className="mb-4 md:mb-6 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg md:text-xl">Informasi Kontak</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* WhatsApp */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 md:p-4 bg-green-50 rounded-lg">
            <div className="text-green-600 text-2xl md:text-3xl flex-shrink-0">💬</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">WhatsApp</h3>
              <p className="text-gray-600 text-sm md:text-base break-all">+62 812-3456-7890</p>
              <p className="text-xs md:text-sm text-gray-500">Respon cepat dan mudah</p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-sm w-full sm:w-auto">
              Hubungi Sekarang
            </Button>
          </div>

          {/* Email */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 md:p-4 bg-blue-50 rounded-lg">
            <div className="text-blue-600 text-2xl md:text-3xl flex-shrink-0">📧</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">Email</h3>
              <p className="text-gray-600 text-sm md:text-base break-all">konsultasi@sibestie.com</p>
              <p className="text-xs md:text-sm text-gray-500">Untuk konsultasi detail</p>
            </div>
            <Button variant="outline" className="text-sm w-full sm:w-auto">
              Kirim Email
            </Button>
          </div>

          {/* Live Chat */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 md:p-4 bg-purple-50 rounded-lg">
            <div className="text-purple-600 text-2xl md:text-3xl flex-shrink-0">💬</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">Live Chat</h3>
              <p className="text-gray-600 text-sm md:text-base">Chat langsung di website</p>
              <p className="text-xs md:text-sm text-gray-500">Tersedia 24/7</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-sm w-full sm:w-auto">
              Mulai Chat
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Operating Hours */}
      <Card className="mb-4 md:mb-6 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg md:text-xl">Jam Operasional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700 text-sm md:text-base">Senin - Jumat</span>
              <span className="text-gray-600 text-sm md:text-base">08:00 - 17:00 WIB</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700 text-sm md:text-base">Sabtu</span>
              <span className="text-gray-600 text-sm md:text-base">08:00 - 15:00 WIB</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-700 text-sm md:text-base">Minggu</span>
              <span className="text-gray-600 text-sm md:text-base">Tutup</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Quick Access */}
      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg md:text-xl">Pertanyaan Umum</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">Bagaimana cara mendaftar beasiswa?</h4>
              <p className="text-xs md:text-sm text-gray-600">Lihat panduan lengkap di panel Informasi</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">Dokumen apa saja yang diperlukan?</h4>
              <p className="text-xs md:text-sm text-gray-600">Setiap beasiswa memiliki persyaratan yang berbeda</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">Kapan pengumuman hasil seleksi?</h4>
              <p className="text-xs md:text-sm text-gray-600">Timeline bervariasi untuk setiap program beasiswa</p>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4 text-sm md:text-base">
            Lihat FAQ Lengkap
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default KonsultasiPanel;
