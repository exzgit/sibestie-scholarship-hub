'use client'

import { useState, useEffect } from "react"
import { IdCard, PlusCircle, Trash2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/contexts/AuthContext"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

// Define interface for user data
interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status?: string;
  createdAt: string;
}

// Define interface for new user form
interface NewUserForm {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

// Add an interface for the raw API data
interface ApiUserData {
  id: number;
  name?: string;
  Name?: string;
  email: string;
  role?: string;
  Role?: string;
  status?: string;
  Status?: string;
  created_at?: string;
  createdAt?: string;
}

export const TableViewDataUser = () => {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newUser, setNewUser] = useState<NewUserForm>({
    name: '', email: '', password: '', role: 'User', status: 'Pending'
  })
  const [searchKeyword, setSearchKeyword] = useState("")
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null)
  const { user: currentUser } = useAuth()

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError("")
      try {
        const response = await axios.get<ApiUserData[]>("http://localhost:8081/api/users")
        
        // Normalize the data structure to ensure consistency
        const normalizedUsers = response.data.map((user: ApiUserData) => ({
          id: user.id,
          name: user.name || user.Name || '',
          email: user.email || '',
          role: (user.role || user.Role || '').toLowerCase(),
          status: (user.status || user.Status || '').toLowerCase(),
          createdAt: user.created_at || user.createdAt || ''
        }));
        
        setUsers(normalizedUsers)
      } catch (err) {
        setError("Gagal mengambil data user")
        console.error("Error fetching users:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.password && newUser.role) {
      const id = users.length + 1
      setUsers([...users, { 
        id, 
        name: newUser.name,
        email: newUser.email,
        role: newUser.role.toLowerCase(),
        status: newUser.status.toLowerCase(),
        createdAt: new Date().toISOString()
      }])
      setNewUser({ name: '', email: '', password: '', role: 'User', status: 'Pending' })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      setLoading(true)
      await axios.delete(`http://localhost:8081/api/users/${id}`)
      setUsers(users.filter(u => u.id !== id))
      setDeleteUserId(null)
    } catch (err) {
      setError("Gagal menghapus user")
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      u.email.toLowerCase().includes(searchKeyword.toLowerCase())
  )

  const total = users.length
  const verified = users.filter(u => u.status === 'approved').length
  const unverified = total - verified

  const getRoleValue = (user: UserData) => {
    return user.role.toLowerCase();
  };

  const getStatusValue = (user: UserData) => {
    return (user.status || '').toLowerCase();
  };

  const formatStatusDisplay = (status: string) => {
    if (!status) return 'Unknown';
    
    // First letter uppercase, rest lowercase
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Helper untuk format tanggal
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-white to-zinc-100 dark:from-[#0d0d0d] dark:to-[#111] p-4">
        {/* Header */}
        <div className="mb-6 border-b border-blue-400 pb-2 flex justify-between items-center">
          <h1 className="text-3xl font-bold font-serif text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500">
              <IdCard className="w-6 h-6 text-white" />
            </div>
            <span>User Management</span>
          </h1>
          <Dialog>
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
              <div className="grid gap-4">
                <div>
                  <Label>Nama</Label>
                  <Input
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(val) => setNewUser({ ...newUser, role: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="Verifikator">Verifikator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Simpan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-xl shadow text-center">
            <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200">Total Users</h2>
            <p className="text-3xl font-bold text-blue-800 dark:text-white">{total}</p>
          </div>
          <div className="p-4 bg-green-100 dark:bg-green-900 rounded-xl shadow text-center">
            <h2 className="text-lg font-semibold text-green-700 dark:text-green-200">Verified</h2>
            <p className="text-3xl font-bold text-green-800 dark:text-white">{verified}</p>
          </div>
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-xl shadow text-center">
            <h2 className="text-lg font-semibold text-yellow-700 dark:text-yellow-200">Unverified</h2>
            <p className="text-3xl font-bold text-yellow-800 dark:text-white">{unverified}</p>
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
        {loading ? (
          <div className="text-center py-8 text-blue-600">Memuat data user...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-sm">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
              <thead className="bg-zinc-100 dark:bg-zinc-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-600 dark:text-zinc-300">#</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-600 dark:text-zinc-300">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-600 dark:text-zinc-300">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-600 dark:text-zinc-300">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-600 dark:text-zinc-300">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-600 dark:text-zinc-300">Tanggal Daftar</th>
                  <th className="px-6 py-3 text-sm font-semibold text-right text-zinc-600 dark:text-zinc-300">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-zinc-900 divide-y max-h-screen overflow-y-auto divide-zinc-200 dark:divide-zinc-700">
                {filteredUsers.map((user, index) => {
                  const isCurrentUser = currentUser && (user.id === parseInt(currentUser.id));
                  return (
                    <tr key={user.id}>
                      <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-zinc-900 dark:text-white">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">{user.role}</td>
                      <td className="px-6 py-4">
                        {(['user', 'verifikator'].includes(getRoleValue(user))) ? (
                          <span className={`text-xs font-medium px-2 py-1 rounded-full
                            ${getStatusValue(user) === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100' : 
                              getStatusValue(user) === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100' :
                              getStatusValue(user) === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100' :
                                'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-100'}`}>
                            {formatStatusDisplay(getStatusValue(user))}
                          </span>
                        ) : (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">{formatDate(user.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        {isCurrentUser ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <Button
                                  variant="ghost"
                                  className="text-gray-400 cursor-not-allowed"
                                  disabled
                                >
                                  <Trash2 size={18} />
                                </Button>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              Tidak dapat menghapus akun yang sedang digunakan
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => setDeleteUserId(user.id)}
                              >
                                <Trash2 size={18} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus User?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus user <b>{user.name}</b> beserta seluruh data terkait? Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeleteUserId(null)}>
                                  Batal
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(user.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-zinc-500 dark:text-zinc-400">
                      Tidak ada user yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
