import { api } from './api';
import { mockGeneralRegistrations, mockApiDelay, mockApiError } from './mockData';

// Registration Service
class RegistrationService {
  
  // สร้างการลงทะเบียนใหม่
  async createRegistration(registrationData) {
    try {
      const response = await api.post('/registrations', registrationData);
      return {
        success: true,
        data: response.data,
        message: 'ลงทะเบียนสำเร็จ'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'เกิดข้อผิดพลาดในการลงทะเบียน',
        errors: error.response?.data?.errors || null
      };
    }
  }

  // ดึงข้อมูลการลงทะเบียนของผู้ใช้
  async getUserRegistrations() {
    try {
      const response = await api.get('/registrations/user');
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Get user registrations error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'ไม่สามารถดึงข้อมูลการลงทะเบียนได้'
      };
    }
  }

  // ดึงข้อมูลการลงทะเบียนตาม ID
  async getRegistrationById(id) {
    try {
      const response = await api.get(`/registrations/${id}`);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Get registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'ไม่สามารถดึงข้อมูลการลงทะเบียนได้'
      };
    }
  }

  // อัปเดตข้อมูลการลงทะเบียน
  async updateRegistration(id, updateData) {
    try {
      const response = await api.put(`/registrations/${id}`, updateData);
      return {
        success: true,
        data: response.data,
        message: 'อัปเดตข้อมูลสำเร็จ'
      };
    } catch (error) {
      console.error('Update registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล'
      };
    }
  }

  // อัปโหลดไฟล์สำหรับงานวิจัย
  async uploadResearchFile(file, registrationId) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('purpose', 'research_document');
      formData.append('registration_id', registrationId);

      const response = await api.post('/uploads/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return {
        success: true,
        data: response.data.data,
        message: 'อัปโหลดไฟล์สำเร็จ'
      };
    } catch (error) {
      console.error('File upload error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์'
      };
    }
  }

  // อัปโหลดรูปภาพสำหรับผลงานสร้างสรรค์
  async uploadCreativeImage(file, registrationId) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('purpose', 'creative_image');
      formData.append('registration_id', registrationId);

      const response = await api.post('/uploads/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return {
        success: true,
        data: response.data.data,
        message: 'อัปโหลดรูปภาพสำเร็จ'
      };
    } catch (error) {
      console.error('Image upload error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ'
      };
    }
  }

  // ตรวจสอบสถานะการลงทะเบียน
  async checkRegistrationStatus(email) {
    try {
      const response = await api.get(`/registrations/check-status?email=${email}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Check status error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'ไม่สามารถตรวจสอบสถานะได้'
      };
    }
  }

  // ค้นหาการลงทะเบียนจากอีเมล
  async searchRegistrationByEmail(email) {
    try {
      const response = await api.get(`/registrations/search/${encodeURIComponent(email)}`);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Search registration by email error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'ไม่พบข้อมูลการลงทะเบียน'
      };
    }
  }

  // ดึงข้อมูลการลงทะเบียนทั่วไปตามปี
  async getGeneralRegistrations(year) {
    try {
      // Use correct API endpoint
      const response = await api.get('/attendees', { 
        params: { 
          year,
          type: 'general'
        } 
      });
      
      return {
        success: true,
        data: response.data.data || response.data || []
      };
    } catch (error) {
      console.error('Get general registrations error:', error);
      
      // Fallback to mock data if API is not available
      if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        console.log('API not available, using mock data');
        const mockData = mockGeneralRegistrations[year] || [];
        return {
          success: true,
          data: mockData
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'ไม่สามารถดึงข้อมูลการลงทะเบียนทั่วไปได้'
      };
    }
  }

  // ดึงข้อมูลการลงทะเบียนวิจัยตามปี
  async getResearchRegistrations(year) {
    try {
      const response = await api.get('/registrations', { 
        params: { 
          year,
          type: 'research'
        } 
      });
      
      return {
        success: true,
        data: response.data.data || response.data || []
      };
    } catch (error) {
      console.error('Get research registrations error:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'ไม่สามารถดึงข้อมูลการลงทะเบียนวิจัยได้'
      };
    }
  }

  // ดึงข้อมูลการลงทะเบียนสร้างสรรค์ตามปี
  async getCreativeRegistrations(year) {
    try {
      const response = await api.get('/registrations', { 
        params: { 
          year,
          type: 'creative'
        } 
      });
      
      return {
        success: true,
        data: response.data.data || response.data || []
      };
    } catch (error) {
      console.error('Get creative registrations error:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'ไม่สามารถดึงข้อมูลการลงทะเบียนสร้างสรรค์ได้'
      };
    }
  }

  // ดึงข้อมูลการลงทะเบียนทั้งหมดตามปี
  async getAllRegistrations(year) {
    try {
      const response = await api.get('/registrations', { 
        params: { year } 
      });
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Get all registrations error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'ไม่สามารถดึงข้อมูลการลงทะเบียนได้'
      };
    }
  }

  // อัปเดตสถานะเช็คอิน
  async updateCheckInStatus(registrationId, checkInData) {
    try {
      const response = await api.put(`/registrations/${registrationId}/checkin`, checkInData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'อัปเดตสถานะเช็คอินสำเร็จ'
      };
    } catch (error) {
      console.error('Update check-in status error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะเช็คอิน'
      };
    }
  }

  // ยกเลิกการเช็คอิน
  async cancelCheckIn(registrationId) {
    try {
      const response = await api.put(`/registrations/${registrationId}/checkin/cancel`);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'ยกเลิกการเช็คอินสำเร็จ'
      };
    } catch (error) {
      console.error('Cancel check-in error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'เกิดข้อผิดพลาดในการยกเลิกการเช็คอิน'
      };
    }
  }
}

// Export single instance
export default new RegistrationService(); 