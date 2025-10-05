import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '@/services/authService';

import logoWhite from '@/assets/logow.svg';
import symposiumText from '@/assets/symposiam.svg';
import bgLogin from '@/assets/bglogin.jpg';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
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
      const result = await authService.login(formData);
      if (result.success) {
        navigate('/account');
      } else {
        setError(result.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic
    console.log('Forgot password clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B7DC3] via-[#B3FFD1] to-[#BFB4EE] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#533193] rounded-full opacity-20 -translate-x-48 -translate-y-48 transform rotate-45"></div>
      <div className="absolute top-20 right-0 w-64 h-64 bg-[#533193] rounded-full opacity-30 translate-x-32 -translate-y-12 transform rotate-12"></div>
      <div className="absolute bottom-0 left-20 w-80 h-80 bg-[#BFB4EE] rounded-full opacity-25 -translate-y-20"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#533193] rounded-full opacity-20"></div>

      {/* Main Login Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full relative z-10"
        style={{ height: '600px' }}
      >
        <div className="flex h-full">
          {/* Left Panel - Background Image */}
          <div className="flex-1 relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(83, 49, 147, 0.7) 0%, rgba(191, 180, 238, 0.3) 100%), url(${bgLogin})`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#533193]/50 to-transparent" />
            
            {/* Decorative Elements on Image */}
            <div className="absolute top-8 left-8">
              <div className="w-16 h-16 border-2 border-white/30 rounded-lg transform rotate-12"></div>
            </div>
            <div className="absolute bottom-16 right-12">
              <div className="w-12 h-12 bg-white/20 rounded-full"></div>
            </div>
            <div className="absolute top-1/3 right-8">
              <div className="w-8 h-8 border border-white/40 rounded-full"></div>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="flex-1 p-12 flex flex-col justify-center bg-white relative">
            {/* Logo */}
            <div className="absolute top-6 right-6">
              <div className="flex flex-col items-end">
                <img src={logoWhite} alt="SACIT" className="h-6 w-auto mb-1 filter brightness-0" />
                <img src={symposiumText} alt="Symposium" className="h-7 w-auto filter brightness-0" />
              </div>
            </div>

            {/* Login Form */}
            <div className="max-w-sm mx-auto w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className="text-3xl font-didot text-[#533193] mb-8 text-center">
                  Login
                </h1>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2 text-center"
                  >
                    <span className="text-red-600 text-sm">{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#533193] focus:ring-0 font-custom"
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2 relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-[#533193] focus:ring-0 font-custom"
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

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-[#533193] border-gray-300 rounded focus:ring-[#533193]"
                      />
                      <span className="font-custom text-gray-600">Remember Me</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="font-custom text-[#533193] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Login Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#533193] to-[#8B7DC3] hover:from-[#533193]/90 hover:to-[#8B7DC3]/90 text-white py-3 rounded-xl font-custom-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'Login'}
                    </Button>
                  </motion.div>
                </form>

                {/* Divider */}
                <div className="my-8 flex items-center">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="px-4 text-sm font-custom text-gray-500">หรือ</span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <p className="font-custom text-gray-600">
                    ยังไม่มีบัญชี?{' '}
                    <Link 
                      to="/register" 
                      className="font-custom-bold text-[#533193] hover:underline"
                    >
                      สมัครสมาชิก
                    </Link>
                  </p>
                </div>

                {/* Admin Login Link */}
                <div className="text-center mt-4">
                  <Link 
                    to="/admin-login" 
                    className="font-custom text-sm text-gray-500 hover:text-[#533193] transition-colors"
                  >
                    🔐 เข้าสู่ระบบแอดมิน
                  </Link>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                  <Link 
                    to="/" 
                    className="font-custom text-sm text-gray-500 hover:text-[#533193] transition-colors"
                  >
                    ← กลับหน้าหลัก
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login; 