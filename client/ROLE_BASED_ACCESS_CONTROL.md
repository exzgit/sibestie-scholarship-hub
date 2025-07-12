# Role-Based Access Control (RBAC) System

## Overview

Sistem RBAC telah diimplementasikan untuk memastikan setiap user hanya dapat mengakses halaman yang sesuai dengan rolenya. Ada 3 role yang tersedia:

1. **Admin** - Akses penuh ke dashboard admin
2. **Verifikator** - Akses ke dashboard verifikator  
3. **User** - Akses ke fitur user biasa

## Struktur Role dan Akses

### 🔴 **Admin Role**
- **Route yang diizinkan**: `/admin/*`
- **Fitur yang dapat diakses**:
  - Dashboard Admin
  - Data User Management
  - Beasiswa Management
  - Laporan & Statistik
  - Donasi Management
  - Berita Management
  - Profile Admin

### 🔵 **Verifikator Role**
- **Route yang diizinkan**: `/verifikator/*`
- **Fitur yang dapat diakses**:
  - Dashboard Verifikator
  - Data User Management
  - Beasiswa Management
  - Laporan & Statistik
  - Donasi Management
  - Berita Management
  - Profile Verifikator

### 🟢 **User Role**
- **Route yang diizinkan**: `/user/*`
- **Fitur yang dapat diakses**:
  - Home
  - Profile
  - Beasiswa
  - Berita
  - Informasi
  - Konsultasi
  - Verifikasi

## Implementasi Keamanan

### 1. Protected Routes
Setiap route dilindungi dengan komponen `ProtectedRoute` yang memvalidasi:
- Status autentikasi user
- Role user yang sesuai dengan route yang diakses

```typescript
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isRole } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  if (!allowedRoles.includes(isRole)) {
    // Redirect ke halaman default sesuai role
    if (isRole === "admin") return <Navigate to="/admin" replace />;
    if (isRole === "verifikator") return <Navigate to="/verifikator" replace />;
    if (isRole === "user") return <Navigate to="/user" replace />;
  }
  
  return <>{children}</>;
};
```

### 2. Role-Based Redirects
- **Root route (`/`)**: Redirect otomatis berdasarkan role
- **Unauthorized access**: Redirect ke halaman default role user
- **Unknown roles**: Redirect ke halaman login

### 3. Role Header Component
Setiap halaman menampilkan informasi role user dan tombol logout:
- **Icon role** yang berbeda untuk setiap role
- **Label role** yang jelas
- **Warna yang berbeda** untuk setiap role:
  - Admin: Merah
  - Verifikator: Biru
  - User: Hijau

## Alur Autentikasi

### Login Process
1. User mengakses `/auth/login`
2. Input email dan password
3. Sistem memvalidasi kredensial
4. Jika berhasil, redirect berdasarkan role:
   - Admin → `/admin`
   - Verifikator → `/verifikator`
   - User → `/user`

### Logout Process
1. User klik tombol logout di RoleHeader
2. Sistem menghapus data user dari localStorage
3. Redirect ke halaman login

### Session Management
- **Token**: Disimpan di localStorage
- **User data**: Disimpan di localStorage
- **Auto-logout**: Saat token expired atau invalid

## Error Handling

### 1. Unauthorized Access
Jika user mencoba mengakses route yang tidak sesuai rolenya:
- Redirect otomatis ke halaman default role user
- Tidak ada error message yang mengganggu

### 2. Invalid Role
Jika user memiliki role yang tidak valid:
- Redirect ke halaman login
- Tampilkan pesan error yang informatif

### 3. Session Expired
Jika session user expired:
- Redirect ke halaman login
- Hapus data user dari localStorage

## Testing

### Demo Accounts
Untuk testing sistem RBAC, gunakan akun demo berikut:

```
Admin:
- Email: admin@sibestie.com
- Password: admin123
- Expected: Redirect ke /admin

Verifikator:
- Email: verifikator@sibestie.com  
- Password: verifikator123
- Expected: Redirect ke /verifikator

User:
- Email: email@contoh.com
- Password: password123
- Expected: Redirect ke /user
```

### Test Scenarios
1. **Login dengan role yang benar** → Harus redirect ke halaman yang sesuai
2. **Mencoba akses route role lain** → Harus redirect ke halaman default role user
3. **Logout** → Harus redirect ke halaman login
4. **Refresh halaman** → Harus tetap di halaman yang sama jika masih login
5. **Akses tanpa login** → Harus redirect ke halaman login

## Keamanan Tambahan

### 1. Route Protection
- Semua route dilindungi dengan `ProtectedRoute`
- Validasi role dilakukan di level route
- Redirect otomatis untuk akses yang tidak sah

### 2. Component Level Security
- RoleHeader menampilkan informasi role yang valid
- Logout function membersihkan semua data session
- Error handling yang aman

### 3. Data Protection
- Token disimpan dengan aman di localStorage
- User data tidak terekspos ke route yang tidak sah
- Session management yang proper

## Maintenance

### Menambah Role Baru
1. Update interface `User` di `AuthContext.tsx`
2. Tambahkan role baru di `ProtectedRoute`
3. Update `RoleRedirect` component
4. Tambahkan route baru dengan `ProtectedRoute`
5. Update `RoleHeader` component untuk role baru

### Menambah Route Baru
1. Definisikan route di `routes.tsx`
2. Wrap dengan `ProtectedRoute` dengan role yang sesuai
3. Update navigation di halaman terkait
4. Test akses dengan berbagai role

## Best Practices

1. **Always validate role** sebelum memberikan akses
2. **Use ProtectedRoute** untuk semua route yang memerlukan autentikasi
3. **Handle edge cases** seperti role yang tidak valid
4. **Provide clear feedback** untuk user saat akses ditolak
5. **Maintain session properly** dengan logout yang bersih 