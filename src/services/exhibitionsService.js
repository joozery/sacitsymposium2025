import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://symposium.sacit.or.th/api';

const exhibitionsService = {
  async getExhibitions(params = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/exhibitions`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching exhibitions:', error);
      throw error;
    }
  },

  async getExhibition(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/exhibitions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exhibition:', error);
      throw error;
    }
  },

  async createExhibition(exhibitionData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/exhibitions`, exhibitionData);
      return response.data;
    } catch (error) {
      console.error('Error creating exhibition:', error);
      throw error;
    }
  },

  async updateExhibition(id, exhibitionData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/exhibitions/${id}`, exhibitionData);
      return response.data;
    } catch (error) {
      console.error('Error updating exhibition:', error);
      throw error;
    }
  },

  async deleteExhibition(id) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/exhibitions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting exhibition:', error);
      throw error;
    }
  },

  async permanentDeleteExhibition(id) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/exhibitions/${id}/permanent`);
      return response.data;
    } catch (error) {
      console.error('Error permanently deleting exhibition:', error);
      throw error;
    }
  }
};

export default exhibitionsService; 