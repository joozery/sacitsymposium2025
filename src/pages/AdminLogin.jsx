import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Shield, Lock, User, Server } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

import logoWhite from '@/assets/logow.svg';
import symposiumText from '@/assets/symposiam.svg';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // เรียก API สำหรับ LDAP authentication
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // บันทึก token และข้อมูล admin
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        
        toast({
          title: "เข้าสู่ระบบสำเร็จ!",
          description: "ยินดีต้อนรับสู่ระบบจัดการ SACIT",
        });

        // ไปยังหน้า admin dashboard
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        toast({
          title: "เข้าสู่ระบบไม่สำเร็จ",
          description: data.message || 'กรุณาตรวจสอบข้อมูลอีกครั้ง',
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่');
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#533193] via-[#8B7DC3] to-[#BFB4EE] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full opacity-10 -translate-x-48 -translate-y-48 transform rotate-45"></div>
      <div className="absolute top-20 right-0 w-64 h-64 bg-white rounded-full opacity-15 translate-x-32 -translate-y-12 transform rotate-12"></div>
      <div className="absolute bottom-0 left-20 w-80 h-80 bg-white rounded-full opacity-10 -translate-y-20"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full opacity-10"></div>

      {/* Main Login Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full relative z-10"
      >
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#533193] to-[#8B7DC3] rounded-xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Login</h1>
            <p className="text-gray-600 text-sm">เข้าสู่ระบบจัดการ SACIT</p>
          </div>

          {/* LDAP Server Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-blue-700 text-sm">
              <Server className="w-4 h-4" />
              <span>เชื่อมต่อกับ LDAP Server: 172.16.0.2</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-center"
            >
              <span className="text-red-600 text-sm">{error}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                ชื่อผู้ใช้ (Username)
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="กรอกชื่อผู้ใช้"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#533193] focus:ring-0"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                รหัสผ่าน (Password)
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="กรอกรหัสผ่าน"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 border-2 border-gray-200 rounded-xl focus:border-[#533193] focus:ring-0"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#533193] to-[#8B7DC3] hover:from-[#533193]/90 hover:to-[#8B7DC3]/90 text-white py-3 rounded-xl font-medium text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    กำลังเข้าสู่ระบบ...
                  </div>
                ) : (
                  'เข้าสู่ระบบ'
                )}
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">หรือ</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Links */}
          <div className="space-y-3 text-center">
            <Link 
              to="/login" 
              className="block text-sm text-gray-600 hover:text-[#533193] transition-colors"
            >
              ← กลับไปหน้า Login ทั่วไป
            </Link>
            <Link 
              to="/" 
              className="block text-sm text-gray-500 hover:text-[#533193] transition-colors"
            >
              ← กลับหน้าหลัก
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2">
              <img src={logoWhite} alt="SACIT" className="h-6 w-auto filter brightness-0" />
              <img src={symposiumText} alt="Symposium" className="h-7 w-auto filter brightness-0" />
            </div>
            <p className="text-center text-xs text-gray-500 mt-2">
              ระบบจัดการ SACIT Symposium 2025
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin; 