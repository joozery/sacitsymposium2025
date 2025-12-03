// exhibitionsAPI.js - Frontend API Client สำหรับ Exhibitions
// ใช้โครงสร้างเดียวกับ speakersAPI.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://backendsacit-42f532a9097c.herokuapp.com';

class ExhibitionsAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // ดึงรายการนิทรรศการทั้งหมด
  async getAll(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.status) queryParams.append('status', params.status);
      if (params.search) queryParams.append('search', params.search);
      
      const queryString = queryParams.toString();
      const url = `${this.baseURL}/api/exhibitions${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching exhibitions:', error);
      throw error;
    }
  }

  // ดึงข้อมูลนิทรรศการตาม ID
  async getById(id) {
    try {
      const response = await fetch(`${this.baseURL}/api/exhibitions/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('ไม่พบข้อมูลนิทรรศการ');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching exhibition:', error);
      throw error;
    }
  }

  // สร้างนิทรรศการใหม่
  async create(formData) {
    try {
      const response = await fetch(`${this.baseURL}/api/exhibitions`, {
        method: 'POST',
        body: formData, // ใช้ FormData สำหรับไฟล์
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'เกิดข้อผิดพลาดในการสร้างนิทรรศการ');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating exhibition:', error);
      throw error;
    }
  }

  // อัปเดตข้อมูลนิทรรศการ
  async update(id, formData) {
    try {
      const response = await fetch(`${this.baseURL}/api/exhibitions/${id}`, {
        method: 'PUT',
        body: formData, // ใช้ FormData สำหรับไฟล์
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'เกิดข้อผิดพลาดในการอัปเดตนิทรรศการ');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating exhibition:', error);
      throw error;
    }
  }

  // ลบนิทรรศการ (soft delete)
  async delete(id) {
    try {
      const response = await fetch(`${this.baseURL}/api/exhibitions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'เกิดข้อผิดพลาดในการลบนิทรรศการ');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting exhibition:', error);
      throw error;
    }
  }

  // ลบนิทรรศการอย่างถาวร
  async permanentDelete(id) {
    try {
      const response = await fetch(`${this.baseURL}/api/exhibitions/${id}/permanent`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'เกิดข้อผิดพลาดในการลบนิทรรศการอย่างถาวร');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error permanently deleting exhibition:', error);
      throw error;
    }
  }

  // Helper method สำหรับสร้าง FormData
  createFormData(data) {
    const formData = new FormData();
    
    // เพิ่มข้อมูลพื้นฐาน
    if (data.name) formData.append('name', data.name);
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    
    // เพิ่มไฟล์ (ถ้ามี)
    if (data.image) formData.append('image', data.image);
    if (data.pdf) formData.append('pdf', data.pdf);
    
    return formData;
  }

  // Helper method สำหรับตรวจสอบการเชื่อมต่อ
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }
}

// สร้าง instance เดียว
const exhibitionsAPI = new ExhibitionsAPI();

// Export ทั้ง class และ instance
export { ExhibitionsAPI };
export default exhibitionsAPI; 