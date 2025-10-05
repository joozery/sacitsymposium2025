import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = '/api';

const useWorks = ({ 
  autoLoad = false, 
  initialStatus = 'active',
  initialCategory = null,
  initialSearch = null 
} = {}) => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: initialStatus,
    category: initialCategory,
    search: initialSearch
  });

  // ดึงรายการผลงานสร้างสรรค์
  const fetchWorks = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      // สร้าง query parameters โดยไม่รวม null values
      const allParams = { ...filters, ...params };
      const queryParams = new URLSearchParams();
      
      Object.keys(allParams).forEach(key => {
        if (allParams[key] !== null && allParams[key] !== undefined && allParams[key] !== '') {
          queryParams.append(key, allParams[key]);
        }
      });

      const url = `${API_BASE_URL}/works?${queryParams}`;
      console.log('🔍 Fetching works from:', url);
      console.log('🔍 Filters:', filters);
      console.log('🔍 Params:', params);

      const response = await fetch(url);
      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response ok:', response.ok);

      const data = await response.json();
      console.log('🔍 API Response:', data);

      if (data.success) {
        console.log('🔍 Setting works:', data.data);
        setWorks(data.data);
        return data.data;
      } else {
        throw new Error(data.message || 'ไม่สามารถดึงข้อมูลผลงานสร้างสรรค์ได้');
      }
    } catch (err) {
      console.error('Error fetching works:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // ดึงข้อมูลผลงานสร้างสรรค์ตาม ID
  const fetchWorkById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/works/${id}`);
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'ไม่พบข้อมูลผลงานสร้างสรรค์');
      }
    } catch (err) {
      console.error('Error fetching work:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // เพิ่มผลงานสร้างสรรค์ใหม่
  const createWork = useCallback(async (workData) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // เพิ่มข้อมูลพื้นฐาน
      Object.keys(workData).forEach(key => {
        if (key !== 'photo' && key !== 'pdf' && workData[key] !== undefined) {
          formData.append(key, workData[key]);
        }
      });

      // เพิ่มไฟล์รูปภาพ (ถ้ามี)
      if (workData.photo) {
        formData.append('photo', workData.photo);
      }

      // เพิ่มไฟล์ PDF (ถ้ามี)
      if (workData.pdf) {
        formData.append('pdf', workData.pdf);
      }

      const response = await fetch(`${API_BASE_URL}/works`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // อัปเดตรายการผลงาน
        await fetchWorks();
        return data.data;
      } else {
        throw new Error(data.message || 'ไม่สามารถเพิ่มผลงานสร้างสรรค์ได้');
      }
    } catch (err) {
      console.error('Error creating work:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchWorks]);

  // อัปเดตข้อมูลผลงานสร้างสรรค์
  const updateWork = useCallback(async (id, workData) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // เพิ่มข้อมูลพื้นฐาน
      Object.keys(workData).forEach(key => {
        if (key !== 'photo' && key !== 'pdf' && workData[key] !== undefined) {
          formData.append(key, workData[key]);
        }
      });

      // เพิ่มไฟล์รูปภาพ (ถ้ามี)
      if (workData.photo) {
        formData.append('photo', workData.photo);
      }

      // เพิ่มไฟล์ PDF (ถ้ามี)
      if (workData.pdf) {
        formData.append('pdf', workData.pdf);
      }

      const response = await fetch(`${API_BASE_URL}/works/${id}`, {
        method: 'PUT',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // อัปเดตรายการผลงาน
        await fetchWorks();
        return data.data;
      } else {
        throw new Error(data.message || 'ไม่สามารถอัปเดตข้อมูลผลงานสร้างสรรค์ได้');
      }
    } catch (err) {
      console.error('Error updating work:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchWorks]);

  // ลบผลงานสร้างสรรค์ (soft delete)
  const deleteWork = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/works/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        // อัปเดตรายการผลงาน
        await fetchWorks();
        return true;
      } else {
        throw new Error(data.message || 'ไม่สามารถลบผลงานสร้างสรรค์ได้');
      }
    } catch (err) {
      console.error('Error deleting work:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchWorks]);

  // ลบผลงานสร้างสรรค์ถาวร (hard delete)
  const permanentDeleteWork = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/works/${id}/permanent`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        // อัปเดตรายการผลงาน
        await fetchWorks();
        return true;
      } else {
        throw new Error(data.message || 'ไม่สามารถลบผลงานสร้างสรรค์ถาวรได้');
      }
    } catch (err) {
      console.error('Error permanently deleting work:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchWorks]);

  // อัปเดต filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // ค้นหาผลงาน
  const searchWorks = useCallback((searchTerm) => {
    updateFilters({ search: searchTerm });
  }, [updateFilters]);

  // กรองตามหมวดหมู่
  const filterByCategory = useCallback((category) => {
    updateFilters({ category });
  }, [updateFilters]);

  // กรองตามสถานะ
  const filterByStatus = useCallback((status) => {
    updateFilters({ status });
  }, [updateFilters]);

  // รีเซ็ต filters
  const resetFilters = useCallback(() => {
    setFilters({
      status: initialStatus,
      category: initialCategory,
      search: initialSearch
    });
  }, [initialStatus, initialCategory, initialSearch]);

  // ล้าง error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // โหลดข้อมูลอัตโนมัติเมื่อ filters เปลี่ยน
  useEffect(() => {
    if (autoLoad) {
      fetchWorks();
    }
  }, [autoLoad, fetchWorks]);

  return {
    // State
    works,
    loading,
    error,
    filters,

    // Actions
    fetchWorks,
    fetchWorkById,
    createWork,
    updateWork,
    deleteWork,
    permanentDeleteWork,
    clearError,

    // Filters
    updateFilters,
    searchWorks,
    filterByCategory,
    filterByStatus,
    resetFilters
  };
};

export default useWorks; 