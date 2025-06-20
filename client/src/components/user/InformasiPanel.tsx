
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const InformasiPanel = () => {
  const faqData = [
    {
      question: "Apa itu Sibestie?",
      answer: "Sibestie adalah platform digital yang membantu siswa dan mahasiswa untuk mendapatkan informasi beasiswa terlengkap dan terpercaya. Kami menyediakan database beasiswa untuk jenjang D1, D3, dan S1 serta layanan konsultasi gratis."
    },
    {
      question: "Bagaimana cara menggunakan platform Sibestie?",
      answer: "Sangat mudah! Anda tinggal mendaftar akun, lengkapi profil, lalu jelajahi beasiswa yang tersedia. Gunakan filter untuk menemukan beasiswa yang sesuai dengan kriteria Anda, dan ikuti panduan pendaftaran yang kami sediakan."
    },
    {
      question: "Apakah layanan Sibestie gratis?",
      answer: "Ya, semua layanan dasar Sibestie seperti pencarian beasiswa, informasi, dan konsultasi dasar adalah gratis. Kami berkomitmen membantu semua siswa Indonesia tanpa biaya."
    },
    {
      question: "Apa saja jenis beasiswa yang tersedia?",
      answer: "Kami menyediakan informasi beasiswa untuk berbagai jenjang (D1, D3, S1), berbagai bidang studi, dan dari berbagai sumber seperti pemerintah, swasta, dan lembaga internasional."
    },
    {
      question: "Bagaimana cara mendaftar beasiswa?",
      answer: "Setiap beasiswa memiliki prosedur pendaftaran yang berbeda. Kami menyediakan panduan step-by-step untuk setiap beasiswa, termasuk dokumen yang diperlukan dan timeline pendaftaran."
    }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Informasi</h1>
        <p className="text-gray-600">Pelajari lebih lanjut tentang Sibestie dan cara menggunakannya</p>
      </div>

      {/* Tentang Sibestie */}
      <Card className="mb-6 shadow-md">
        <CardHeader>
          <CardTitle>Tentang Sibestie</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 leading-relaxed mb-4">
            Sibestie hadir sebagai solusi untuk memudahkan siswa Indonesia dalam mengakses informasi beasiswa. 
            Kami memahami bahwa proses pencarian dan pendaftaran beasiswa seringkali rumit dan membingungkan.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Dengan Sibestie, Anda dapat:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Mengakses database beasiswa terlengkap dan terpercaya</li>
            <li>Mendapatkan notifikasi beasiswa baru yang sesuai profil Anda</li>
            <li>Berkonsultasi gratis dengan tim ahli kami</li>
            <li>Mengikuti panduan step-by-step untuk setiap beasiswa</li>
            <li>Bergabung dengan komunitas penerima beasiswa</li>
          </ul>
        </CardContent>
      </Card>

      {/* Cara Menggunakan */}
      <Card className="mb-6 shadow-md">
        <CardHeader>
          <CardTitle>Cara Menggunakan Sibestie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h3 className="font-semibold text-gray-800">Daftar Akun</h3>
                <p className="text-gray-600">Buat akun gratis dan lengkapi profil Anda</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h3 className="font-semibold text-gray-800">Cari Beasiswa</h3>
                <p className="text-gray-600">Jelajahi beasiswa yang sesuai dengan kriteria Anda</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h3 className="font-semibold text-gray-800">Ikuti Panduan</h3>
                <p className="text-gray-600">Gunakan panduan kami untuk mendaftar beasiswa</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
              <div>
                <h3 className="font-semibold text-gray-800">Konsultasi</h3>
                <p className="text-gray-600">Dapatkan bantuan dari tim ahli kami</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Pertanyaan yang Sering Diajukan (FAQ)</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default InformasiPanel;
