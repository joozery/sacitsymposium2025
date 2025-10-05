const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://symposium.sacit.or.th/api';

// Helper function to add authorization headers if needed
const addHeaders = (options = {}) => {
  const headers = {
    ...options.headers
  };

  // Add auth token if available
  const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return {
    ...options,
    headers
  };
};

// Helper function for handling API responses
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } else {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  }
};

export const certificateService = {
  // Certificate Templates API
  
  /**
   * Get all certificate templates
   * @param {Object} filters - Query filters (status, type)
   * @returns {Promise<Object>} API response with templates array
   */
  getTemplates: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.type) queryParams.append('type', filters.type);
      
      const url = `${API_BASE_URL}/certificates/templates${queryParams.toString() ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        ...addHeaders()
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching certificate templates:', error);
      throw error;
    }
  },

  /**
   * Get specific certificate template by ID
   * @param {number} id - Template ID
   * @returns {Promise<Object>} API response with template data
   */
  getTemplate: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/certificates/templates/${id}`, {
        method: 'GET',
        ...addHeaders()
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching certificate template:', error);
      throw error;
    }
  },

  /**
   * Create new certificate template
   * @param {Object} templateData - Template data
   * @param {File} backgroundImage - Optional background image file
   * @returns {Promise<Object>} API response with created template
   */
  createTemplate: async (templateData, backgroundImage = null) => {
    try {
      if (backgroundImage) {
        // Use FormData for file uploads
        const formData = new FormData();
        
        // Add template data
        Object.keys(templateData).forEach(key => {
          if (templateData[key] !== undefined && templateData[key] !== null) {
            if (key === 'elements' && typeof templateData[key] === 'object') {
              formData.append(key, JSON.stringify(templateData[key]));
            } else {
              formData.append(key, templateData[key]);
            }
          }
        });

        formData.append('backgroundImage', backgroundImage);

        const response = await fetch(`${API_BASE_URL}/certificates/templates`, {
          method: 'POST',
          body: formData,
          // Don't set Content-Type header for FormData - let browser set it with boundary
          ...addHeaders()
        });
        
        return await handleResponse(response);
      } else {
        // Use JSON for data-only requests
        const response = await fetch(`${API_BASE_URL}/certificates/templates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...addHeaders().headers
          },
          body: JSON.stringify(templateData)
        });
        
        return await handleResponse(response);
      }
    } catch (error) {
      console.error('Error creating certificate template:', error);
      throw error;
    }
  },

  /**
   * Update certificate template
   * @param {number} id - Template ID
   * @param {Object} templateData - Updated template data
   * @param {File} backgroundImage - Optional new background image file
   * @param {boolean} removeBackground - Whether to remove existing background
   * @returns {Promise<Object>} API response with updated template
   */
  updateTemplate: async (id, templateData, backgroundImage = null, removeBackground = false) => {
    try {
      const formData = new FormData();
      
      // Add template data
      Object.keys(templateData).forEach(key => {
        if (templateData[key] !== undefined && templateData[key] !== null) {
          if (key === 'elements' && typeof templateData[key] === 'object') {
            formData.append(key, JSON.stringify(templateData[key]));
          } else {
            formData.append(key, templateData[key]);
          }
        }
      });

      // Add background image if provided
      if (backgroundImage) {
        formData.append('backgroundImage', backgroundImage);
      }

      // Add remove background flag
      if (removeBackground) {
        formData.append('removeBackground', 'true');
      }

      const response = await fetch(`${API_BASE_URL}/certificates/templates/${id}`, {
        method: 'PUT',
        body: formData,
        // Don't set Content-Type header for FormData - let browser set it with boundary
        ...addHeaders()
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating certificate template:', error);
      throw error;
    }
  },

  /**
   * Delete certificate template
   * @param {number} id - Template ID
   * @returns {Promise<Object>} API response
   */
  deleteTemplate: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/certificates/templates/${id}`, {
        method: 'DELETE',
        ...addHeaders()
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting certificate template:', error);
      throw error;
    }
  },

  // Certificate Categories API

  /**
   * Get all certificate categories
   * @returns {Promise<Object>} API response with categories array
   */
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/certificates/categories`, {
        method: 'GET',
        ...addHeaders()
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching certificate categories:', error);
      throw error;
    }
  },

  // User Certificates API

  /**
   * Generate user certificate
   * @param {Object} certificateData - Certificate generation data
   * @returns {Promise<Object>} API response with generated certificate
   */
  generateCertificate: async (certificateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/certificates/generate`, {
        method: 'POST',
        body: JSON.stringify(certificateData),
        ...addHeaders({
          'Content-Type': 'application/json'
        })
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error generating certificate:', error);
      throw error;
    }
  },

  /**
   * Get user certificates
   * @param {number} userId - User ID
   * @returns {Promise<Object>} API response with user certificates
   */
  getUserCertificates: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/certificates/user/${userId}`, {
        method: 'GET',
        ...addHeaders()
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching user certificates:', error);
      throw error;
    }
  },

  /**
   * Track certificate download
   * @param {number} certificateId - Certificate ID
   * @returns {Promise<Object>} API response
   */
  trackDownload: async (certificateId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/certificates/download/${certificateId}`, {
        method: 'POST',
        ...addHeaders({
          'Content-Type': 'application/json'
        })
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error tracking certificate download:', error);
      throw error;
    }
  },

  // Utility functions

  /**
   * Validate certificate template data
   * @param {Object} templateData - Template data to validate
   * @returns {Object} Validation result
   */
  validateTemplate: (templateData) => {
    const errors = {};

    if (!templateData.name || templateData.name.trim().length === 0) {
      errors.name = 'ชื่อเทมเพลตเป็นข้อมูลที่จำเป็น';
    }

    if (!templateData.type || templateData.type.trim().length === 0) {
      errors.type = 'ประเภทใบประกาศเป็นข้อมูลที่จำเป็น';
    }

    if (templateData.width && (templateData.width < 100 || templateData.width > 2000)) {
      errors.width = 'ความกว้างต้องอยู่ระหว่าง 100-2000 พิกเซล';
    }

    if (templateData.height && (templateData.height < 100 || templateData.height > 2000)) {
      errors.height = 'ความสูงต้องอยู่ระหว่าง 100-2000 พิกเซล';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Generate certificate number
   * @returns {string} Unique certificate number
   */
  generateCertificateNumber: () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `CERT-${timestamp}-${random}`;
  },

  /**
   * Download certificate as image
   * @param {string} imageData - Base64 image data
   * @param {string} filename - Download filename
   */
  downloadCertificate: (imageData, filename = 'certificate.png') => {
    try {
      const link = document.createElement('a');
      link.download = filename;
      link.href = imageData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      throw error;
    }
  }
};

export default certificateService;
