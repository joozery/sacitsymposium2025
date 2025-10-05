import { api } from './api';

// Authentication Service
class AuthService {
  
  // ลงทะเบียนผู้ใช้ใหม่
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      // Save token and user data to localStorage
      if (response.data.success && response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return {
        success: true,
        data: response.data.data,
        message: 'ลงทะเบียนสำเร็จ'
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'เกิดข้อผิดพลาดในการลงทะเบียน',
        errors: error.response?.data?.errors || null
      };
    }
  }

  // เข้าสู่ระบบ
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Save token and user data to localStorage
      if (response.data.success && response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return {
        success: true,
        data: response.data.data,
        message: 'เข้าสู่ระบบสำเร็จ'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      };
    }
  }

  // ออกจากระบบ
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return {
      success: true,
      message: 'ออกจากระบบสำเร็จ'
    };
  }

  // ดึงข้อมูลผู้ใช้ปัจจุบัน
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // ตรวจสอบว่าผู้ใช้เข้าสู่ระบบอยู่หรือไม่
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // ดึง token จาก localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // ดึงข้อมูลโปรไฟล์ผู้ใช้
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้'
      };
    }
  }

  // อัปเดตโปรไฟล์ผู้ใช้
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      
      // Update user data in localStorage
      if (response.data.success && response.data.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return {
        success: true,
        data: response.data.data,
        message: 'อัปเดตโปรไฟล์สำเร็จ'
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์'
      };
    }
  }

  // เปลี่ยนรหัสผ่าน
  async changePassword(passwordData) {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return {
        success: true,
        message: 'เปลี่ยนรหัสผ่านสำเร็จ'
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน'
      };
    }
  }

  // ตรวจสอบ token ว่ายังใช้ได้อยู่หรือไม่
  async verifyToken() {
    try {
      const response = await api.get('/auth/verify');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      // Token expired or invalid
      this.logout();
      return {
        success: false,
        message: 'Session หมดอายุ กรุณาเข้าสู่ระบบใหม่'
      };
    }
  }
}

// Export single instance
export default new AuthService(); 