// API Service สำหรับจัดการข้อมูลผู้บรรยาย
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendsacit-42f532a9097c.herokuapp.com';

class SpeakersAPI {
  static async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP Error: ${response.status}`);
    }
    
    if (!data.success) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  }

  // ดึงรายการผู้บรรยายทั้งหมด
  static async getAll(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/api/speakers${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching speakers:', error);
      throw error;
    }
  }

  // ดึงข้อมูลผู้บรรยายตาม ID
  static async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/speakers/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching speaker:', error);
      throw error;
    }
  }

  // สร้างผู้บรรยายใหม่
  static async create(speakerData) {
    try {
      const formData = new FormData();
      
      // เพิ่มข้อมูลชื่อ
      if (speakerData.name) {
        formData.append('name', speakerData.name.trim());
      }
      
      // เพิ่มไฟล์รูปภาพ (ถ้ามี)
      if (speakerData.photoFile && speakerData.photoFile instanceof File) {
        formData.append('photo', speakerData.photoFile);
      }
      
      // เพิ่มไฟล์ PDF (ถ้ามี)
      if (speakerData.pdfFile && speakerData.pdfFile instanceof File) {
        formData.append('pdf', speakerData.pdfFile);
      }
      
      const response = await fetch(`${API_BASE_URL}/api/speakers`, {
        method: 'POST',
        body: formData,
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error creating speaker:', error);
      throw error;
    }
  }

  // อัปเดตข้อมูลผู้บรรยาย
  static async update(id, speakerData) {
    try {
      const formData = new FormData();
      
      // เพิ่มข้อมูลชื่อ (ถ้ามี)
      if (speakerData.name) {
        formData.append('name', speakerData.name.trim());
      }
      
      // เพิ่มไฟล์รูปภาพใหม่ (ถ้ามี)
      if (speakerData.photoFile && speakerData.photoFile instanceof File) {
        formData.append('photo', speakerData.photoFile);
      }
      
      // เพิ่มไฟล์ PDF ใหม่ (ถ้ามี)
      if (speakerData.pdfFile && speakerData.pdfFile instanceof File) {
        formData.append('pdf', speakerData.pdfFile);
      }
      
      const response = await fetch(`${API_BASE_URL}/api/speakers/${id}`, {
        method: 'PUT',
        body: formData,
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error updating speaker:', error);
      throw error;
    }
  }

  // ลบผู้บรรยาย (soft delete)
  static async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/speakers/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting speaker:', error);
      throw error;
    }
  }

  // ลบผู้บรรยายอย่างถาวร
  static async permanentDelete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/speakers/${id}/permanent`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error permanently deleting speaker:', error);
      throw error;
    }
  }

  // Utility functions
  static validateImageFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('รูปภาพต้องเป็นไฟล์ JPEG, PNG, GIF หรือ WebP เท่านั้น');
    }
    
    if (file.size > maxSize) {
      throw new Error('รูปภาพมีขนาดใหญ่เกินไป (สูงสุด 10MB)');
    }
    
    return true;
  }

  static validatePdfFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (file.type !== 'application/pdf') {
      throw new Error('ต้องเป็นไฟล์ PDF เท่านั้น');
    }
    
    if (file.size > maxSize) {
      throw new Error('ไฟล์ PDF มีขนาดใหญ่เกินไป (สูงสุด 10MB)');
    }
    
    return true;
  }

  static formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export default SpeakersAPI;