
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, register } = useAuth();

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
      }else {
        setSuccess(isLogin ? 'Login Success' : 'Register Success, silahkan login')
        if (!isLogin) {
          setIsLogin(true)
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      console.error("Register Error:", err);

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
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {isLogin ? 'Masuk' : 'Daftar'} SIBESTIE
          </CardTitle>
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
              <div className="text-green-600 text-sm text-center">{success}</div>
            )}

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Loading...' : (isLogin ? 'Masuk' : 'Daftar')}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:underline text-sm"
              >
                {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
              </button>
            </div>

            {isLogin && (
              <div className="text-xs text-gray-500 mt-4 p-3 bg-blue-50 rounded">
                <strong>Demo Login:</strong><br/>
                Admin: admin@sibestie.com / admin123<br/>
                User: email@contoh.com / password123
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginRegister;
