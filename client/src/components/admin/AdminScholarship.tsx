'use client'

import { useEffect, useState } from "react"
import { School, PlusCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RichTextEditor } from "../ui/RichText"

export const AdminScholarship = () => {
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [warning, setWarning] = useState('')
  const [loading, setLoading] = useState(true)

  const [scholarships, setScholarships] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedScholarship, setSelectedScholarship] = useState(null)

  const [newScholarship, setNewScholarship] = useState({
    title: '', author: '', url: '', description: '', image: '', startDate: '', endDate: '', type: 'internal'
  })

  const fetchScholarships = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://127.0.0.1:8081/api/scholarships", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      const data = await response.json()
      if (response.ok) {
        setScholarships(data)
        setError('')
      } else {
        setError("Gagal mengambil data beasiswa")
      }
    } catch (err) {
      setError("Tidak dapat terhubung ke server")
    }
    setLoading(false)
  }

  const handleAddScholarship = async () => {
    const { title, author, url, description, image, startDate, endDate, type } = newScholarship

    if (!title || !author || !description.trim() || !startDate || !endDate) {
      setError("Isi semua form terlebih dahulu.")
      return
    }

    if (type === "external" && !url) {
      setError("Pihak external wajib memberikan url ke sumber beasiswa.")
      return
    }

    try {
      const response = await fetch("http://127.0.0.1:8081/api/scholarships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul: title,
          tipe: type,
          headerImage: image,
          url,
          deskripsi: description,
          startDate,
          endDate,
        }),
      })

      const clone = response.clone()
      let data
      try {
        data = await response.json()
      } catch {
        const raw = await clone.text()
        setError("Respon server tidak valid:\n" + raw)
        return
      }

      if (response.ok) {
        setNewScholarship({ title: '', author: '', url: '', description: '', image: '', startDate: '', endDate: '', type: 'internal' })
        setMessage("Beasiswa berhasil ditambahkan")
        setOpenDialog(false)
        await fetchScholarships()
      } else {
        setError(data.error || "Gagal menambahkan beasiswa")
      }
    } catch (err) {
      setError("Network error: " + err.message)
    }
  }
  
  useEffect(() => {
    fetchScholarships()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 p-4">
      <div className="flex items-center justify-between mb-8 border-b border-blue-500 pb-2">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-blue-600 dark:text-blue-400 font-serif">
          <div className="bg-blue-600 p-2 rounded-lg">
            <School className="text-white w-6 h-6" />
          </div>
          Scholarship
          {error}
        </h1>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <PlusCircle size={18} /> Tambah Beasiswa
            </Button>
          </DialogTrigger>

          <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <h2 className="text-xl font-semibold">Tambah Beasiswa</h2>
            </DialogHeader>

            {error && <p className="text-red-600 bg-red-100 p-2 rounded-md border border-red-300">{error}</p>}
            {warning && <p className="text-yellow-700 bg-yellow-100 p-2 rounded-md border border-yellow-300">{warning}</p>}
            {message && <p className="text-green-700 bg-green-100 p-2 rounded-md border border-green-300">{message}</p>}

            <div className="grid gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['title', 'author', 'url', 'image', 'startDate', 'endDate'].map((field) => (
                  <div key={field}>
                    <Label htmlFor={field}>{field === 'startDate' ? 'Tanggal Mulai' : field === 'endDate' ? 'Tanggal Berakhir' : field[0].toUpperCase() + field.slice(1)}</Label>
                    <Input
                      type={field.includes('Date') ? 'date' : 'text'}
                      id={field}
                      value={newScholarship[field]}
                      onChange={(e) => setNewScholarship({ ...newScholarship, [field]: e.target.value })}
                    />
                  </div>
                ))}
              </div>

              <div>
                <Label className="mb-1 block">Tipe Beasiswa</Label>
                <div className="flex gap-6 mt-1">
                  {['internal', 'external'].map((type) => (
                    <label key={type} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="type"
                        value={type}
                        checked={newScholarship.type === type}
                        onChange={(e) => setNewScholarship({ ...newScholarship, type: e.target.value })}
                        className="accent-blue-600"
                      />
                      {type[0].toUpperCase() + type.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Deskripsi / Detail</Label>
                <RichTextEditor
                  content={newScholarship.description}
                  onChange={(html) => setNewScholarship({ ...newScholarship, description: html })}
                />
              </div>

              <Button onClick={handleAddScholarship} className="bg-blue-600 hover:bg-blue-700 text-white self-end">
                Simpan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* List Beasiswa */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-center text-zinc-500 dark:text-zinc-400 text-sm italic">Memuat data beasiswa...</p>
        ) : scholarships.length > 0 ? (
          scholarships.map((scholarship) => (
            <Card key={scholarship.id} className="bg-white dark:bg-zinc-900 shadow-lg rounded-xl overflow-hidden">
              {scholarship.headerImage && (
                <img src={scholarship.headerImage} alt="Gambar Beasiswa" className="w-full h-40 object-cover" />
              )}
              <CardHeader className="relative">
                <CardTitle className="text-blue-600 dark:text-blue-300">{scholarship.judul}</CardTitle>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">By {scholarship.author}</p>
                <p className="text-xs text-zinc-400 mt-1">{scholarship.startDate} s.d. {scholarship.endDate}</p>
                <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium ${
                  scholarship.tipe === 'internal'
                    ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-100'
                    : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                }`}>
                  {scholarship.tipe}
                </span>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-zinc-700 dark:text-zinc-300 mb-2 prose dark:prose-invert line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: scholarship.deskripsi?.slice(0, 100) + '...' }} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedScholarship(scholarship)}
                >
                  Lihat Selengkapnya
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-zinc-500 dark:text-zinc-400 text-sm italic">
            Tidak ada data beasiswa tersedia.
          </p>
        )}
      </div>

      {/* Dialog Detail Beasiswa */}
      <Dialog open={!!selectedScholarship} onOpenChange={() => setSelectedScholarship(null)}>
        <DialogContent className="w-full max-w-3xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <h2 className="text-xl font-bold">{selectedScholarship?.judul}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">By {selectedScholarship?.author}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Pendaftaran: {selectedScholarship?.startDate} - {selectedScholarship?.endDate}</p>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {selectedScholarship?.headerImage && (
              <img src={selectedScholarship.headerImage} alt="Header" className="w-full max-h-[300px] object-cover rounded-lg" />
            )}
            <div
              className="text-sm text-zinc-800 dark:text-zinc-200 prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedScholarship?.deskripsi || '' }}
            />
            {selectedScholarship?.url && (
              <a href={selectedScholarship.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                Kunjungi Link Beasiswa
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
