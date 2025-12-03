import { useState, useCallback } from 'react';
import exhibitionsAPI from './exhibitionsAPI';

// Custom hook สำหรับจัดการ Exhibitions
const useExhibitions = (options = {}) => {
  const {
    autoLoad = true,
    defaultStatus = 'active',
    defaultSearch = ''
  } = options;

  // State management
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedExhibition, setSelectedExhibition] = useState(null);

  // Load exhibitions
  const loadExhibitions = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const defaultParams = {
        status: defaultStatus,
        search: defaultSearch,
        ...params
      };
      
      const result = await exhibitionsAPI.getAll(defaultParams);
      
      if (result.success) {
        setExhibitions(result.data);
      } else {
        setError(result.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
      }
    } catch (err) {
      console.error('Error loading exhibitions:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  }, [defaultStatus, defaultSearch]);

  // Get single exhibition
  const getExhibition = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await exhibitionsAPI.getById(id);
      
      if (result.success) {
        setSelectedExhibition(result.data);
        return result.data;
      } else {
        setError(result.message || 'ไม่พบข้อมูลนิทรรศการ');
        return null;
      }
    } catch (err) {
      console.error('Error fetching exhibition:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create exhibition
  const createExhibition = useCallback(async (exhibitionData) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = exhibitionsAPI.createFormData(exhibitionData);
      const result = await exhibitionsAPI.create(formData);
      
      if (result.success) {
        // Reload exhibitions list
        await loadExhibitions();
        return result.data;
      } else {
        setError(result.message || 'เกิดข้อผิดพลาดในการสร้างนิทรรศการ');
        return null;
      }
    } catch (err) {
      console.error('Error creating exhibition:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการสร้างนิทรรศการ');
      return null;
    } finally {
      setLoading(false);
    }
  }, [loadExhibitions]);

  // Update exhibition
  const updateExhibition = useCallback(async (id, exhibitionData) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = exhibitionsAPI.createFormData(exhibitionData);
      const result = await exhibitionsAPI.update(id, formData);
      
      if (result.success) {
        // Reload exhibitions list
        await loadExhibitions();
        return result.data;
      } else {
        setError(result.message || 'เกิดข้อผิดพลาดในการอัปเดตนิทรรศการ');
        return null;
      }
    } catch (err) {
      console.error('Error updating exhibition:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการอัปเดตนิทรรศการ');
      return null;
    } finally {
      setLoading(false);
    }
  }, [loadExhibitions]);

  // Delete exhibition
  const deleteExhibition = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await exhibitionsAPI.delete(id);
      
      if (result.success) {
        // Reload exhibitions list
        await loadExhibitions();
        return true;
      } else {
        setError(result.message || 'เกิดข้อผิดพลาดในการลบนิทรรศการ');
        return false;
      }
    } catch (err) {
      console.error('Error deleting exhibition:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการลบนิทรรศการ');
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadExhibitions]);

  // Permanent delete exhibition
  const permanentDeleteExhibition = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await exhibitionsAPI.permanentDelete(id);
      
      if (result.success) {
        // Reload exhibitions list
        await loadExhibitions();
        return true;
      } else {
        setError(result.message || 'เกิดข้อผิดพลาดในการลบนิทรรศการอย่างถาวร');
        return false;
      }
    } catch (err) {
      console.error('Error permanently deleting exhibition:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการลบนิทรรศการอย่างถาวร');
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadExhibitions]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear selected exhibition
  const clearSelected = useCallback(() => {
    setSelectedExhibition(null);
  }, []);

  // Auto load on mount
  React.useEffect(() => {
    if (autoLoad) {
      loadExhibitions();
    }
  }, [autoLoad, loadExhibitions]);

  return {
    // State
    exhibitions,
    loading,
    error,
    selectedExhibition,
    
    // Actions
    loadExhibitions,
    getExhibition,
    createExhibition,
    updateExhibition,
    deleteExhibition,
    permanentDeleteExhibition,
    clearError,
    clearSelected,
    
    // Computed
    count: exhibitions.length,
    hasData: exhibitions.length > 0,
    hasError: !!error
  };
};

export default useExhibitions; 