import { useState, useEffect, useCallback } from 'react';
import SpeakersAPI from './speakersAPI';

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
      const result = await SpeakersAPI.getAll(defaultParams);
      
      setSpeakers(result.data);
      setLastFetch(new Date());
      
      return result.data;
    } catch (err) {
      console.error('Error loading speakers:', err);
      setError(err.message);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [initialStatus, onError]);

  // Get speaker by ID
  const getSpeaker = useCallback(async (id) => {
    try {
      const result = await SpeakersAPI.getById(id);
      return result.data;
    } catch (err) {
      console.error('Error getting speaker:', err);
      throw err;
    }
  }, []);

  // Create speaker
  const createSpeaker = useCallback(async (speakerData) => {
    try {
      const result = await SpeakersAPI.create(speakerData);
      
      // Add to local state
      setSpeakers(prev => [result.data, ...prev]);
      
      return result.data;
    } catch (err) {
      console.error('Error creating speaker:', err);
      throw err;
    }
  }, []);

  // Update speaker
  const updateSpeaker = useCallback(async (id, speakerData) => {
    try {
      const result = await SpeakersAPI.update(id, speakerData);
      
      // Update local state
      setSpeakers(prev => 
        prev.map(speaker => 
          speaker.id === id ? result.data : speaker
        )
      );
      
      return result.data;
    } catch (err) {
      console.error('Error updating speaker:', err);
      throw err;
    }
  }, []);

  // Delete speaker
  const deleteSpeaker = useCallback(async (id) => {
    try {
      await SpeakersAPI.delete(id);
      
      // Remove from local state
      setSpeakers(prev => prev.filter(speaker => speaker.id !== id));
      
      return true;
    } catch (err) {
      console.error('Error deleting speaker:', err);
      throw err;
    }
  }, []);

  // Permanent delete speaker
  const permanentDeleteSpeaker = useCallback(async (id) => {
    try {
      await SpeakersAPI.permanentDelete(id);
      
      // Remove from local state
      setSpeakers(prev => prev.filter(speaker => speaker.id !== id));
      
      return true;
    } catch (err) {
      console.error('Error permanently deleting speaker:', err);
      throw err;
    }
  }, []);

  // Search speakers
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
      loadSpeakers();
    }
  }, [autoLoad, loadSpeakers]);

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
    clearError,
    
    // Computed
    totalSpeakers: speakers.length,
    activeSpeakers: speakers.filter(s => s.status === 'active').length,
    inactiveSpeakers: speakers.filter(s => s.status === 'inactive').length,
  };
};

export default useSpeakers;