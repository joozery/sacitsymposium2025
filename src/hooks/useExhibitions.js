import { useState, useEffect, useCallback, useRef } from 'react';
import { exhibitionsAPI } from '../services/api';
import exhibitionService from '../services/exhibitionService';

// Custom hook สำหรับจัดการ Exhibitions
const useExhibitions = (options = {}) => {
  const {
    autoLoad = true,
    initialStatus = null, // ไม่ filter status เป็น default
    onError = null
  } = options;

  // State
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const hasLoaded = useRef(false);

  // Load exhibitions
  const loadExhibitions = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const defaultParams = { ...params };
      if (initialStatus) {
        defaultParams.status = initialStatus;
      }
      
      console.log('🔄 Loading exhibitions with params:', defaultParams);
      const result = await exhibitionService.getExhibitions(defaultParams);
      console.log('📥 Raw API result:', result);
      
      const exhibitionsData = result.data || result || [];
      console.log('📊 Setting exhibitions data:', exhibitionsData);
      console.log('📊 Exhibitions count:', exhibitionsData.length);
      
      setExhibitions(exhibitionsData);
      setLastFetch(new Date());
      setLoading(false);
      
      return exhibitionsData;
    } catch (err) {
      console.error('❌ Error loading exhibitions:', err);
      let errorMessage = 'เกิดข้อผิดพลาดในการโหลดข้อมูลนิทรรศการ';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง';
      } else if (err.response?.status === 404) {
        errorMessage = 'ไม่พบ API endpoint';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      
      if (onError) {
        onError(err);
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []); // Remove dependencies to prevent infinite loop

  // Get exhibition by ID
  const getExhibition = useCallback(async (id) => {
    try {
      const result = await exhibitionService.getExhibition(id);
      return result.data;
    } catch (err) {
      console.error('Error getting exhibition:', err);
      const errorMessage = err.response?.data?.message || err.message || 'ไม่พบข้อมูลนิทรรศการ';
      throw new Error(errorMessage);
    }
  }, []);

  // Create exhibition
  const createExhibition = useCallback(async (exhibitionData) => {
    try {
      const result = await exhibitionService.createExhibition(exhibitionData);
      await loadExhibitions(); // Refresh list
      return result;
    } catch (err) {
      console.error('Error creating exhibition:', err);
      const errorMessage = err.response?.data?.message || err.message || 'ไม่สามารถเพิ่มนิทรรศการได้';
      throw new Error(errorMessage);
    }
  }, [loadExhibitions]);

  // Update exhibition
  const updateExhibition = useCallback(async (id, exhibitionData) => {
    try {
      const result = await exhibitionService.updateExhibition(id, exhibitionData);
      await loadExhibitions(); // Refresh list
      return result;
    } catch (err) {
      console.error('Error updating exhibition:', err);
      const errorMessage = err.response?.data?.message || err.message || 'ไม่สามารถแก้ไขนิทรรศการได้';
      throw new Error(errorMessage);
    }
  }, [loadExhibitions]);

  // Delete exhibition
  const deleteExhibition = useCallback(async (id) => {
    try {
      const result = await exhibitionService.deleteExhibition(id);
      await loadExhibitions(); // Refresh list
      return result;
    } catch (err) {
      console.error('Error deleting exhibition:', err);
      const errorMessage = err.response?.data?.message || err.message || 'ไม่สามารถลบนิทรรศการได้';
      throw new Error(errorMessage);
    }
  }, [loadExhibitions]);

  // Refresh data
  const refresh = useCallback(() => {
    return loadExhibitions();
  }, [loadExhibitions]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto load on mount (only once)
  useEffect(() => {
    if (autoLoad && !hasLoaded.current) {
      hasLoaded.current = true;
      loadExhibitions();
    }
  }, [autoLoad]); // Only depend on autoLoad

  return {
    exhibitions,
    loading,
    error,
    lastFetch,
    loadExhibitions,
    getExhibition,
    createExhibition,
    updateExhibition,
    deleteExhibition,
    refresh,
    clearError
  };
};

export default useExhibitions; 