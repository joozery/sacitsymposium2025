// Simple direct API calls without complex dependencies
const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'https://symposium.sacit.or.th/api'}/speakers`;

export const simpleSpeakersAPI = {
  async getAllSpeakers() {
    try {
      console.log('🔄 Fetching speakers from:', API_URL);
      
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Data received:', data);
      
      const speakers = data.data || data;
      console.log('✅ Processed speakers:', speakers);
      
      return {
        success: true,
        data: speakers,
        count: data.count || (speakers ? speakers.length : 0)
      };
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }
};

export default simpleSpeakersAPI;