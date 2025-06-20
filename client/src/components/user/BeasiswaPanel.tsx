"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const BeasiswaPanel = () => {
  const [scholarships, setScholarships] = useState([])
  const [filteredScholarships, setFilteredScholarships] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedScholarship, setSelectedScholarship] = useState(null)

  const fetchScholarships = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://127.0.0.1:8081/api/scholarships")
      const data = await response.json()
      if (response.ok) {
        setScholarships(data)
        setFilteredScholarships(data)
        setError("")
      } else {
        setError("Gagal mengambil data beasiswa")
      }
    } catch (err) {
      setError("Tidak dapat terhubung ke server")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchScholarships()
  }, [])

  useEffect(() => {
    const term = searchTerm.toLowerCase()
    const filtered = scholarships.filter((s) =>
      (s.judul || "").toLowerCase().includes(term) ||
      (s.author || "").toLowerCase().includes(term) ||
      (s.tipe || "").toLowerCase().includes(term)
    )
    setFilteredScholarships(filtered)
  }, [searchTerm, scholarships])

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">Beasiswa Tersedia</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Temukan beasiswa yang sesuai dengan kebutuhan dan impian Anda.</p>
        <div className="max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Cari beasiswa berdasarkan judul, penulis, atau tipe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 border border-red-300 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-full text-center text-zinc-500 dark:text-zinc-400 text-sm italic">
            Memuat data beasiswa...
          </p>
        ) : filteredScholarships.length > 0 ? (
          filteredScholarships.map((scholarship) => {
            const hasImage = Boolean(scholarship.headerImage)
            const deskripsiText = (scholarship.deskripsi || "").slice(0, hasImage ? 120 : 500) + "..."

            return (
              <Card
                key={scholarship.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden flex flex-col"
              >
                {hasImage && (
                  <img
                    src={scholarship.headerImage}
                    alt="Gambar Beasiswa"
                    className="w-full h-40 object-cover"
                  />
                )}

                <CardHeader className="relative space-y-2 px-5 pt-4 pb-1">
                  <CardTitle className="text-xl font-semibold text-blue-600 dark:text-blue-300">
                    {scholarship.judul || "Tanpa Judul"}
                  </CardTitle>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    By {scholarship.author || "Unknown"}
                  </p>
                  <p className="text-xs text-zinc-400 leading-snug">
                    Pendaftaran dibuka {scholarship.startDate || "?"}<br />
                    dan berakhir {scholarship.endDate || "?"}
                  </p>
                  <span
                    className={`absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wide ${
                      scholarship.tipe === "internal"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {scholarship.tipe || "internal"}
                  </span>
                </CardHeader>

                <CardContent className="px-5 pt-1 pb-4 flex flex-col flex-grow justify-between gap-3">
                  <div
                    className="text-sm text-zinc-700 dark:text-zinc-300 prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: deskripsiText,
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedScholarship(scholarship)}
                  >
                    Lihat Selengkapnya
                  </Button>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <p className="col-span-full text-center text-zinc-500 dark:text-zinc-400 text-sm italic">
            Tidak ditemukan beasiswa yang sesuai.
          </p>
        )}
      </div>

      {/* Dialog Detail Beasiswa */}
      <Dialog
        open={!!selectedScholarship}
        onOpenChange={(open) => !open && setSelectedScholarship(null)}
      >
        <DialogContent className="w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg">
          <DialogHeader>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              {selectedScholarship?.judul || "Tanpa Judul"}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              By {selectedScholarship?.author || "Unknown"}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Pendaftaran: {selectedScholarship?.startDate || "?"} - {selectedScholarship?.endDate || "?"}
            </p>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {selectedScholarship?.headerImage && (
              <img
                src={selectedScholarship.headerImage}
                alt="Header"
                className="w-full max-h-[300px] object-cover rounded-lg"
              />
            )}
            <div
              className="text-sm text-zinc-800 dark:text-zinc-200 prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: selectedScholarship?.deskripsi || "<p>(Tidak ada deskripsi)</p>",
              }}
            />
            {selectedScholarship?.url && (
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
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BeasiswaPanel
