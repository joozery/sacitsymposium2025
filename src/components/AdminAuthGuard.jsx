import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const AdminAuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        const adminUser = localStorage.getItem('adminUser');

        if (!adminToken || !adminUser) {
          // ไม่มี token หรือ user data
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          navigate('/admin-login', { 
            state: { from: location.pathname },
            replace: true 
          });
          return;
        }

        // ตรวจสอบ token กับ server
        const response = await fetch('/api/auth/admin-profile', {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Token ไม่ถูกต้องหรือหมดอายุ
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          
          toast({
            title: "เซสชันหมดอายุ",
            description: "กรุณาเข้าสู่ระบบใหม่",
            variant: "destructive",
          });
          
          navigate('/admin-login', { 
            state: { from: location.pathname },
            replace: true 
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        
        // เกิดข้อผิดพลาดในการเชื่อมต่อ
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถตรวจสอบการเข้าสู่ระบบได้",
          variant: "destructive",
        });
        
        navigate('/admin-login', { 
          state: { from: location.pathname },
          replace: true 
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังตรวจสอบการเข้าสู่ระบบ...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // จะ redirect ไปหน้า login แล้ว
  }

  return children;
};

export default AdminAuthGuard; 