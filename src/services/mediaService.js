const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Debug API URL
console.log('🔗 API Base URL:', API_BASE_URL);

// Helper function to add headers to fetch options
const addHeaders = (options = {}) => {
  return {
    ...options,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers
    }
  };
};

class MediaService {
  // Get all media with optional filters
  async getAllMedia(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters
      if (params.type) queryParams.append('type', params.type);
      if (params.event) queryParams.append('event', params.event);
      if (params.status) queryParams.append('status', params.status);
      if (params.search) queryParams.append('search', params.search);
      if (params.keywords) queryParams.append('keywords', params.keywords);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const url = `${API_BASE_URL}/media${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      console.log('🔍 Fetching media:', url);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch media');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error fetching media:', error);
      throw error;
    }
  }

  // Get media by ID
  async getMediaById(id) {
    try {
      console.log('🔍 Fetching media by ID:', id);
      
      const response = await fetch(`${API_BASE_URL}/media/${id}`, addHeaders());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Media not found');
      }
      
      return data.data;
    } catch (error) {
      console.error('❌ Error fetching media by ID:', error);
      throw error;
    }
  }

  // Get images in a folder
  // Get folder images (UPDATED: using folder_images table)
  async getFolderImages(folderId) {
    try {
      console.log('📁 Fetching folder images from folder_images table:', folderId);
      console.log('📁 API URL:', `${API_BASE_URL}/folders/${folderId}/images`);
      
      const response = await fetch(`${API_BASE_URL}/folders/${folderId}/images`, {
        method: 'GET',
        ...addHeaders()
      });
      
      console.log('📁 Response status:', response.status);
      console.log('📁 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        console.error('❌ HTTP error response:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('❌ Error response body:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('📁 Raw API response:', data);
      console.log('📁 Response structure check:', {
        hasSuccess: 'success' in data,
        success: data.success,
        hasData: 'data' in data,
        dataType: typeof data.data,
        hasFolder: data.data && 'folder' in data.data,
        hasImages: data.data && 'images' in data.data,
        imagesLength: data.data?.images?.length
      });
      
      if (!data.success) {
        console.error('❌ API returned error:', data.error);
        throw new Error(data.error || 'Failed to fetch folder images');
      }
      
      console.log('📁 Returning data.data:', data.data);
      return data.data; // { folder: {...}, images: [...] }
    } catch (error) {
      console.error('❌ Error fetching folder images:', error);
      console.error('❌ Error stack:', error.stack);
      throw error;
    }
  }

  // Upload multiple files to specific folder (NEW)
  async uploadFilesToFolder(folderId, files) {
    try {
      console.log('📁 Uploading files to folder:', { folderId, fileCount: files.length });
      
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      
      const controller = new AbortController();
      // Dynamic timeout based on file count: 60s base + 2s per file (max 5 minutes)
      const dynamicTimeout = Math.min(60000 + (files.length * 2000), 300000);
      const timeoutId = setTimeout(() => controller.abort(), dynamicTimeout);
      
      console.log(`⏱️ Upload timeout set to ${dynamicTimeout/1000}s for ${files.length} files`);
      
      const response = await fetch(`${API_BASE_URL}/upload/folder/${folderId}`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
        // Don't set Content-Type header for FormData - let browser set it with boundary
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to upload files to folder');
      }
      
      return data.data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Upload timeout - files may still be processing');
      }
      console.error('❌ Error uploading files to folder:', error);
      throw error;
    }
  }

  // Add single image to folder (NEW)
  async addImageToFolder(folderId, imageData) {
    try {
      console.log('📸 Adding image to folder:', { folderId, imageName: imageData.name });
      
      const response = await fetch(`${API_BASE_URL}/folders/${folderId}/images`, addHeaders({
        method: 'POST',
        body: JSON.stringify(imageData)
      }));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to add image to folder');
      }
      
      return data.data;
    } catch (error) {
      console.error('❌ Error adding image to folder:', error);
      throw error;
    }
  }

  // Delete image from folder (NEW)
  async deleteImageFromFolder(folderId, imageId) {
    try {
      console.log('🗑️ Deleting image from folder:', { folderId, imageId });
      
      const response = await fetch(`${API_BASE_URL}/folders/${folderId}/images/${imageId}`, addHeaders({
        method: 'DELETE'
      }));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete image from folder');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error deleting image from folder:', error);
      throw error;
    }
  }

  // Batch create multiple media items
  async batchCreateMedia(mediaItems) {
    try {
      console.log('📦 Batch creating media items:', mediaItems.length);
      
      const response = await fetch(`${API_BASE_URL}/media/batch`, addHeaders({
        method: 'POST',
        body: JSON.stringify({ mediaItems })
      }));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to batch create media');
      }
      
      return data.data;
    } catch (error) {
      console.error('❌ Error batch creating media:', error);
      throw error;
    }
  }

  // Create new media
  async createMedia(mediaData) {
    try {
      console.log('📝 Creating media:', mediaData);
      
      const response = await fetch(`${API_BASE_URL}/media`, addHeaders({
        method: 'POST',
        body: JSON.stringify(mediaData),
      }));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create media');
      }
      
      console.log('✅ Media created successfully:', data.data);
      return data.data;
    } catch (error) {
      console.error('❌ Error creating media:', error);
      throw error;
    }
  }

  // Update media
  async updateMedia(id, mediaData) {
    try {
      console.log('📝 Updating media:', id, mediaData);
      
      const response = await fetch(`${API_BASE_URL}/media/${id}`, addHeaders({
        method: 'PUT',
        body: JSON.stringify(mediaData),
      }));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update media');
      }
      
      console.log('✅ Media updated successfully:', data.data);
      return data.data;
    } catch (error) {
      console.error('❌ Error updating media:', error);
      throw error;
    }
  }

  // Delete media
  async deleteMedia(id) {
    try {
      console.log('🗑️ Deleting media:', id);
      
      const response = await fetch(`${API_BASE_URL}/media/${id}`, addHeaders({
        method: 'DELETE',
      }));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete media');
      }
      
      console.log('✅ Media deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error deleting media:', error);
      throw error;
    }
  }

  // Update media status
  async updateMediaStatus(id, status) {
    try {
      console.log('📝 Updating media status:', id, status);
      
      const response = await fetch(`${API_BASE_URL}/media/${id}/status`, addHeaders({
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update media status');
      }
      
      console.log('✅ Media status updated successfully');
      return data.data;
    } catch (error) {
      console.error('❌ Error updating media status:', error);
      throw error;
    }
  }

  // Get media statistics
  async getMediaStats() {
    try {
      console.log('📊 Fetching media statistics');
      
      const response = await fetch(`${API_BASE_URL}/media/stats`, addHeaders());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch media statistics');
      }
      
      return data.data;
    } catch (error) {
      console.error('❌ Error fetching media statistics:', error);
      throw error;
    }
  }

  // Get available events
  async getEvents() {
    try {
      console.log('📅 Fetching events');
      
      const response = await fetch(`${API_BASE_URL}/media/events`, addHeaders());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch events');
      }
      
      return data.data;
    } catch (error) {
      console.error('❌ Error fetching events:', error);
      throw error;
    }
  }

  // Get popular keywords
  async getPopularKeywords() {
    try {
      console.log('🏷️ Fetching popular keywords');
      
      const response = await fetch(`${API_BASE_URL}/media/keywords`, addHeaders());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch keywords');
      }
      
      return data.data;
    } catch (error) {
      console.error('❌ Error fetching keywords:', error);
      throw error;
    }
  }

  // Upload single file
  async uploadFile(file) {
    try {
      console.log('📤 Uploading file:', file.name);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header for FormData - let browser set it with boundary
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Upload error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to upload file');
      }
      
      console.log('✅ File uploaded successfully:', data);
      // Return the data directly, not data.data since backend doesn't wrap in data field
      return {
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize,
        fileType: data.fileType,
        fileKey: data.fileKey,
        isImage: data.isImage,
        isPdf: data.isPdf,
        isVideo: data.isVideo
      };
    } catch (error) {
      console.error('❌ Error uploading file:', error);
      throw error;
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files) {
    try {
      console.log('📤 Uploading multiple files:', files.length);
      
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      
      const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header for FormData - let browser set it with boundary
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Multiple upload error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to upload files');
      }
      
      console.log('✅ Files uploaded successfully:', data.data);
      // Return the data array directly
      return data.data || [];
    } catch (error) {
      console.error('❌ Error uploading files:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const mediaService = new MediaService();
export default mediaService;