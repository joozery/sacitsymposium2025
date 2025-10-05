
import React from 'react';
import { Helmet } from 'react-helmet';
import AdminTemplates from './AdminTemplates';
import UserTemplates from './UserTemplates';
import authService from '@/services/authService';



const TemplatesPage = () => {

  
  // Check if user is admin
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin' || currentUser?.isAdmin === true;


  


  return (
    <>
      <Helmet><title>จัดการเทมเพลต - ระบบจัดการ SACIT</title></Helmet>
      
      {/* Show different content based on user role */}
      {isAdmin ? (
        <AdminTemplates />
      ) : (
        <UserTemplates />
      )}
    </>
  );
};

export default TemplatesPage;
