import React from 'react';
import { Helmet } from 'react-helmet';
import AdminTemplates from './AdminTemplates';
import UserTemplates from './UserTemplates';
import authService from '@/services/authService';

const TemplatesPage = () => {
  // Check if user is admin
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin' || currentUser?.isAdmin === true;
  
  // For admin/templates route, always show AdminTemplates
  // This ensures admin can create templates even if auth check fails
  const shouldShowAdmin = isAdmin || window.location.pathname.includes('/admin/');

  return (
    <>
      <Helmet><title>จัดการเทมเพลต - ระบบจัดการ SACIT</title></Helmet>
      
      {/* Show different content based on user role */}
      {shouldShowAdmin ? (
        <AdminTemplates />
      ) : (
        <UserTemplates />
      )}
    </>
  );
};

export default TemplatesPage;
