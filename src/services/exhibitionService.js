// Exhibition Service for API communication
import { exhibitionsAPI, api } from './api';

class ExhibitionService {
  // Get all exhibitions
  async getExhibitions(filters = {}) {
    try {
      return await exhibitionsAPI.getExhibitions(filters);
    } catch (error) {
      console.error('Error fetching exhibitions:', error);
      throw error;
    }
  }

  // Get single exhibition by ID
  async getExhibition(id) {
    try {
      return await exhibitionsAPI.getExhibition(id);
    } catch (error) {
      console.error('Error fetching exhibition:', error);
      throw error;
    }
  }

  // Create new exhibition
  async createExhibition(exhibitionData) {
    try {
      return await exhibitionsAPI.createExhibition(exhibitionData);
    } catch (error) {
      console.error('Error creating exhibition:', error);
      throw error;
    }
  }

  // Update exhibition
  async updateExhibition(id, exhibitionData) {
    try {
      return await exhibitionsAPI.updateExhibition(id, exhibitionData);
    } catch (error) {
      console.error('Error updating exhibition:', error);
      throw error;
    }
  }

  // Delete exhibition
  async deleteExhibition(id) {
    try {
      return await exhibitionsAPI.deleteExhibition(id);
    } catch (error) {
      console.error('Error deleting exhibition:', error);
      throw error;
    }
  }

  // Get exhibition categories
  async getCategories() {
    try {
      return await exhibitionsAPI.getCategories();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Upload single file (image or PDF)
  async uploadFile(file, type = 'exhibition') {
    try {
      return await exhibitionsAPI.uploadFile(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files) {
    try {
      return await exhibitionsAPI.uploadMultipleFiles(files);
    } catch (error) {
      console.error('Error uploading multiple files:', error);
      throw error;
    }
  }

  // Delete file from S3
  async deleteFile(fileKey) {
    try {
      return await exhibitionsAPI.deleteFile(fileKey);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // Add image to exhibition (using existing API - this would need to be added to exhibitions.js backend)
  async addImageToExhibition(exhibitionId, imageData) {
    try {
      // For now, we'll use direct implementation since this specific endpoint
      // would need to be added to the backend exhibitions.js
      console.warn('addImageToExhibition: Direct API implementation needed');
      return { success: true, message: 'Image added (placeholder)' };
    } catch (error) {
      console.error('Error adding image to exhibition:', error);
      throw error;
    }
  }

  // Add document to exhibition (using existing API - this would need to be added to exhibitions.js backend)
  async addDocumentToExhibition(exhibitionId, documentData) {
    try {
      // For now, we'll use direct implementation since this specific endpoint
      // would need to be added to the backend exhibitions.js
      console.warn('addDocumentToExhibition: Direct API implementation needed');
      return { success: true, message: 'Document added (placeholder)' };
    } catch (error) {
      console.error('Error adding document to exhibition:', error);
      throw error;
    }
  }

  // Update exhibition display order (using existing API - this would need to be added to exhibitions.js backend)
  async updateDisplayOrder(orders) {
    try {
      // For now, we'll use direct implementation since this specific endpoint
      // would need to be added to the backend exhibitions.js
      console.warn('updateDisplayOrder: Direct API implementation needed');
      return { success: true, message: 'Display order updated (placeholder)' };
    } catch (error) {
      console.error('Error updating display order:', error);
      throw error;
    }
  }

  // Helper: Create exhibition with file uploads
  async createExhibitionWithFiles(exhibitionData, imageFile = null, pdfFile = null) {
    try {
      console.log('📤 Creating exhibition with files:', {
        hasImage: !!imageFile,
        hasPdf: !!pdfFile,
        imageType: imageFile?.type,
        pdfType: pdfFile?.type
      });

      // Use direct exhibition creation with file uploads
      const formData = new FormData();
      
      // Add exhibition data
      formData.append('name', exhibitionData.name);
      formData.append('title', exhibitionData.title || '');
      formData.append('description', exhibitionData.description || '');
      
      // Add image file if provided
      if (imageFile && imageFile instanceof File) {
        formData.append('image', imageFile);
        console.log('📸 Adding image to form data:', imageFile.name);
      }
      
      // Add PDF file if provided
      if (pdfFile && pdfFile instanceof File) {
        formData.append('pdf', pdfFile);
        console.log('📄 Adding PDF to form data:', pdfFile.name);
      }

      const response = await api.post('/exhibitions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Exhibition created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating exhibition with files:', error);
      throw error;
    }
  }

  // Helper: Update exhibition with file uploads
  async updateExhibitionWithFiles(id, exhibitionData, imageFile = null, pdfFile = null) {
    try {
      console.log('📤 Updating exhibition with files:', {
        id: id,
        hasImage: !!imageFile,
        hasPdf: !!pdfFile,
        imageType: imageFile?.type,
        pdfType: pdfFile?.type
      });

      // Use direct exhibition update with file uploads
      const formData = new FormData();
      
      // Add exhibition data
      formData.append('name', exhibitionData.name);
      formData.append('title', exhibitionData.title || '');
      formData.append('description', exhibitionData.description || '');
      
      // Add image file if provided
      if (imageFile && imageFile instanceof File) {
        formData.append('image', imageFile);
        console.log('📸 Adding image to form data:', imageFile.name);
      }
      
      // Add PDF file if provided
      if (pdfFile && pdfFile instanceof File) {
        formData.append('pdf', pdfFile);
        console.log('📄 Adding PDF to form data:', pdfFile.name);
      }

      const response = await api.put(`/exhibitions/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Exhibition updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating exhibition with files:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new ExhibitionService();