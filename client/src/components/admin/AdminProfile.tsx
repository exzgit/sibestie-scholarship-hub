'use client'

import { BarChart, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../ui/avatar";

export const AdminProfile = () => {
    const { user, logout } = useAuth();
    
    // Use data from user context (from KTP registration)
    const userData = {
    foto: "",
    name: user?.name || 'user.example',
    email: user?.email || 'user@example.com',
    };

    
    return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-100 dark:from-[#0d0d0d] dark:to-[#111] p-4">
        {/* Header */}
        <div className="mb-6 border-b border-blue-400 pb-2">
            <h1 className="text-3xl font-bold font-serif text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500">
                    <User className="w-6 h-6 text-white" />
                </div>
                <span>Profile</span>
            </h1>
        </div>

        {/* Profile Picture and Basic Info */}
        <Card className="mb-6 shadow-md">
            <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={userData.foto} alt={userData.name} />
                <AvatarFallback className="text-xl">
                    {userData.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-gray-800 mb-1">{userData.name}</h2>
                <p className="text-gray-600 mb-4">{userData.email}</p>
                {/* <Button variant="outline" size="sm">
                Ubah Foto Profile
                </Button> */}
            </div>
            </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
            {/* <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Edit Profile
            </Button> */}
            {/* <Button variant="outline" className="w-full">
            Ubah Password
            </Button> */}
            <Button 
            variant="outline" 
            className="w-full border-red-200 text-red-600 hover:bg-red-50"
            onClick={logout}
            >
            Logout
            </Button>
        </div>
    </div>
    );
}