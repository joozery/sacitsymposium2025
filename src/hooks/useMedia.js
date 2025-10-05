import { useState, useEffect, useCallback } from 'react';
import mediaService from '../services/mediaService';

export const useMedia = (initialParams = {}) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // Fetch media with filters
  const fetchMedia = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const mergedParams = { ...initialParams, ...params };
      console.log('🔍 Fetching media with params:', mergedParams);
      
      const response = await mediaService.getAllMedia(mergedParams);
      
      setMedia(response.data || []);
      setPagination(response.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
      });
      
      console.log('✅ Media fetched successfully:', response.data?.length || 0, 'items');
    } catch (err) {
      console.error('❌ Error fetching media:', err);
      
      // Check if it's a network error or timeout
      if (err.name === 'AbortError') {
        setError('การเชื่อมต่อหมดเวลา กรุณาลองใหม่อีกครั้ง');
      } else if (err.message.includes('Failed to fetch')) {
        setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
      } else {
        setError(err.message);
      }
      
      setMedia([]);
      setPagination({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
      });
    } finally {
      setLoading(false);
    }
  }, []); // Remove initialParams dependency to prevent infinite loop

  // Refresh media list
  const refreshMedia = useCallback(() => {
    fetchMedia(initialParams);
  }, [fetchMedia, initialParams]);

  // Load initial data only once
  useEffect(() => {
    fetchMedia(initialParams);
  }, []); // Empty dependency array to run only once

  return {
    media,
    loading,
    error,
    pagination,
    fetchMedia,
    refreshMedia,
    setMedia
  };
};

export const useMediaItem = () => {
  const [mediaItem, setMediaItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch single media item
  const fetchMediaItem = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await mediaService.getMediaById(id);
      setMediaItem(data);
      
      console.log('✅ Media item fetched successfully:', data.name);
    } catch (err) {
      console.error('❌ Error fetching media item:', err);
      setError(err.message);
      setMediaItem(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    mediaItem,
    loading,
    error,
    fetchMediaItem,
    setMediaItem
  };
};

export const useMediaForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Create media
  const createMedia = useCallback(async (mediaData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newMedia = await mediaService.createMedia(mediaData);
      
      console.log('✅ Media created successfully:', newMedia.name);
      return newMedia;
    } catch (err) {
      console.error('❌ Error creating media:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update media
  const updateMedia = useCallback(async (id, mediaData) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedMedia = await mediaService.updateMedia(id, mediaData);
      
      console.log('✅ Media updated successfully:', updatedMedia.name);
      return updatedMedia;
    } catch (err) {
      console.error('❌ Error updating media:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete media
  const deleteMedia = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await mediaService.deleteMedia(id);
      
      console.log('✅ Media deleted successfully');
      return true;
    } catch (err) {
      console.error('❌ Error deleting media:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update status
  const updateStatus = useCallback(async (id, status) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedMedia = await mediaService.updateMediaStatus(id, status);
      
      console.log('✅ Media status updated successfully:', status);
      return updatedMedia;
    } catch (err) {
      console.error('❌ Error updating media status:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload single file
  const uploadFile = useCallback(async (file) => {
    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      const result = await mediaService.uploadFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      console.log('✅ File uploaded successfully:', result.fileName);
      return result;
    } catch (err) {
      console.error('❌ Error uploading file:', err);
      setError(err.message);
      setUploadProgress(0);
      throw err;
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  }, []);

  // Upload multiple files
  const uploadMultipleFiles = useCallback(async (files) => {
    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      const results = await mediaService.uploadMultipleFiles(files);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      console.log('✅ Files uploaded successfully:', results.length, 'files');
      return results;
    } catch (err) {
      console.error('❌ Error uploading files:', err);
      setError(err.message);
      setUploadProgress(0);
      throw err;
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  }, []);

  return {
    loading,
    error,
    uploadProgress,
    createMedia,
    updateMedia,
    deleteMedia,
    updateStatus,
    uploadFile,
    uploadMultipleFiles,
    setError
  };
};

export const useMediaStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch media statistics
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await mediaService.getMediaStats();
      setStats(data);
      
      console.log('✅ Media stats fetched successfully:', data.stats);
    } catch (err) {
      console.error('❌ Error fetching media stats:', err);
      setError(err.message);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial stats
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    fetchStats
  };
};

export const useMediaFilters = () => {
  const [events, setEvents] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [eventsData, keywordsData] = await Promise.all([
        mediaService.getEvents(),
        mediaService.getPopularKeywords()
      ]);
      
      setEvents(eventsData);
      setKeywords(keywordsData);
      
      console.log('✅ Filter options fetched successfully');
    } catch (err) {
      console.error('❌ Error fetching filter options:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial filter options
  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  return {
    events,
    keywords,
    loading,
    error,
    fetchFilterOptions
  };
};