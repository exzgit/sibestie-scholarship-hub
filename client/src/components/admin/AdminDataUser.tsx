'use client'

import { useState } from "react"
import { IdCard, PlusCircle, Trash2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const TableViewDataUser = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Ezra Valen', email: 'ezra@example.com', role: 'Admin', status: 'Yes' },
    { id: 2, name: 'Sarah Mahira', email: 'sarah@example.com', role: 'User', status: 'Yes' },
    { id: 3, name: 'Rafi Dimas', email: 'rafi@example.com', role: 'User', status: 'No' },
    { id: 4, name: 'Dina Ayu', email: 'dina@example.com', role: 'Verifikator', status: 'Yes' },
  ])

  const [newUser, setNewUser] = useState({
    name: '', email: '', password: '', role: 'User', status: 'Pending'
  })

  const [searchKeyword, setSearchKeyword] = useState("")

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.password && newUser.role) {
      const id = users.length + 1
      setUsers([...users, { id, ...newUser }])
      setNewUser({ name: '', email: '', password: '', role: 'User', status: 'Pending' })
    }
  }

  const handleDelete = (id: number) => {
    setUsers(users.filter(u => u.id !== id))
  }

  const filteredUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      u.email.toLowerCase().includes(searchKeyword.toLowerCase())
  )

  const total = users.length
  const verified = users.filter(u => u.status === 'Active').length
  const unverified = total - verified

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
      <div className="overflow-x-auto rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
          <thead className="bg-zinc-100 dark:bg-zinc-800">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-600 dark:text-zinc-300">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-600 dark:text-zinc-300">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-600 dark:text-zinc-300">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-600 dark:text-zinc-300">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-600 dark:text-zinc-300">Status</th>
              <th className="px-6 py-3 text-sm font-semibold text-right text-zinc-600 dark:text-zinc-300">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 divide-y max-h-screen overflow-y-auto divide-zinc-200 dark:divide-zinc-700">
            {filteredUsers.map((user, index) => (
              <tr key={user.id}>
                <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-zinc-900 dark:text-white">{user.name}</td>
                <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">{user.email}</td>
                <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">{user.role}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full
                    ${user.status === 'Yes' ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100' :
                      user.status === 'No' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100' :
                        'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-zinc-500 dark:text-zinc-400">
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
