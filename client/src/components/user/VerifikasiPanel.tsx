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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifikasiPanel() {
  const { isAuthenticated, user } = useAuth();
  
  const [children, setChildren] = useState([{ name: "", status: "" }]);
  const [fatherIncome, setFatherIncome] = useState(0);
  const [motherIncome, setMotherIncome] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  const [userEmail, setUserEmail] = useState(user.email);

  useEffect(() => {
    setTotalIncome(fatherIncome + motherIncome);
  }, [fatherIncome, motherIncome]);

  const addChild = () => {
    setChildren([...children, { name: "", status: "" }]);
  };

  const removeChild = (index) => {
    const updated = [...children];
    updated.splice(index, 1);
    setChildren(updated);
  };

  const updateChild = (index, key, value) => {
    const updated = [...children];
    updated[index][key] = value;
    setChildren(updated);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Data Personal */}
      <Card className="shadow border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl">Data Pribadi</CardTitle>
        </CardHeader>
        <CardContent className="md:grid grid-cols-1 space-2 flex flex-col md:grid-cols-2 gap-4">
          <div>
            <Label>Nama Lengkap</Label>
            <Input placeholder="Nama sesuai KTP" />
          </div>
          <div>
            <Label>NIK</Label>
            <Input placeholder="Nomor Induk Kependudukan" />
          </div>
          <div>
            <Label>NISN</Label>
            <Input placeholder="Nomor Induk Siswa Nasional" />
          </div>
          <div>
            <Label>Tempat Lahir</Label>
            <Input placeholder="Contoh: Bandung" />
          </div>
          <div>
            <Label>Tanggal Lahir</Label>
            <Input type="date" />
          </div>
          <div>
            <Label>Asal Sekolah</Label>
            <Input placeholder="SMP/SMA asal" />
          </div>
          <div>
            <Label>Status Kelulusan</Label>
            <Input placeholder="Lulus / Belum Lulus" />
          </div>
          <div>
            <Label>Tahun Lulus</Label>
            <Input placeholder="Contoh: 2024" />
          </div>
          <div>
            <Label>Nomor Telepon</Label>
            <Input placeholder="08xxxxxxxxxx" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="yourmail@example.com" />
          </div>
          <div className="col-span-2">
            <Label>Media Sosial</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <Input placeholder="Instagram" />
              <Input placeholder="Facebook" />
              <Input placeholder="Tiktok" />
              <Input placeholder="Website" />
              <Input placeholder="Media sosial lainnya" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Ekonomi */}
      <Card className="shadow border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl">Data Ekonomi</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Pekerjaan Orang Tua</Label>
            <Input placeholder="Contoh: Pegawai Negeri" />
          </div>
          <div>
            <Label>Pendapatan Per Bulan</Label>
            <Input placeholder="Contoh: 3.000.000" />
          </div>
          <div>
            <Label>Jumlah Tanggungan</Label>
            <Input type="number" placeholder="Contoh: 3" />
          </div>
        </CardContent>
      </Card>

      {/* Data Keluarga */}
      <Card className="shadow border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl">Data Keluarga</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Nama Ayah</Label>
              <Input />
            </div>
            <div>
              <Label>Pekerjaan Ayah</Label>
              <Input />
            </div>
            <div>
              <Label>Pendapatan Ayah</Label>
              <Input
                type="number"
                onChange={(e) => setFatherIncome(Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Nama Ibu</Label>
              <Input />
            </div>
            <div>
              <Label>Pekerjaan Ibu</Label>
              <Input />
            </div>
            <div>
              <Label>Pendapatan Ibu</Label>
              <Input
                type="number"
                onChange={(e) => setMotherIncome(Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Total Pendapatan</Label>
              <div className="p-2 border rounded-md bg-zinc-200 font-bold text-2xl">
                Rp{totalIncome.toLocaleString("id-ID")}
              </div>
            </div>
            <div className="md:col-span-3">
              <Label>Alamat Lengkap</Label>
              <Textarea />
            </div>
          </div>

          <div className="flex justify-between items-center pt-6">
            <h3 className="text-lg font-medium">Data Anak / Saudara</h3>
            <Button onClick={addChild} className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Tambah Anak
            </Button>
          </div>
          {children.map((child, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <Label>Nama Anak</Label>
                <Input
                  value={child.name}
                  onChange={(e) => updateChild(index, "name", e.target.value)}
                  placeholder="Nama Anak"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-grow">
                  <Label>Status</Label>
                  <Input
                    value={child.status}
                    onChange={(e) => updateChild(index, "status", e.target.value)}
                    placeholder="Pelajar / Bekerja / dll"
                  />
                </div>
                {children.length > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    className="mt-6"
                    onClick={() => removeChild(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upload Berkas */}
      <Card className="shadow border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl">Upload Berkas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Foto KTP</Label>
              <Input type="file" accept="image/*" />
            </div>
            <div>
              <Label>Foto KK</Label>
              <Input type="file" accept="image/*" />
            </div>
            <div>
              <Label>Foto Rapor</Label>
              <Input type="file" accept="image/*" />
            </div>
            <div>
              <Label>Foto Ijazah</Label>
              <Input type="file" accept="image/*" />
            </div>
            <div>
              <Label>Foto SKL (opsional, jika tidak upload Ijazah)</Label>
              <Input type="file" accept="image/*" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}