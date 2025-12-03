import { useState, useEffect, useCallback } from 'react';
import { submissionsService } from '@/services/submissionsService';

const useSubmissions = (initialFilters = {}) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState(initialFilters);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await submissionsService.getAllSubmissions({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });
      
      if (response.success) {
        setSubmissions(response.data);
        setPagination(response.pagination);
      } else {
        throw new Error(response.message || 'Failed to fetch submissions');
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const setPage = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const refresh = () => {
    fetchSubmissions();
  };

  return {
    submissions,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    setPage,
    refresh
  };
};

export default useSubmissions;

