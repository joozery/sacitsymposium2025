const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const submissionsService = {
  // Get all submissions with filters
  getAllSubmissions: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.year) queryParams.append('year', filters.year);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      
      const url = `${API_BASE_URL}/submissions${queryParams.toString() ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw error;
    }
  },

  // Get single submission
  getSubmission: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/submissions/${id}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching submission:', error);
      throw error;
    }
  },

  // Update review status
  updateReviewStatus: async (id, reviewData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/submissions/${id}/review`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(reviewData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating review status:', error);
      throw error;
    }
  },

  // Alias for updateReviewStatus (for compatibility)
  updateSubmissionReview: async (id, reviewData) => {
    return submissionsService.updateReviewStatus(id, reviewData);
  },

  // Add comment
  addComment: async (id, comment, reviewerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/submissions/${id}/comments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ comment, reviewer_id: reviewerId })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Get statistics
  getStatistics: async (year) => {
    try {
      const url = `${API_BASE_URL}/submissions/stats/overview${year ? `?year=${year}` : ''}`;
      
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }
};

export default submissionsService;

