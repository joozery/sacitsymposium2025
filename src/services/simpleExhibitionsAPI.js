// Simple direct API calls without complex dependencies
const API_URL = '/api/exhibitions';

export const simpleExhibitionsAPI = {
  async getAllExhibitions() {
    try {
      console.log('🔄 Fetching exhibitions from:', API_URL);
      
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
      
      const exhibitions = data.data || data;
      console.log('✅ Processed exhibitions:', exhibitions);
      
      return {
        success: true,
        data: exhibitions,
        count: data.count || (exhibitions ? exhibitions.length : 0)
      };
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }
};

export default simpleExhibitionsAPI; 