import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import authService from '@/services/authService';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Trophy, FileText, Settings, LogOut, Eye, EyeOff, Check, AlertCircle, Edit, Download } from 'lucide-react';

const menuItems = [
  { label: 'โปรไฟล์', icon: User },
  { label: 'ผลการตัดสิน', icon: Trophy },
  { label: 'ใบประกาศนียบัตร', icon: FileText },
  { label: 'การตั้งค่า', icon: Settings },
];

const Account = () => {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeMenu, setActiveMenu] = useState('การตั้งค่า');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Profile data state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    educationLevel: '',
    prefix: '',
    profileImage: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  
  // Profile image state
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  
  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editProfileData, setEditProfileData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // Certificate data state
  const [certificateData, setCertificateData] = useState(null);
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [userCertificates, setUserCertificates] = useState([]);
  
  // Results data state
  const [resultsData, setResultsData] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  


  // Add cache to prevent excessive API calls
  const [dataCache, setDataCache] = useState({
    profile: null,
    history: null,
    certificates: null,
    results: null,
    lastFetch: null
  });

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  const isCacheValid = (type) => {
    const cache = dataCache[type];
    const lastFetch = dataCache.lastFetch?.[type];
    return cache && lastFetch && (Date.now() - lastFetch) < CACHE_DURATION;
  };





  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Check URL parameters for tab
      const tab = searchParams.get('tab');
      if (tab === 'certificates') {
        setActiveMenu('ใบประกาศนียบัตร');
      } else if (tab === 'submissions') {
        setActiveMenu('ผลการตัดสิน');
      } else if (tab === 'profile') {
        setActiveMenu('โปรไฟล์');
      } else if (tab === 'settings') {
        setActiveMenu('การตั้งค่า');
      }

      // แสดงข้อมูลจาก localStorage ทันทีก่อน
      if (user) {
        console.log('📋 Setting data from localStorage:', user);
        setProfileData({
          firstName: user.first_name || user.firstName || '',
          lastName: user.last_name || user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          organization: user.organization || '',
          educationLevel: user.role || '',
          prefix: '',
          profileImage: user.profile_image || user.profileImage || ''
        });
      }
      
      // Load initial data based on active menu
      loadPageData();
      
      // Load user certificates from localStorage
      const savedCertificates = localStorage.getItem('user_certificates');
      if (savedCertificates) {
        setUserCertificates(JSON.parse(savedCertificates));
      }
      
      // Log current user data for debugging
      console.log('🔍 Current user from localStorage:', user);
    }
  }, [user, navigate, activeMenu, searchParams]);

  const loadPageData = async () => {
    // Only load data once per session to avoid rate limiting
    const sessionKey = `data_loaded_${activeMenu}`;
    if (sessionStorage.getItem(sessionKey)) {
      console.log(`📋 Using cached data for ${activeMenu}`);
      return;
    }

    switch (activeMenu) {
      case 'โปรไฟล์':
        await fetchProfileData();
        break;
      case 'ใบประกาศนียบัตร':
        await fetchCertificateData();
        break;
      case 'ผลการตัดสิน':
        await fetchResultsData();
        break;
      default:
        break;
    }

    // Mark as loaded for this session
    sessionStorage.setItem(sessionKey, 'true');
  };

  // API Functions using axios
  const fetchProfileData = async () => {
    setProfileLoading(true);
    setError('');
    
    try {
      // ใช้ข้อมูลจาก localStorage ก่อนในขณะที่รอ API
      if (user) {
        console.log('📋 Using localStorage data temporarily:', user);
        setProfileData({
          firstName: user.first_name || user.firstName || '',
          lastName: user.last_name || user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          organization: user.organization || '',
          educationLevel: user.role || '',
          prefix: '',
          profileImage: user.profile_image || ''
        });
      }

      console.log('🔍 Fetching profile data from API...');
      
      // ลองเรียก API หลายทาง
      let response;
      try {
        response = await api.get('/users/profile');
      } catch (error) {
        console.log('❌ /users/profile failed, trying /auth/profile...');
        response = await api.get('/auth/profile');
      }
      
      console.log('✅ Profile data received:', response.data);
      
      if (response.data.success) {
        // Map API response to frontend state
        const apiData = response.data.data || response.data;
        setProfileData({
          firstName: apiData.first_name || apiData.firstName || '',
          lastName: apiData.last_name || apiData.lastName || '',
          email: apiData.email || '',
          phone: apiData.phone || '',
          organization: apiData.organization || '',
          educationLevel: apiData.role || apiData.educationLevel || '',
          prefix: apiData.prefix || '',
          profileImage: apiData.profile_image || apiData.profileImage || ''
        });
      } else {
        console.log('⚠️ API returned success:false, keeping localStorage data');
      }
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      if (error.response?.status === 429) {
        setError('⚠️ Too many requests - กำลังใช้ข้อมูลที่มีอยู่');
      } else if (error.response?.status === 401) {
        setError('⚠️ Session หมดอายุ - กรุณาล็อกอินใหม่');
      } else {
        console.log('📋 API failed, using localStorage data only');
        // ถ้า API ล้มเหลว ให้ใช้ข้อมูลจาก localStorage
      }
    } finally {
      setProfileLoading(false);
    }
  };



  const fetchCertificateData = async () => {
    setCertificateLoading(true);
    try {
      console.log('🔍 Fetching certificate data...');
      
      const response = await api.get('/users/certificates');
      console.log('✅ Certificate data received:', response.data);
      
      if (response.data.success) {
        setCertificateData(response.data.data);
      }
    } catch (error) {
      console.error('❌ Error fetching certificate:', error);
    } finally {
      setCertificateLoading(false);
    }
  };

  const fetchResultsData = async () => {
    setResultsLoading(true);
    try {
      console.log('🔍 Fetching results data...');
      
      const response = await api.get('/users/results');
      console.log('✅ Results data received:', response.data);
      
      if (response.data.success) {
        setResultsData(response.data.data);
      }
    } catch (error) {
      console.error('❌ Error fetching results:', error);
    } finally {
      setResultsLoading(false);
    }
  };

  const downloadCertificate = async () => {
    try {
      console.log('📥 Starting certificate download...');
      
      const response = await api.get('/users/certificates/download', {
        responseType: 'blob'
      });
      
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${user.email}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      console.log('✅ Certificate downloaded successfully');
    } catch (error) {
      console.error('❌ Error downloading certificate:', error);
      setError(`Download failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Clear previous messages
      setError('');
      setSuccess('');
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('ขนาดไฟล์ต้องไม่เกิน 10MB');
        return;
      }
      
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfileImage = async () => {
    if (!profileImage) return;
    
    setImageUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('profileImage', profileImage);
      
      console.log('📤 Uploading profile image...');
      const response = await api.post('/users/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        console.log('✅ Profile image uploaded successfully');
        setProfileData(prev => ({
          ...prev,
          profileImage: response.data.data.profileImage
        }));
        setProfileImage(null);
        setImagePreview(null);
        setSuccess('อัปโหลดรูปภาพสำเร็จ');
      }
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      setError(`อัปโหลดรูปภาพไม่สำเร็จ: ${error.response?.data?.message || error.message}`);
    } finally {
      setImageUploading(false);
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditProfileData({
      firstName: profileData.firstName || user?.first_name || '',
      lastName: profileData.lastName || user?.last_name || '',
      phone: profileData.phone || user?.phone || '',
      organization: profileData.organization || user?.organization || ''
    });
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditProfileData({});
    setError('');
    setSuccess('');
  };

  const handleEditChange = (field, value) => {
    setEditProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    setUpdateLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('📤 Updating profile data:', editProfileData);
      
      const response = await api.put('/users/profile', {
        first_name: editProfileData.firstName,
        last_name: editProfileData.lastName,
        phone: editProfileData.phone,
        organization: editProfileData.organization
      });

      if (response.data.success) {
        console.log('✅ Profile updated successfully');
        
        // Update local state
        setProfileData(prev => ({
          ...prev,
          firstName: editProfileData.firstName,
          lastName: editProfileData.lastName,
          phone: editProfileData.phone,
          organization: editProfileData.organization
        }));

        // Update localStorage user data if needed
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            first_name: editProfileData.firstName,
            last_name: editProfileData.lastName,
            phone: editProfileData.phone,
            organization: editProfileData.organization
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        setIsEditing(false);
        setSuccess('อัปเดตข้อมูลสำเร็จ');
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      setError(`อัปเดตข้อมูลไม่สำเร็จ: ${error.response?.data?.message || error.message}`);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('รหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }
    setLoading(true);
    try {
      const result = await authService.changePassword({ currentPassword, newPassword });
      if (result.success) {
        setSuccess('เปลี่ยนรหัสผ่านสำเร็จ');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(result.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7fa] pb-20">
      {/* My account header with gradient */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-[100px] pb-16"
        style={{
          background: 'linear-gradient(135deg, #B3FFD1 0%, #BFB4EE 100%)'
        }}
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center pt-8"
        >
          <h1 className="text-4xl font-bold text-[#533193]">My account</h1>
        </motion.div>
      </motion.div>
      
      {/* Main content */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-5xl mx-auto px-4 -mt-8 relative z-10 mb-16"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg flex overflow-hidden border border-blue-200 min-h-[600px]"
        >
          {/* เมนูซ้าย */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="w-64 border-r border-blue-200 p-6 bg-white"
          >
            <ul className="space-y-3">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  >
                    <motion.div
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                        activeMenu === item.label
                            ? 'bg-[#8B7DC3] text-white font-medium' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-[#533193]'
                      }`}
                      onClick={() => setActiveMenu(item.label)}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="text-sm">{item.label}</span>
                    </motion.div>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          {/* เนื้อหาขวา */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex-1 p-8 overflow-y-auto flex flex-col"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMenu}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeMenu === 'การตั้งค่า' && (
                  <>
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b">
                      <Settings className="w-6 h-6 text-[#533193]" />
                      <h2 className="text-2xl font-semibold text-[#533193]">การตั้งค่า</h2>
                    </div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="mb-8"
                    >
                      <h3 className="text-lg font-semibold mb-6 text-gray-800">เปลี่ยนรหัสผ่าน</h3>
                      <form className="max-w-lg space-y-5" onSubmit={handleChangePassword}>
                        
                        {/* Current Password */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                        >
                          <label className="block text-sm font-medium mb-2 text-gray-700">รหัสผ่านปัจจุบัน</label>
                          <div className="relative">
                            <Input
                              type={showPasswords.current ? "text" : "password"}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all"
                              value={currentPassword}
                              onChange={e => setCurrentPassword(e.target.value)}
                              placeholder="••••••••••••"
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                            >
                              {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </motion.button>
                          </div>
                        </motion.div>

                        {/* New Password */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.4 }}
                        >
                          <label className="block text-sm font-medium mb-2 text-gray-700">รหัสผ่านใหม่</label>
                          <div className="relative">
                            <Input
                              type={showPasswords.new ? "text" : "password"}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all"
                              value={newPassword}
                              onChange={e => setNewPassword(e.target.value)}
                              placeholder="••••••••••••"
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                            >
                              {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </motion.button>
                          </div>
                        </motion.div>

                        {/* Confirm Password */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                        >
                          <label className="block text-sm font-medium mb-2 text-gray-700">ยืนยันรหัสผ่านใหม่</label>
                          <div className="relative">
                            <Input
                              type={showPasswords.confirm ? "text" : "password"}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all"
                              value={confirmPassword}
                              onChange={e => setConfirmPassword(e.target.value)}
                              placeholder="••••••••••••"
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                            >
                              {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </motion.button>
                          </div>
                        </motion.div>

                        {/* Error/Success Messages */}
                        <AnimatePresence>
                          {error && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200"
                            >
                              <AlertCircle className="w-4 h-4" />
                              {error}
                            </motion.div>
                          )}
                          {success && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200"
                            >
                              <Check className="w-4 h-4" />
                              {success}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.6 }}
                          className="flex justify-end pt-4"
                        >
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="bg-[#BFB4EE] text-[#533193] px-8 py-2.5 rounded-lg font-medium hover:bg-[#B3A7E8] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                          >
                            {loading ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-[#533193] border-t-transparent rounded-full animate-spin"></div>
                                บันทึก
                              </div>
                            ) : (
                              'บันทึก'
                            )}
                          </motion.button>
                        </motion.div>
                      </form>
                    </motion.div>

                    {/* Logout Section */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                      className="border-t pt-6"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-[#533193] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#533193]/90 transition-all shadow-sm"
                      >
                        <LogOut className="w-5 h-5" />
                        ออกบัญชี
                      </motion.button>
                    </motion.div>
                  </>
                )}

                {activeMenu === 'ใบประกาศนียบัตร' && (
                  <>
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b">
                      <FileText className="w-6 h-6 text-[#533193]" />
                      <h2 className="text-2xl font-semibold text-[#533193]">ใบประกาศนียบัตร</h2>
                    </div>

                    {certificateLoading ? (
                      <div className="text-center py-16">
                        <div className="w-8 h-8 border-2 border-[#533193] border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-gray-500 mt-2">กำลังโหลดใบประกาศนียบัตร...</p>
                      </div>
                    ) : userCertificates.length > 0 ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {userCertificates.map((certificate, index) => (
                            <motion.div
                              key={certificate.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 * index }}
                              className="bg-white rounded-lg shadow-lg overflow-hidden"
                            >
                              {/* Certificate Preview */}
                              <div className="relative h-48 bg-gradient-to-br from-[#533193] to-[#8B7DC3] flex items-center justify-center">
                                {certificate.imageData ? (
                                  <img
                                    src={certificate.imageData}
                                    alt={certificate.recipientName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="text-center text-white">
                                    <FileText className="w-12 h-12 mx-auto mb-2" />
                                    <h3 className="text-lg font-semibold">{certificate.eventName}</h3>
                                    <p className="text-sm opacity-75">{certificate.recipientName}</p>
                                  </div>
                                )}
                              </div>

                              {/* Certificate Info */}
                              <div className="p-4">
                                <h3 className="font-semibold text-gray-800 mb-2">{certificate.eventName}</h3>
                                <p className="text-sm text-gray-600 mb-1">สำหรับ: {certificate.recipientName}</p>
                                <p className="text-xs text-gray-500 mb-3">วันที่: {certificate.date}</p>
                                
                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                      if (certificate.imageData) {
                                        const link = document.createElement('a');
                                        link.download = `certificate-${certificate.recipientName.replace(/\s+/g, '-')}.png`;
                                        link.href = certificate.imageData;
                                        link.click();
                                      }
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#BFB4EE] text-[#533193] px-3 py-2 rounded-lg font-medium hover:bg-[#B3A7E8] transition-all text-sm"
                                  >
                                    <Download className="w-4 h-4" />
                                    ดาวน์โหลด
                                  </motion.button>

                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                      // View certificate in full screen
                                      if (certificate.imageData) {
                                        window.open(certificate.imageData, '_blank');
                                      }
                                    }}
                                    className="flex items-center justify-center gap-2 bg-[#8B7DC3] text-white px-3 py-2 rounded-lg font-medium hover:bg-[#7B6DB8] transition-all text-sm"
                                  >
                                    <Eye className="w-4 h-4" />
                                    ดู
                                  </motion.button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="text-center py-16"
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                          <FileText className="w-12 h-12 text-gray-400" />
                        </motion.div>
                        
                        <motion.h3 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.5 }}
                          className="text-xl font-semibold text-gray-800 mb-2"
                        >
                          ยังไม่มีใบประกาศนียบัตร
                        </motion.h3>
                        
                        <motion.p 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.6 }}
                          className="text-gray-600 mb-6"
                        >
                          ใบประกาศนียบัตรจะพร้อมใช้งานหลังจากเข้าร่วมงานเสร็จสิ้น
                        </motion.p>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            // Navigate to templates page
                            window.location.href = '/templates';
                          }}
                          className="flex items-center gap-2 bg-[#533193] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#4A2D7A] transition-all shadow-sm mx-auto"
                        >
                          <FileText className="w-4 h-4" />
                          ไปที่เทมเพลตใบประกาศ
                        </motion.button>
                      </motion.div>
                    )}
                  </>
                )}

                {activeMenu === 'โปรไฟล์' && (
                  <>
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b">
                      <User className="w-6 h-6 text-[#533193]" />
                      <h2 className="text-2xl font-semibold text-[#533193]">โปรไฟล์</h2>
                    </div>
                    
                    {/* Profile Header */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="flex items-center gap-4 mb-8 bg-white rounded-lg p-4 border border-gray-200"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                          <img 
                            src={
                              imagePreview || 
                              profileData.profileImage || 
                              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            } 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          title="เปลี่ยนรูปโปรไฟล์"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#533193] rounded-full flex items-center justify-center cursor-pointer">
                          <Edit className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {profileData.firstName || profileData.lastName 
                            ? `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim()
                            : user?.first_name || user?.last_name
                              ? `${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`.trim()
                              : user?.name || 'ไม่พบข้อมูลชื่อ'
                          }
                        </h3>
                        <p className="text-gray-600">
                          {profileData.email || user?.email || 'ไม่พบข้อมูลอีเมล'}
                        </p>
                      </div>
                      
                      {/* Upload/Cancel buttons for new image */}
                      {profileImage && !isEditing && (
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={uploadProfileImage}
                            disabled={imageUploading}
                            className="px-3 py-2 bg-[#BFB4EE] text-[#533193] rounded-lg hover:bg-[#B3A7E8] transition-colors text-sm disabled:opacity-50"
                          >
                            {imageUploading ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-[#533193] border-t-transparent rounded-full animate-spin"></div>
                                อัปโหลด
                              </div>
                            ) : (
                              'บันทึก'
                            )}
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setProfileImage(null);
                              setImagePreview(null);
                            }}
                            disabled={imageUploading}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
                          >
                            ยกเลิก
                          </motion.button>
                        </div>
                      )}
                    </motion.div>

                    {/* Personal Information */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="bg-white rounded-lg p-6 border border-gray-200 mb-6"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-lg font-semibold text-gray-800">ข้อมูลส่วนตัว</h4>
                        
                        {!isEditing ? (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleStartEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                          >
                            <Edit className="w-4 h-4" />
                            แก้ไข
                          </motion.button>
                        ) : (
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleSaveProfile}
                              disabled={updateLoading}
                              className="flex items-center gap-2 px-4 py-2 bg-[#BFB4EE] text-[#533193] rounded-lg hover:bg-[#B3A7E8] transition-colors text-sm disabled:opacity-50"
                            >
                              {updateLoading ? (
                                <div className="w-4 h-4 border-2 border-[#533193] border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                              บันทึก
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleCancelEdit}
                              disabled={updateLoading}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
                            >
                              ยกเลิก
                            </motion.button>
                          </div>
                        )}
                      </div>
                      
                      {profileLoading ? (
                        <div className="text-center py-8">
                          <div className="w-8 h-8 border-2 border-[#533193] border-t-transparent rounded-full animate-spin mx-auto"></div>
                          <p className="text-gray-500 mt-2">กำลังโหลดข้อมูล...</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Show API errors */}
                          {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                              <p className="text-red-600 text-sm">{error}</p>
                            </div>
                          )}
                          
                          {success && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                              <p className="text-green-600 text-sm">{success}</p>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 gap-8">
                            <div>
                              <label className="text-sm text-gray-500 block mb-1">ชื่อ / First Name</label>
                              {!isEditing ? (
                                <p className="text-gray-800 font-medium">
                                  {profileData.firstName || user?.first_name || user?.firstName || 'ไม่พบข้อมูล'}
                                </p>
                              ) : (
                                <Input
                                  type="text"
                                  value={editProfileData.firstName || ''}
                                  onChange={(e) => handleEditChange('firstName', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all"
                                  placeholder="กรอกชื่อ"
                                />
                              )}
                            </div>
                            <div>
                              <label className="text-sm text-gray-500 block mb-1">นามสกุล / Last Name</label>
                              {!isEditing ? (
                                <p className="text-gray-800 font-medium">
                                  {profileData.lastName || user?.last_name || user?.lastName || 'ไม่พบข้อมูล'}
                                </p>
                              ) : (
                                <Input
                                  type="text"
                                  value={editProfileData.lastName || ''}
                                  onChange={(e) => handleEditChange('lastName', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all"
                                  placeholder="กรอกนามสกุล"
                                />
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-8">
                            <div>
                              <label className="text-sm text-gray-500 block mb-1">เบอร์โทรศัพท์ / Phone</label>
                              {!isEditing ? (
                                <p className="text-gray-800 font-medium">
                                  {profileData.phone || user?.phone || 'ไม่พบข้อมูล'}
                                </p>
                              ) : (
                                <Input
                                  type="tel"
                                  value={editProfileData.phone || ''}
                                  onChange={(e) => handleEditChange('phone', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all"
                                  placeholder="กรอกเบอร์โทรศัพท์"
                                />
                              )}
                            </div>
                            <div>
                              <label className="text-sm text-gray-500 block mb-1">อีเมล / Email</label>
                              <p className="text-gray-800 font-medium text-gray-500">
                                {profileData.email || user?.email || 'ไม่พบข้อมูล'}
                                {!isEditing && <span className="text-xs block text-gray-400">(ไม่สามารถแก้ไขได้)</span>}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-8">
                            <div>
                              <label className="text-sm text-gray-500 block mb-1">หน่วยงาน/องค์กร / Organization</label>
                              {!isEditing ? (
                                <p className="text-gray-800 font-medium">
                                  {profileData.organization || user?.organization || 'ไม่พบข้อมูล'}
                                </p>
                              ) : (
                                <Input
                                  type="text"
                                  value={editProfileData.organization || ''}
                                  onChange={(e) => handleEditChange('organization', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all"
                                  placeholder="กรอกชื่อหน่วยงาน/องค์กร"
                                />
                              )}
                            </div>
                            <div>
                              <label className="text-sm text-gray-500 block mb-1">บทบาท / Role</label>
                              <p className="text-gray-800 font-medium text-gray-500">
                                {profileData.educationLevel || user?.role || 'ไม่พบข้อมูล'}
                                {!isEditing && <span className="text-xs block text-gray-400">(ไม่สามารถแก้ไขได้)</span>}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>


                  </>
                )}

                {activeMenu === 'ผลการตัดสิน' && (
                  <>
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b">
                      <Trophy className="w-6 h-6 text-[#533193]" />
                      <h2 className="text-2xl font-semibold text-[#533193]">ผลการตัดสิน</h2>
                    </div>
                    
                    {resultsLoading ? (
                      <div className="text-center py-16">
                        <div className="w-8 h-8 border-2 border-[#533193] border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-gray-500 mt-2">กำลังโหลดผลการตัดสิน...</p>
                      </div>
                    ) : resultsData.length > 0 ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="space-y-4"
                      >
                        {resultsData.map((result, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                            className="bg-white rounded-lg p-6 border border-gray-200"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                result.status === 'approved' 
                                  ? 'bg-green-100 text-green-600' 
                                  : result.status === 'rejected'
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-yellow-100 text-yellow-600'
                              }`}>
                                <Trophy className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">{result.title}</h3>
                                <p className="text-gray-600 text-sm">{result.category}</p>
                                <p className={`text-sm font-medium ${
                                  result.status === 'approved' 
                                    ? 'text-green-600' 
                                    : result.status === 'rejected'
                                    ? 'text-red-600'
                                    : 'text-yellow-600'
                                }`}>
                                  สถานะ: {result.statusText}
                                </p>
                              </div>
                              {result.score && (
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-[#533193]">{result.score}</p>
                                  <p className="text-sm text-gray-500">คะแนน</p>
                                </div>
                              )}
                            </div>
                            {result.feedback && (
                              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">{result.feedback}</p>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="text-center py-16"
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                          <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                        
                        <motion.h3 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.5 }}
                          className="text-xl font-semibold text-gray-800 mb-2"
                        >
                          ผลงานของคุณกำลังดำเนินการตัดสิน
                        </motion.h3>
                        
                        <motion.p 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.6 }}
                          className="text-gray-600"
                        >
                          ติดตามผลการตัดสินของงาน เร็วๆนี้
                        </motion.p>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Account; 