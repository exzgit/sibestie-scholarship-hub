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
import { useState, useEffect } from "react";
import axios from "axios";

// Define interfaces for our data
interface VerificationStats {
  totalUsers: number;
  verifiedUsers: number;
  pendingUsers: number;
  rejectedUsers: number;
}

interface MonthlyStats {
  month: string;
  month_name: string;
  count: number;
}

export const AdminDashboard = () => {
  // State for statistics
  const [verificationStats, setVerificationStats] = useState<VerificationStats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Function to fetch verification statistics
  const fetchVerificationStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await axios.get('http://127.0.0.1:8081/api/verifikasi/stats', {
        headers
      });
      
      setVerificationStats(response.data);
    } catch (err) {
      console.error("Failed to fetch verification stats:", err);
      setError("Failed to load verification statistics");
    }
  };
  
  // Function to fetch monthly registration statistics
  const fetchMonthlyStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await axios.get('http://127.0.0.1:8081/api/verifikasi/monthly-stats', {
        headers
      });
      
      // Transform data for chart
      const chartData = response.data.map((item: MonthlyStats) => ({
        name: item.month_name.substring(0, 3), // First 3 letters of month name
        pendaftar: item.count
      }));
      
      setMonthlyStats(chartData);
    } catch (err) {
      console.error("Failed to fetch monthly stats:", err);
      setError("Failed to load monthly statistics");
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data when component mounts
  useEffect(() => {
    fetchVerificationStats();
    fetchMonthlyStats();
    
    // Set up an interval to refresh data every 30 seconds
    const intervalId = setInterval(() => {
      fetchVerificationStats();
      fetchMonthlyStats();
    }, 30000); // 30 seconds
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // If still loading show a loading indicator
  if (loading && !verificationStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading dashboard data...</p>
      </div>
    );
  }

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

      {/* Display error message if any */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Statistik Kunci */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="shadow-lg">
          <CardContent className="p-6 flex items-center gap-4">
            <UserPlus className="w-10 h-10 text-blue-500" />
            <div>
              <h2 className="text-2xl font-semibold">{verificationStats?.totalUsers || 0}</h2>
              <p className="text-zinc-600 dark:text-zinc-400">Total Pendaftar</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6 flex items-center gap-4">
            <Activity className="w-10 h-10 text-green-500" />
            <div>
              <h2 className="text-2xl font-semibold">{verificationStats?.verifiedUsers || 0}</h2>
              <p className="text-zinc-600 dark:text-zinc-400">Terverifikasi</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6 flex items-center gap-4">
            <CalendarDays className="w-10 h-10 text-orange-500" />
            <div>
              <h2 className="text-2xl font-semibold">{verificationStats?.pendingUsers || 0}</h2>
              <p className="text-zinc-600 dark:text-zinc-400">Menunggu Verifikasi</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grafik Pendaftaran */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold">Statistik Pendaftaran Bulanan</h3>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                fetchMonthlyStats();
                fetchVerificationStats();
              }}
            >
              Refresh Data
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyStats}>
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
