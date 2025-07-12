'use client'

import { useEffect, useState } from "react"
import { IdCard, PlusCircle, Trash2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface User {
  ID: number
  Name: string
  Email: string
  Role: string
}

export const TableViewDataUser = () => {
  const {user, isAuthenticated} = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [newUser, setNewUser] = useState({
    name: '', 
    email: '', 
    password: '', 
    role: 'User', 
  })

  const fetchUserData = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("http://127.0.0.1:8081/api/getuser")
      if (!response.ok) {
        throw new Error("Gagal mengambil data user")
      }
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tidak dapat terhubung ke server")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const [searchKeyword, setSearchKeyword] = useState("")

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      setError("Semua field wajib diisi")
      return
    }
    setLoading(true)
    setError("")
    try {
      // Endpoint register dapat digunakan untuk membuat user baru dengan role spesifik
      const response = await fetch("http://127.0.0.1:8081/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gagal menambah user baru")
      }
      setNewUser({ name: '', email: '', password: '', role: 'User' })
      setIsDialogOpen(false)
      await fetchUserData() // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambah user")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus user ini?")) return;
    
    setLoading(true);
    setError("");
    try {
      // Endpoint delete user perlu dibuat di backend
      const response = await fetch(`http://127.0.0.1:8081/api/users/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal menghapus user")
      }
      await fetchUserData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus user")
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    u =>
      (u.Name || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (u.Email || '').toLowerCase().includes(searchKeyword.toLowerCase())
  )

  const total = users.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-100 dark:from-[#0d0d0d] dark:to-[#111] p-4">
      {/* Header */}
      <div className="mb-6 border-b border-blue-400 pb-2 flex justify-between items-center">
        <h1 className="text-3xl font-bold font-serif text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500">
            <IdCard className="w-6 h-6 text-white" />
          </div>
          <span>User Management</span>
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <PlusCircle size={18} />
              Tambah User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <h2 className="text-xl font-semibold">Tambah User Baru</h2>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div>
                <Label>Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(val) => setNewUser({ ...newUser, role: val })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="verifikator">Verifikator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {error && (
         <Alert variant="destructive" className="mb-4">
           <AlertCircle className="h-4 w-4" />
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-xl shadow text-center col-span-3">
          <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200">Total Users</h2>
          <p className="text-3xl font-bold text-blue-800 dark:text-white">{total}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-2">
        <Search className="text-zinc-500 dark:text-zinc-300" />
        <Input
          placeholder="Cari nama atau email..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full max-w-md"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
          <thead className="bg-zinc-100 dark:bg-zinc-800">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-600 dark:text-zinc-300">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-600 dark:text-zinc-300">Nama</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-600 dark:text-zinc-300">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-600 dark:text-zinc-300">Role</th>
              <th className="px-6 py-3 text-sm font-semibold text-right text-zinc-600 dark:text-zinc-300">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 divide-y max-h-screen overflow-y-auto divide-zinc-200 dark:divide-zinc-700">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-zinc-500 dark:text-zinc-400">
                  Memuat data...
                </td>
              </tr>
            ) : filteredUsers.map((userss, index) => (
              <tr key={userss.ID}>
                <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-zinc-900 dark:text-white">{userss.Name}</td>
                <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">{userss.Email}</td>
                <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">{userss.Role}</td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    className={`${userss.Email != user.email ? 'text-red-600 hover:text-red-700 ' : 'text-gray-600'}`}
                    onClick={() => handleDelete(userss.ID)}
                    disabled={userss.Email == user.email}
                  >
                    <Trash2 size={18} />
                  </Button>
                </td>
              </tr>
            ))}
            {!loading && filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-zinc-500 dark:text-zinc-400">
                  Tidak ada user yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
