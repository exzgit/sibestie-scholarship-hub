'use client'

import {
  LayoutDashboard,
  UserPlus,
  BarChart2,
  Users,
  Activity,
  CalendarDays
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const dummyStats = [
  { name: 'Jan', pendaftar: 20 },
  { name: 'Feb', pendaftar: 45 },
  { name: 'Mar', pendaftar: 30 },
  { name: 'Apr', pendaftar: 50 },
  { name: 'Mei', pendaftar: 70 },
  { name: 'Jun', pendaftar: 65 },
];

export const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-100 dark:from-[#0d0d0d] dark:to-[#111] p-4">
      {/* Header */}
      <div className="mb-6 border-b border-blue-400 pb-2">
        <h1 className="text-4xl font-serif font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500">
                <LayoutDashboard className="w-6  h-6 text-white" />
            </div>
            <span>Dashboard</span>
        </h1>
      </div>

      {/* Statistik Kunci */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="shadow-lg">
          <CardContent className="p-6 flex items-center gap-4">
            <UserPlus className="w-10 h-10 text-blue-500" />
            <div>
              <h2 className="text-2xl font-semibold">1.240</h2>
              <p className="text-zinc-600 dark:text-zinc-400">Total Pendaftar</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6 flex items-center gap-4">
            <CalendarDays className="w-10 h-10 text-green-500" />
            <div>
              <h2 className="text-2xl font-semibold">120</h2>
              <p className="text-zinc-600 dark:text-zinc-400">Bulan Ini</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6 flex items-center gap-4">
            <Activity className="w-10 h-10 text-orange-500" />
            <div>
              <h2 className="text-2xl font-semibold">874</h2>
              <p className="text-zinc-600 dark:text-zinc-400">User Aktif</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grafik Pendaftaran */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold">Statistik Pendaftaran Bulanan</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyStats}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pendaftar" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

     
    </div>
  );
};
