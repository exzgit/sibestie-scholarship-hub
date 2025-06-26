import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowLeftCircleIcon, ArrowLeftSquareIcon, HomeIcon } from 'lucide-react';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, register, isRole } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(email, password);
      } else {
        success = await register({name, email, password});
      }

      if (!success) {
        setError(isLogin ? 'Email atau password salah' : 'Gagal mendaftar');
      } else {
        setSuccess(isLogin ? 'Login berhasil!' : 'Registrasi berhasil, silahkan login')
        if (!isLogin) {
          setIsLogin(true)
        } else {
          // Redirect based on role to their authorized page
          if (isRole === "admin") {
            navigate('/admin');
          } else if (isRole === "verifikator") {
            navigate('/verifikator');
          } else if (isRole === "user") {
            navigate('/user');
          } else {
            navigate('/')
          }
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err);

      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Terjadi kesalahan tak terduga');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="relative w-full max-w-md shadow-lg">
        
        <CardHeader className="text-center">
          {/* <Button 
            size='icon'
            className="absolute rounded-none rounded-br-lg rounded-tl-lg border-b border-r top-0 left-0 bg-blue-400 border-blue-400 hover:bg-transparent text-white hover:text-blue-500"
            onClick={() => {navigate('/user')}}
          >
            <ArrowLeftSquareIcon size={36} />
          </Button> */}
          <div className='flex justify-center'>
            
            <CardTitle className="text-2xl font-bold text-gray-800">
              {isLogin ? 'Masuk' : 'Daftar'} SIBESTIE
            </CardTitle>
          </div>
          <p className="text-gray-600">
            {isLogin ? 'Masuk ke akun Anda' : 'Buat akun baru'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="name">Nama Lengkap (sesuai KTP)</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    placeholder="Masukkan nama lengkap sesuai KTP"
                  />
                </div>
              </>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Masukkan email"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Masukkan password"
              />
            </div>

            {success && (
              <div className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">{success}</div>
            )}

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</div>
            )}

            <div className='flex w-full gap-2'>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Loading...' : (isLogin ? 'Masuk' : 'Daftar')}
              </Button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:underline text-sm"
              >
                {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
              </button>
            </div>
            {/* 
            {isLogin && (
              <div className="text-md text-gray-500 mt-4 p-3 bg-blue-50 rounded">
                <strong>Demo Login:</strong><br/>
                Admin: sbadmin@sibestie.org / sbadmin424<br/>
                User: johndoe@contoh.com / 12345678<br/>
                Verifikator: sbverify@sibesti.org / sbverify424
              </div>
            )} */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginRegister;
