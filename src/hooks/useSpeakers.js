import { useState, useEffect, useCallback } from 'react';
import { speakersAPI } from '../services/api';
import speakersService from '../services/speakersService';
import simpleSpeakersAPI from '../services/simpleSpeakersAPI';

// Custom hook สำหรับจัดการ Speakers
const useSpeakers = (options = {}) => {
  const {
    autoLoad = true,
    initialStatus = 'active',
    onError = null
  } = options;

  // State
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Load speakers
  const loadSpeakers = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const defaultParams = { status: initialStatus, ...params };
      
      // Add timeout and retry logic
      let retries = 3;
      let result;
      
      // Use simple API first for better reliability
      try {
        console.log('🚀 Trying simple API...');
        result = await simpleSpeakersAPI.getAllSpeakers();
      } catch (simpleError) {
        console.log('❌ Simple API failed, trying complex API...', simpleError.message);
        
        while (retries > 0) {
          try {
            // Try axios first, then fallback to fetch
            if (retries === 3) {
              result = await speakersAPI.getSpeakers(defaultParams);
            } else {
              result = await speakersService.getSpeakers(defaultParams);
            }
            break;
          } catch (retryError) {
            retries--;
            if (retries === 0) throw retryError;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
          }
        }
      }
      
      const speakersData = result.data || result || [];
      console.log('📊 Setting speakers data:', speakersData);
      console.log('🔄 Setting loading to false');
      
      setSpeakers(speakersData);
      setLastFetch(new Date());
      setLoading(false); // Force loading to false here
      
      return speakersData;
    } catch (err) {
      console.error('Error loading speakers:', err);
      let errorMessage = 'เกิดข้อผิดพลาดในการโหลดข้อมูลผู้บรรยาย';
      
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
      console.log('🏁 Finally block: setting loading to false');
      setLoading(false);
    }
  }, [initialStatus, onError]);

  // Get speaker by ID
  const getSpeaker = useCallback(async (id) => {
    try {
      const result = await speakersAPI.getSpeaker(id);
      return result.data;
    } catch (err) {
      console.error('Error getting speaker:', err);
      const errorMessage = err.response?.data?.message || err.message || 'ไม่พบข้อมูลผู้บรรยาย';
      throw new Error(errorMessage);
    }
  }, []);

  // Create speaker
  const createSpeaker = useCallback(async (speakerData) => {
    try {
      setError(null);
      const result = await speakersAPI.createSpeaker(speakerData);
      
      // Add to local state
      setSpeakers(prev => [result.data, ...prev]);
      
      return result.data;
    } catch (err) {
      console.error('Error creating speaker:', err);
      const errorMessage = err.response?.data?.message || err.message || 'เกิดข้อผิดพลาดในการเพิ่มผู้บรรยาย';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Update speaker
  const updateSpeaker = useCallback(async (id, speakerData) => {
    try {
      setError(null);
      const result = await speakersAPI.updateSpeaker(id, speakerData);
      
      // Update local state
      setSpeakers(prev => 
        prev.map(speaker => 
          speaker.id === id ? result.data : speaker
        )
      );
      
      return result.data;
    } catch (err) {
      console.error('Error updating speaker:', err);
      const errorMessage = err.response?.data?.message || err.message || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลผู้บรรยาย';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Delete speaker
  const deleteSpeaker = useCallback(async (id) => {
    try {
      setError(null);
      await speakersAPI.deleteSpeaker(id);
      
      // Remove from local state
      setSpeakers(prev => prev.filter(speaker => speaker.id !== id));
      
      return true;
    } catch (err) {
      console.error('Error deleting speaker:', err);
      const errorMessage = err.response?.data?.message || err.message || 'เกิดข้อผิดพลาดในการลบผู้บรรยาย';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Permanent delete speaker
  const permanentDeleteSpeaker = useCallback(async (id) => {
    try {
      setError(null);
      await speakersAPI.permanentDeleteSpeaker(id);
      
      // Remove from local state
      setSpeakers(prev => prev.filter(speaker => speaker.id !== id));
      
      return true;
    } catch (err) {
      console.error('Error permanently deleting speaker:', err);
      const errorMessage = err.response?.data?.message || err.message || 'เกิดข้อผิดพลาดในการลบผู้บรรยายถาวร';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Search speakers locally
  const searchSpeakers = useCallback((searchTerm) => {
    if (!searchTerm.trim()) {
      return speakers;
    }
    
    return speakers.filter(speaker =>
      speaker.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [speakers]);

  // Refresh speakers
  const refresh = useCallback(() => {
    return loadSpeakers();
  }, [loadSpeakers]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto load on mount
  useEffect(() => {
    if (autoLoad) {
      console.log('🚀 Auto loading speakers on mount...');
      loadSpeakers();
    }
  }, [autoLoad]); // Remove loadSpeakers from dependencies to prevent infinite loop

  return {
    // Data
    speakers,
    loading,
    error,
    lastFetch,
    
    // Actions
    loadSpeakers,
    getSpeaker,
    createSpeaker,
    updateSpeaker,
    deleteSpeaker,
    permanentDeleteSpeaker,
    searchSpeakers,
    refresh,
    clearError
  };
};

export default useSpeakers;