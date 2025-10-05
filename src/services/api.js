import axios from 'axios';

// API Base URL - ใช้ environment variable หรือ fallback เป็น production URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://symposium.sacit.or.th/api';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor - Add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if needed
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Attendees API functions
export const attendeesAPI = {
  // Get all attendees by year and type
  getAttendees: async (year, type = null) => {
    try {
      const params = { year };
      if (type) params.type = type;
      const response = await api.get('/attendees', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendees:', error);
      throw error;
    }
  },

  // Get attendees by type (general, research, creative)
  getAttendeesByType: async (year, type, timestamp = null) => {
    try {
      const params = { year };
      if (timestamp) params._t = timestamp; // Cache-busting parameter
      const response = await api.get(`/attendees/${type}`, { params });
      return response.data; // Backend returns { success: true, data: [...], count: number }
    } catch (error) {
      console.error(`Error fetching ${type} attendees:`, error);
      throw error;
    }
  },

  // Get attendee by ID
  getAttendeeById: async (id) => {
    try {
      const response = await api.get(`/attendees/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendee:', error);
      throw error;
    }
  },



  // Export attendees data
  exportAttendees: async (year, type = null) => {
    try {
      const params = { year };
      if (type) params.type = type;
      const response = await api.get('/attendees/export', { 
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting attendees:', error);
      throw error;
    }
  },

  // Get attendees statistics
  getAttendeesStats: async (year) => {
    try {
      const response = await api.get('/attendees/stats', { params: { year } });
      return response.data.data; // Return the data property from backend response
    } catch (error) {
      console.error('Error fetching attendees stats:', error);
      throw error;
    }
  },

  // Search attendees
  searchAttendees: async (year, searchTerm, filters = {}) => {
    try {
      const params = { year, search: searchTerm, ...filters };
      const response = await api.get('/attendees/search', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching attendees:', error);
      throw error;
    }
  },

  // Get registrations data (which includes check-in status)
  getRegistrations: async (year, type = null) => {
    try {
      const params = { year };
      if (type) params.type = type;
      const response = await api.get('/registrations', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching registrations:', error);
      throw error;
    }
  },

  // Update check-in status
  updateCheckInStatus: async (registrationId, checkInData) => {
    try {
      const response = await api.put(`/registrations/${registrationId}/checkin`, checkInData);
      return response.data;
    } catch (error) {
      console.error('Error updating check-in status:', error);
      throw error;
    }
  }
};

// Exhibitions API functions
export const exhibitionsAPI = {
  // Get all exhibitions
  getExhibitions: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.category_id) params.append('category_id', filters.category_id);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/exhibitions?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exhibitions:', error);
      throw error;
    }
  },

  // Get single exhibition by ID
  getExhibition: async (id) => {
    try {
      const response = await api.get(`/exhibitions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exhibition:', error);
      throw error;
    }
  },

  // Create new exhibition
  createExhibition: async (exhibitionData) => {
    try {
      const formData = new FormData();
      
      // Add exhibition name
      if (exhibitionData.name) {
        formData.append('name', exhibitionData.name.trim());
      }
      
      // Add exhibition position
      if (exhibitionData.position) {
        formData.append('position', exhibitionData.position.trim());
      }
      

      
      // Add image file if exists
      if (exhibitionData.imageFile && exhibitionData.imageFile instanceof File) {
        formData.append('image', exhibitionData.imageFile);
      }
      
      // Add PDF file if exists
      if (exhibitionData.pdfFile && exhibitionData.pdfFile instanceof File) {
        formData.append('pdf', exhibitionData.pdfFile);
      }
      
      const response = await api.post('/exhibitions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating exhibition:', error);
      throw error;
    }
  },

  // Update exhibition
  updateExhibition: async (id, exhibitionData) => {
    try {
      const formData = new FormData();
      
      // Add exhibition name if provided
      if (exhibitionData.name) {
        formData.append('name', exhibitionData.name.trim());
      }
      
      // Add exhibition position if provided
      if (exhibitionData.position !== undefined) {
        formData.append('position', exhibitionData.position.trim());
      }
      

      
      // Add new image file if provided
      if (exhibitionData.imageFile && exhibitionData.imageFile instanceof File) {
        formData.append('image', exhibitionData.imageFile);
      }
      
      // Add new PDF file if provided
      if (exhibitionData.pdfFile && exhibitionData.pdfFile instanceof File) {
        formData.append('pdf', exhibitionData.pdfFile);
      }
      
      const response = await api.put(`/exhibitions/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating exhibition:', error);
      throw error;
    }
  },

  // Delete exhibition
  deleteExhibition: async (id) => {
    try {
      const response = await api.delete(`/exhibitions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting exhibition:', error);
      throw error;
    }
  },

  // Get exhibition categories
  getCategories: async () => {
    try {
      const response = await api.get('/exhibitions/categories/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Upload file
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Upload multiple files
  uploadMultipleFiles: async (files) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const response = await api.post('/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading multiple files:', error);
      throw error;
    }
  },

  // Delete file from S3
  deleteFile: async (fileKey) => {
    try {
      const response = await api.delete(`/upload/delete?key=${encodeURIComponent(fileKey)}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};

// Speakers API functions
export const speakersAPI = {
  // Get all speakers
  getSpeakers: async (params = {}) => {
    try {
      const response = await api.get('/speakers', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching speakers:', error);
      throw error;
    }
  },

  // Get speaker by ID
  getSpeaker: async (id) => {
    try {
      const response = await api.get(`/speakers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching speaker:', error);
      throw error;
    }
  },

  // Create new speaker with file uploads
  createSpeaker: async (speakerData) => {
    try {
      const formData = new FormData();
      
      // Add speaker name
      if (speakerData.name) {
        formData.append('name', speakerData.name.trim());
      }
      
      // Add speaker position
      if (speakerData.position) {
        formData.append('position', speakerData.position.trim());
      }
      
      // Add photo file if exists
      if (speakerData.photoFile && speakerData.photoFile instanceof File) {
        formData.append('photo', speakerData.photoFile);
      }
      
      // Add PDF file if exists
      if (speakerData.pdfFile && speakerData.pdfFile instanceof File) {
        formData.append('pdf', speakerData.pdfFile);
      }
      
      const response = await api.post('/speakers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating speaker:', error);
      throw error;
    }
  },

  // Update speaker
  updateSpeaker: async (id, speakerData) => {
    try {
      const formData = new FormData();
      
      // Add speaker name if provided
      if (speakerData.name) {
        formData.append('name', speakerData.name.trim());
      }
      
      // Add speaker position if provided
      if (speakerData.position !== undefined) {
        formData.append('position', speakerData.position.trim());
      }
      
      // Add new photo file if provided
      if (speakerData.photoFile && speakerData.photoFile instanceof File) {
        formData.append('photo', speakerData.photoFile);
      }
      
      // Add new PDF file if provided
      if (speakerData.pdfFile && speakerData.pdfFile instanceof File) {
        formData.append('pdf', speakerData.pdfFile);
      }
      
      const response = await api.put(`/speakers/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating speaker:', error);
      throw error;
    }
  },

  // Delete speaker (soft delete)
  deleteSpeaker: async (id) => {
    try {
      const response = await api.delete(`/speakers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting speaker:', error);
      throw error;
    }
  },

  // Permanently delete speaker
  permanentDeleteSpeaker: async (id) => {
    try {
      const response = await api.delete(`/speakers/${id}/permanent`);
      return response.data;
    } catch (error) {
      console.error('Error permanently deleting speaker:', error);
      throw error;
    }
  },

  // File validation helpers
  validateImageFile: (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('รูปภาพต้องเป็นไฟล์ JPEG, PNG, GIF หรือ WebP เท่านั้น');
    }
    
    if (file.size > maxSize) {
      throw new Error('รูปภาพมีขนาดใหญ่เกินไป (สูงสุด 10MB)');
    }
    
    return true;
  },

  validatePdfFile: (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (file.type !== 'application/pdf') {
      throw new Error('ต้องเป็นไฟล์ PDF เท่านั้น');
    }
    
    if (file.size > maxSize) {
      throw new Error('ไฟล์ PDF มีขนาดใหญ่เกินไป (สูงสุด 10MB)');
    }
    
    return true;
  }
};

export default api; 