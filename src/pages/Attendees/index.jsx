import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Download, 
  Filter, 
  Users, 
  UserCheck, 
  FileText, 
  Palette,
  Eye,
  Mail,
  Phone,
  Calendar,
  Building,
  GraduationCap,
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal,
  QrCode,
  ExternalLink,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { attendeesAPI, api } from '@/services/api';
import Swal from 'sweetalert2';
// import { 
//   Tabs, 
//   TabsContent, 
//   TabsList, 
//   TabsTrigger 
// } from '@/components/ui/tabs';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

const AttendeesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2025');
  const [showQRModal, setShowQRModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [loadingActions, setLoadingActions] = useState({});

  // Load data from localStorage and listen for updates
  const [attendeesData, setAttendeesData] = useState(() => {
    const savedData = localStorage.getItem('attendeesData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    // Default data structure
    return {
      '2025': { general: [], research: [], creative: [] },
      '2024': { general: [], research: [], creative: [] }
    };
  });

  // Fetch attendees data from API
  const fetchAttendeesData = async (year) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Fetching attendees data for year:', year);
      
      // ใช้ attendees endpoint เพื่อดึงข้อมูลที่มี check-in status
      // Add cache-busting parameter
      const timestamp = Date.now();
      const [generalResponse, researchResponse, creativeResponse] = await Promise.all([
        attendeesAPI.getAttendeesByType(year, 'general', timestamp),
        attendeesAPI.getAttendeesByType(year, 'research', timestamp),
        attendeesAPI.getAttendeesByType(year, 'creative', timestamp)
      ]);
      
      console.log('📊 API Responses:', {
        general: generalResponse,
        research: researchResponse,
        creative: creativeResponse
      });
      
      // Transform general attendees data from attendees API
      const generalAttendees = generalResponse.success ? generalResponse.data?.map(attendee => {
        const transformed = {
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          phone: attendee.phone,
          organization: attendee.organization,
          education: attendee.education || 'ไม่ระบุ',
          registeredAt: attendee.registeredAt,
          status: attendee.status || 'confirmed',
          checkedIn: attendee.checked_in === 1 || attendee.checkInStatus === 'checked_in',
          checkInTime: attendee.checkInTime,
          checkInRequested: attendee.check_in_requested === 1 || attendee.checkInStatus === 'pending_approval',
          checkInRequestTime: attendee.checkInRequestTime
        };
        
        // Debug: Log transformation for attendees with check-in status
        if (attendee.check_in_requested === 1 || attendee.checked_in === 1) {
          console.log(`🔄 Transforming ${attendee.name}:`, {
            original: {
              checked_in: attendee.checked_in,
              check_in_requested: attendee.check_in_requested,
              checkInStatus: attendee.checkInStatus
            },
            transformed: {
              checkedIn: transformed.checkedIn,
              checkInRequested: transformed.checkInRequested
            }
          });
        }
        
        return transformed;
      }) || [] : [];

      // Transform research attendees data from attendees API
      const researchAttendees = researchResponse.success ? researchResponse.data?.map(attendee => ({
        id: attendee.id,
        name: attendee.name,
        email: attendee.email,
        phone: attendee.phone,
        organization: attendee.organization,
        education: attendee.education || 'ไม่ระบุ',
        registeredAt: attendee.registeredAt,
        status: attendee.status || 'confirmed',
        checkedIn: attendee.checked_in === 1 || attendee.checkInStatus === 'checked_in',
        checkInTime: attendee.checkInTime,
        checkInRequested: attendee.check_in_requested === 1 || attendee.checkInStatus === 'pending_approval',
        checkInRequestTime: attendee.checkInRequestTime,
        projectTitle: attendee.projectTitle,
        category: attendee.category,
        submissionStatus: attendee.submissionStatus
      })) || [] : [];

      // Transform creative attendees data from attendees API
      const creativeAttendees = creativeResponse.success ? creativeResponse.data?.map(attendee => ({
        id: attendee.id,
        name: attendee.name,
        email: attendee.email,
        phone: attendee.phone,
        organization: attendee.organization,
        education: attendee.education || 'ไม่ระบุ',
        registeredAt: attendee.registeredAt,
        status: attendee.status || 'confirmed',
        checkedIn: attendee.checked_in === 1 || attendee.checkInStatus === 'checked_in',
        checkInTime: attendee.checkInTime,
        checkInRequested: attendee.check_in_requested === 1 || attendee.checkInStatus === 'pending_approval',
        checkInRequestTime: attendee.checkInRequestTime,
        projectTitle: attendee.projectTitle,
        category: attendee.category,
        submissionStatus: attendee.submissionStatus
      })) || [] : [];

      console.log('📋 Transformed data sample:', {
        general: generalAttendees.slice(0, 2),
        research: researchAttendees.slice(0, 2),
        creative: creativeAttendees.slice(0, 2)
      });

      // Check for pending requests
      const allAttendees = [...generalAttendees, ...researchAttendees, ...creativeAttendees];
      const pendingRequests = allAttendees.filter(a => a.checkInRequested && !a.checkedIn);
      console.log('🔍 Pending requests found:', pendingRequests.length);
      pendingRequests.forEach(req => {
        console.log('⏳ Pending:', req.name, req.email, 'checkInRequested:', req.checkInRequested, 'checkedIn:', req.checkedIn);
      });

      // Debug: Log all attendees with check-in status
      console.log('🔍 All attendees check-in status:');
      allAttendees.forEach(attendee => {
        if (attendee.checkInRequested || attendee.checkedIn) {
          console.log(`👤 ${attendee.name} (${attendee.email}):`, {
            checkInRequested: attendee.checkInRequested,
            checkedIn: attendee.checkedIn,
            checkInTime: attendee.checkInTime,
            checkInRequestTime: attendee.checkInRequestTime,
            checkInStatus: attendee.checkInStatus
          });
        }
      });
      
      // Debug: Log raw API response for first few attendees
      console.log('🔍 Raw API response sample:');
      if (generalResponse.success && generalResponse.data && generalResponse.data.length > 0) {
        console.log('📊 First general attendee raw data:', generalResponse.data[0]);
        console.log('📊 Check-in fields:', {
          checked_in: generalResponse.data[0].checked_in,
          check_in_requested: generalResponse.data[0].check_in_requested,
          checkInStatus: generalResponse.data[0].checkInStatus
        });
        
        // Debug: Check for pending requests in raw data
        const pendingInRaw = generalResponse.data.filter(a => a.check_in_requested === 1 && a.checked_in === 0);
        console.log('🔍 Pending requests in raw data:', pendingInRaw.length);
        pendingInRaw.forEach(req => {
          console.log('⏳ Raw pending:', req.name, req.email, 'check_in_requested:', req.check_in_requested, 'checked_in:', req.checked_in);
        });
      }
      if (researchResponse.success && researchResponse.data && researchResponse.data.length > 0) {
        console.log('📊 First research attendee raw data:', researchResponse.data[0]);
      }
      if (creativeResponse.success && creativeResponse.data && creativeResponse.data.length > 0) {
        console.log('📊 First creative attendee raw data:', creativeResponse.data[0]);
      }

      setAttendeesData(prev => ({
        ...prev,
        [year]: {
          general: generalAttendees,
          research: researchAttendees,
          creative: creativeAttendees
        }
      }));

    } catch (error) {
      console.error('Error fetching attendees data:', error);
      setError(error.message || 'ไม่สามารถดึงข้อมูลผู้เข้าร่วมงานได้');
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts and when year changes
  useEffect(() => {
    fetchAttendeesData(selectedYear);
  }, [selectedYear]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing attendees data...');
      fetchAttendeesData(selectedYear);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [selectedYear]);

  // Listen for data updates from check-in page
  useEffect(() => {
    const handleDataUpdate = (event) => {
      console.log('🔄 Received attendee data update event:', event.detail);
      setAttendeesData(event.detail);
    };

    window.addEventListener('attendeeDataUpdated', handleDataUpdate);
    
    // Also refresh data periodically to catch updates
    const interval = setInterval(() => {
      console.log('🔄 Periodic data refresh...');
      fetchAttendeesData(selectedYear);
    }, 30000); // Refresh every 30 seconds
    
    return () => {
      window.removeEventListener('attendeeDataUpdated', handleDataUpdate);
      clearInterval(interval);
    };
  }, [selectedYear]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('attendeesData', JSON.stringify(attendeesData));
  }, [attendeesData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'not_registered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubmissionStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'ยืนยันแล้ว';
      case 'pending': return 'รอยืนยัน';
      case 'not_registered': return 'ยังไม่ลงทะเบียน';
      case 'cancelled': return 'ยกเลิก';
      default: return status;
    }
  };

  const getSubmissionStatusText = (status) => {
    switch (status) {
      case 'approved': return 'อนุมัติ';
      case 'under_review': return 'กำลังตรวจ';
      case 'pending': return 'รอส่ง';
      case 'rejected': return 'ไม่อนุมัติ';
      default: return status;
    }
  };

  // ฟังก์ชันแสดงวันที่ที่ถูกต้อง
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getCategoryText = (category) => {
    const categories = {
      'lacquer': 'งานเครื่องรัก-เครื่องเขิน',
      'preservation': 'การอนุรักษ์ภูมิปัญญา',
      'traditional': 'หัตถกรรมประเพณี',
      'contemporary': 'หัตถกรรมร่วมสมัย',
      'culture': 'ศิลปวัฒนธรรม',
      'sustainability': 'วัสดุทางเลือก',
      'esg': 'หัตถกรรม ESG',
      'local': 'หัตถกรรมพื้นถิ่น'
    };
    return categories[category] || category;
  };

  const filterAttendees = (attendees) => {
    return attendees.filter(attendee => {
      const matchesSearch = attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           attendee.organization.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = selectedFilter === 'all' || attendee.status === selectedFilter;
      
      return matchesSearch && matchesFilter;
    });
  };

  const getCurrentYearData = () => {
    return attendeesData[selectedYear] || { general: [], research: [], creative: [] };
  };

  const getTotalCount = () => {
    const yearData = getCurrentYearData();
    return yearData.general.length + yearData.research.length + yearData.creative.length;
  };

  const getConfirmedCount = () => {
    const yearData = getCurrentYearData();
    const allAttendees = [...yearData.general, ...yearData.research, ...yearData.creative];
    return allAttendees.filter(a => a.status === 'confirmed').length;
  };

  const handleExport = async (type) => {
    try {
      setLoading(true);
      console.log(`Exporting ${type} attendees data...`);
      
      let dataToExport = [];
      const yearData = getCurrentYearData();
      
      if (type === 'all') {
        // Export all types
        dataToExport = [
          ...yearData.general.map(item => ({ ...item, type: 'general' })),
          ...yearData.research.map(item => ({ ...item, type: 'research' })),
          ...yearData.creative.map(item => ({ ...item, type: 'creative' }))
        ];
      } else {
        // Export specific type
        dataToExport = yearData[type].map(item => ({ ...item, type }));
      }
      
      if (dataToExport.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'ไม่มีข้อมูล',
          text: 'ไม่มีข้อมูลสำหรับการส่งออก'
        });
        return;
      }
      
      // Create CSV content
      const headers = [
        'ชื่อ',
        'อีเมล', 
        'โทรศัพท์',
        'องค์กร',
        'การศึกษา',
        'สถานะลงทะเบียน',
        'สถานะเช็คอิน',
        'วันที่ลงทะเบียน',
        'ประเภท'
      ];
      
      // Add research/creative specific headers
      if (type === 'research' || type === 'creative' || type === 'all') {
        headers.push('ชื่อผลงาน', 'ประเภทผลงาน', 'สถานะการส่งผลงาน');
      }
      
      const csvContent = [
        headers.join(','),
        ...dataToExport.map(attendee => {
          const row = [
            `"${attendee.name || ''}"`,
            `"${attendee.email || ''}"`,
            `"${attendee.phone || ''}"`,
            `"${attendee.organization || ''}"`,
            `"${attendee.education || ''}"`,
            `"${getStatusText(attendee.status)}"`,
            `"${getCheckInStatusText(attendee)}"`,
            `"${formatDate(attendee.registeredAt)}"`,
            `"${attendee.type === 'general' ? 'เข้าร่วมทั่วไป' : attendee.type === 'research' ? 'นำเสนอวิจัย' : 'นำเสนอสร้างสรรค์'}"`
          ];
          
          // Add research/creative specific data
          if (attendee.type === 'research' || attendee.type === 'creative') {
            row.push(
              `"${attendee.projectTitle || ''}"`,
              `"${getCategoryText(attendee.category) || ''}"`,
              `"${getSubmissionStatusText(attendee.submissionStatus) || ''}"`
            );
          } else if (type === 'all') {
            // For all export, add empty columns for non-research/creative
            row.push('""', '""', '""');
          }
          
          return row.join(',');
        })
      ].join('\n');
      
      // Create and download file
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `attendees-${type}-${selectedYear}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      Swal.fire({
        icon: 'success',
        title: 'ส่งออกสำเร็จ!',
        text: `ไฟล์ CSV ได้ถูกดาวน์โหลดแล้ว (${dataToExport.length} รายการ)`,
        timer: 3000,
        showConfirmButton: false
      });
      
    } catch (error) {
      console.error('Export error:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'เกิดข้อผิดพลาดในการส่งออกข้อมูล กรุณาลองใหม่อีกครั้ง'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (attendeeId, type) => {
    try {
      setLoadingActions(prev => ({ ...prev, [`checkin-${attendeeId}`]: true }));
      const currentTime = new Date().toISOString();
      
      // Call API to update check-in status
      const response = await attendeesAPI.updateCheckInStatus(attendeeId, {
        checked_in: true,
        check_in_time: currentTime,
        check_in_requested: true,
        check_in_request_time: currentTime
      });

      if (response.success) {
        // Refresh data to get latest status
        await fetchAttendeesData(selectedYear);
        
        Swal.fire({
          icon: 'success',
          title: 'เช็คอินสำเร็จ!',
          text: 'ผู้เข้าร่วมได้รับการเช็คอินแล้ว',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        console.error('Check-in failed:', response.message);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'เกิดข้อผิดพลาดในการเช็คอิน: ' + response.message
        });
      }
    } catch (error) {
      console.error('Error during check-in:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'เกิดข้อผิดพลาดในการเช็คอิน กรุณาลองใหม่อีกครั้ง'
      });
    } finally {
      setLoadingActions(prev => ({ ...prev, [`checkin-${attendeeId}`]: false }));
    }
  };

  const handleCheckOut = async (attendeeId, type) => {
    try {
      setLoadingActions(prev => ({ ...prev, [`checkout-${attendeeId}`]: true }));
      console.log('🔧 Canceling check-in for attendee:', attendeeId, 'type:', type);
      
      // Get the attendee data
      const attendee = getCurrentYearData()[type].find(a => a.id === attendeeId);
      if (!attendee) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่พบข้อมูลผู้เข้าร่วมงาน'
        });
        return;
      }

      // Call API to cancel check-in using attendee ID
      const response = await api.put(`/attendees/${attendeeId}/checkin`, {
        checked_in: false,
        check_in_time: null,
        check_in_requested: false,
        check_in_request_time: null
      });

      if (response.data.success) {
        // Refresh data to get latest status
        await fetchAttendeesData(selectedYear);
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'ยกเลิกเช็คอินสำเร็จ!',
          text: 'ผู้เข้าร่วมได้รับการยกเลิกเช็คอินแล้ว',
          timer: 2000,
          showConfirmButton: false
        });
        console.log('✅ Check-in canceled successfully');
      } else {
        console.error('Check-out failed:', response.data.message);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'เกิดข้อผิดพลาดในการยกเลิกเช็คอิน: ' + response.data.message
        });
      }
    } catch (error) {
      console.error('Error during check-out:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'เกิดข้อผิดพลาดในการยกเลิกเช็คอิน กรุณาลองใหม่อีกครั้ง'
      });
    } finally {
      setLoadingActions(prev => ({ ...prev, [`checkout-${attendeeId}`]: false }));
    }
  };

  const getCheckInStatusColor = (attendee) => {
    if (attendee.checkedIn) return 'bg-green-100 text-green-800';
    if (attendee.checkInRequested) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getCheckInStatusText = (attendee) => {
    if (attendee.checkedIn) return 'เช็คอินแล้ว';
    if (attendee.checkInRequested) return 'รอการยืนยัน';
    return 'ยังไม่เช็คอิน';
  };

  const getCheckedInCount = () => {
    const yearData = getCurrentYearData();
    const allAttendees = [...yearData.general, ...yearData.research, ...yearData.creative];
    return allAttendees.filter(a => a.checkedIn).length;
  };

  const getAvailableYears = () => {
    return Object.keys(attendeesData).sort((a, b) => b.localeCompare(a)); // Sort descending (newest first)
  };

  const createNewYear = (year) => {
    if (!attendeesData[year]) {
      setAttendeesData(prev => ({
        ...prev,
        [year]: {
          general: [],
          research: [],
          creative: []
        }
      }));
      setSelectedYear(year);
    }
  };

  const getPreviousYearData = () => {
    const prevYear = (parseInt(selectedYear) - 1).toString();
    return attendeesData[prevYear] || null;
  };

  const getYearComparison = () => {
    const currentData = getCurrentYearData();
    const prevData = getPreviousYearData();
    
    if (!prevData) return null;
    
    const currentTotal = currentData.general.length + currentData.research.length + currentData.creative.length;
    const prevTotal = prevData.general.length + prevData.research.length + prevData.creative.length;
    const difference = currentTotal - prevTotal;
    const percentage = prevTotal > 0 ? ((difference / prevTotal) * 100).toFixed(1) : 0;
    
    return { difference, percentage, prevYear: (parseInt(selectedYear) - 1).toString() };
  };

  const getCheckInUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/checkin?year=${selectedYear}`;
  };

  const generateQRCode = () => {
    const url = getCheckInUrl();
    // ในระบบจริงจะใช้ library สำหรับสร้าง QR Code
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    return qrCodeUrl;
  };

  const copyCheckInUrl = async () => {
    try {
      await navigator.clipboard.writeText(getCheckInUrl());
      // แสดง toast notification ในระบบจริง
      alert('คัดลอกลิงก์เรียบร้อยแล้ว!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const getPendingRequestsCount = () => {
    const yearData = getCurrentYearData();
    const allAttendees = [...yearData.general, ...yearData.research, ...yearData.creative];
    return allAttendees.filter(a => a.checkInRequested && !a.checkedIn).length;
  };

  const handleApproveCheckIn = async (attendeeId, type) => {
    try {
      setLoadingActions(prev => ({ ...prev, [`approve-${attendeeId}`]: true }));
      console.log('🔧 Approving check-in for attendee:', attendeeId, 'type:', type);
      const currentTime = new Date().toISOString();
      
      // Use attendeeId directly as it's the registration ID
      const registrationId = attendeeId;
      console.log('✅ Using registration ID:', registrationId);
      
      // Call API to approve check-in using the attendee ID
      const response = await api.put(`/attendees/${registrationId}/checkin`, {
        checked_in: true,
        check_in_requested: false
      });

      if (response.data.success) {
        // Refresh data to get latest status
        await fetchAttendeesData(selectedYear);
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'อนุมัติเช็คอินสำเร็จ!',
          text: 'ผู้เข้าร่วมได้รับการอนุมัติเช็คอินแล้ว',
          timer: 2000,
          showConfirmButton: false
        });
        console.log('✅ Check-in approved successfully');
      } else {
        console.error('Approve check-in failed:', response.data.message);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'เกิดข้อผิดพลาดในการอนุมัติ: ' + response.data.message
        });
      }
    } catch (error) {
      console.error('Error during approve check-in:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'เกิดข้อผิดพลาดในการอนุมัติ กรุณาลองใหม่อีกครั้ง'
      });
    } finally {
      setLoadingActions(prev => ({ ...prev, [`approve-${attendeeId}`]: false }));
    }
  };

  const handleRejectCheckIn = async (attendeeId, type) => {
    try {
      setLoadingActions(prev => ({ ...prev, [`reject-${attendeeId}`]: true }));
      console.log('🔧 Rejecting check-in for attendee:', attendeeId, 'type:', type);
      
      // Use attendeeId directly as it's the registration ID
      const registrationId = attendeeId;
      console.log('✅ Using registration ID:', registrationId);
      
      // Call API to reject check-in request using the attendee ID
      const response = await api.put(`/attendees/${registrationId}/checkin`, {
        check_in_requested: false
      });

      if (response.data.success) {
        // Refresh data to get latest status
        await fetchAttendeesData(selectedYear);
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'ปฏิเสธคำขอเช็คอินสำเร็จ!',
          text: 'คำขอเช็คอินได้รับการปฏิเสธแล้ว',
          timer: 2000,
          showConfirmButton: false
        });
        console.log('✅ Check-in rejected successfully');
      } else {
        console.error('Reject check-in failed:', response.data.message);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'เกิดข้อผิดพลาดในการปฏิเสธ: ' + response.data.message
        });
      }
    } catch (error) {
      console.error('Error during reject check-in:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'เกิดข้อผิดพลาดในการปฏิเสธ กรุณาลองใหม่อีกครั้ง'
      });
    } finally {
      setLoadingActions(prev => ({ ...prev, [`reject-${attendeeId}`]: false }));
    }
  };

  const AttendeeTable = ({ attendees, type }) => {
    if (loading) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">กำลังโหลดข้อมูลผู้เข้าร่วมงาน...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchAttendeesData(selectedYear)} variant="outline">
              ลองใหม่
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อผู้เข้าร่วม</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">องค์กร</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะลงทะเบียน</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะเช็คอิน</th>
              {(type === 'research' || type === 'creative') && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อผลงาน</th>}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่ลงทะเบียน</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendees.map((attendee) => (
              <tr key={attendee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900">{attendee.name}</div>
                    <div className="text-sm text-gray-500">{attendee.email}</div>
                    <div className="text-sm text-gray-500">{attendee.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">{attendee.organization}</div>
                  <div className="text-xs text-gray-500">{attendee.education}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(attendee.status)}`}>
                    {getStatusText(attendee.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getCheckInStatusColor(attendee)}`}>
                      {getCheckInStatusText(attendee)}
                    </span>
                    <div className="text-xs text-gray-500">
                      {attendee.checkedIn && attendee.checkInTime && (
                        <div>เช็คอิน: {new Date(attendee.checkInTime).toLocaleString('th-TH')}</div>
                      )}
                      {attendee.checkInRequested && attendee.checkInRequestTime && !attendee.checkedIn && (
                        <div>ส่งคำขอ: {new Date(attendee.checkInRequestTime).toLocaleString('th-TH')}</div>
                      )}
                    </div>
                  </div>
                </td>
                {(type === 'research' || type === 'creative') && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    {attendee.projectTitle ? (
                      <div>
                        <div className="text-sm font-medium">{attendee.projectTitle}</div>
                        <div className="text-xs text-gray-500">{getCategoryText(attendee.category)}</div>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 ${getSubmissionStatusColor(attendee.submissionStatus)}`}>
                          {getSubmissionStatusText(attendee.submissionStatus)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    {formatDate(attendee.registeredAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">

                    {/* Debug: Log button display logic */}
                    {console.log(`🔘 Button logic for ${attendee.name}:`, {
                      checkInRequested: attendee.checkInRequested,
                      checkedIn: attendee.checkedIn,
                      shouldShowApproveReject: attendee.checkInRequested && !attendee.checkedIn,
                      shouldShowCheckIn: !attendee.checkedIn && !attendee.checkInRequested,
                      shouldShowCheckOut: attendee.checkedIn
                    })}
                    {attendee.checkInRequested && !attendee.checkedIn ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => {
                            console.log('🔘 Approve button clicked for attendee:', attendee.id, 'type:', type);
                            handleApproveCheckIn(attendee.id, type);
                          }}
                          disabled={loadingActions[`approve-${attendee.id}`]}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {loadingActions[`approve-${attendee.id}`] ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-1" />
                          )}
                          {loadingActions[`approve-${attendee.id}`] ? 'กำลังดำเนินการ...' : 'อนุมัติ'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            console.log('🔘 Reject button clicked for attendee:', attendee.id, 'type:', type);
                            handleRejectCheckIn(attendee.id, type);
                          }}
                          disabled={loadingActions[`reject-${attendee.id}`]}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          {loadingActions[`reject-${attendee.id}`] ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-1" />
                          )}
                          {loadingActions[`reject-${attendee.id}`] ? 'กำลังดำเนินการ...' : 'ปฏิเสธ'}
                        </Button>
                      </>
                    ) : !attendee.checkedIn ? (
                      <Button
                        size="sm"
                        onClick={() => handleCheckIn(attendee.id, type)}
                        disabled={loadingActions[`checkin-${attendee.id}`]}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {loadingActions[`checkin-${attendee.id}`] ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        )}
                        {loadingActions[`checkin-${attendee.id}`] ? 'กำลังดำเนินการ...' : 'เช็คอิน'}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCheckOut(attendee.id, type)}
                        disabled={loadingActions[`checkout-${attendee.id}`]}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        {loadingActions[`checkout-${attendee.id}`] ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-1" />
                        )}
                        {loadingActions[`checkout-${attendee.id}`] ? 'กำลังดำเนินการ...' : 'ยกเลิกเช็คอิน'}
                      </Button>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>การดำเนินการ</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Eye className="w-4 h-4 mr-2" />
                              ดูรายละเอียด
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>รายละเอียดผู้เข้าร่วม</DialogTitle>
                              <DialogDescription>
                                ข้อมูลการลงทะเบียนของ {attendee.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">ชื่อ:</span>
                                  <span className="text-sm font-medium">{attendee.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">อีเมล:</span>
                                  <span className="text-sm">{attendee.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">โทรศัพท์:</span>
                                  <span className="text-sm">{attendee.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Building className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">องค์กร:</span>
                                  <span className="text-sm">{attendee.organization}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">การศึกษา:</span>
                                  <span className="text-sm">{attendee.education}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">วันที่ลงทะเบียน:</span>
                                  <span className="text-sm">{formatDate(attendee.registeredAt)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">สถานะเช็คอิน:</span>
                                  <span className={`text-sm px-2 py-1 rounded-full ${getCheckInStatusColor(attendee)}`}>
                                    {getCheckInStatusText(attendee)}
                                  </span>
                                </div>
                                {attendee.checkInRequestTime && (
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">เวลาส่งคำขอ:</span>
                                    <span className="text-sm">{new Date(attendee.checkInRequestTime).toLocaleString('th-TH')}</span>
                                  </div>
                                )}
                                {attendee.checkedIn && attendee.checkInTime && (
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">เวลาเช็คอิน:</span>
                                    <span className="text-sm">{new Date(attendee.checkInTime).toLocaleString('th-TH')}</span>
                                  </div>
                                )}
                              </div>
                              {attendee.projectTitle && (
                                <div className="space-y-3">
                                  <div>
                                    <span className="text-sm text-gray-600">ชื่อผลงาน:</span>
                                    <p className="text-sm font-medium mt-1">{attendee.projectTitle}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-600">ประเภท:</span>
                                    <p className="text-sm mt-1">{getCategoryText(attendee.category)}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-600">สถานะการส่งผลงาน:</span>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getSubmissionStatusColor(attendee.submissionStatus)}`}>
                                      {getSubmissionStatusText(attendee.submissionStatus)}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          ส่งอีเมล
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {attendees.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">ไม่พบข้อมูลผู้เข้าร่วมที่ตรงกับเงื่อนไขการค้นหา</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">รายชื่อผู้เข้าร่วมงาน</h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-gray-600">จัดการและเช็ครายชื่อผู้ลงทะเบียนเข้าร่วม SACIT Symposium {selectedYear}</p>
            {getYearComparison() && (
              <div className="flex items-center gap-1 text-sm">
                {getYearComparison().difference >= 0 ? (
                  <span className="text-green-600 font-medium">
                    ↗ +{getYearComparison().difference} ({getYearComparison().percentage}%)
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">
                    ↘ {getYearComparison().difference} ({getYearComparison().percentage}%)
                  </span>
                )}
                <span className="text-gray-500">จากปี {getYearComparison().prevYear}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {getAvailableYears().map((year) => (
              <option key={year} value={year}>
                ปี {year}
              </option>
            ))}
          </select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const nextYear = (parseInt(selectedYear) + 1).toString();
              createNewYear(nextYear);
            }}
          >
            + เพิ่มปี {parseInt(selectedYear) + 1}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              console.log('🔄 Manual refresh triggered');
              fetchAttendeesData(selectedYear);
            }}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            รีเฟรช
          </Button>
          <Button variant="outline" onClick={() => handleExport('all')}>
            <Download className="w-4 h-4 mr-2" />
            Export ทั้งหมด
          </Button>
        </div>
      </div>

      {/* QR Code Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Code สำหรับเช็คอิน</h3>
            <p className="text-gray-600 mb-4">
              ให้ผู้เข้าร่วมงานสแกน QR Code หรือเข้าลิงก์เพื่อเช็คอินตัวเองได้
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={copyCheckInUrl}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                คัดลอกลิงก์
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(getCheckInUrl(), '_blank')}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                ดูหน้าเช็คอิน
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowQRModal(true)}
                className="flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                ดู QR Code
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-3">
              <img
                src={generateQRCode()}
                alt="QR Code สำหรับเช็คอิน"
                className="w-32 h-32"
              />
            </div>
            <p className="text-sm text-gray-500 text-center">
              QR Code สำหรับปี {selectedYear}
            </p>
            <p className="text-xs text-gray-400 text-center mt-1">
              {getCheckInUrl()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">ผู้เข้าร่วมทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalCount()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">ยืนยันแล้ว</p>
              <p className="text-2xl font-bold text-gray-900">{getConfirmedCount()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">นำเสนอผลงานวิจัย</p>
              <p className="text-2xl font-bold text-gray-900">{getCurrentYearData().research.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Palette className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">นำเสนอผลงานสร้างสรรค์</p>
              <p className="text-2xl font-bold text-gray-900">{getCurrentYearData().creative.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">เช็คอินแล้ว</p>
              <p className="text-2xl font-bold text-gray-900">{getCheckedInCount()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">รอการยืนยัน</p>
              <p className="text-2xl font-bold text-gray-900">{getPendingRequestsCount()}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="ค้นหาชื่อ, อีเมล, หรือองค์กร..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select 
              value={selectedFilter} 
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">ทั้งหมด</option>
              <option value="confirmed">ยืนยันแล้ว</option>
              <option value="pending">รอยืนยัน</option>
              <option value="cancelled">ยกเลิก</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendees Tabs */}
      <div className="space-y-6">
        <div className="grid w-full grid-cols-3 gap-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'general'
                ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            เข้าร่วมทั่วไป ({getCurrentYearData().general.length})
          </button>
          <button
            onClick={() => setActiveTab('research')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'research'
                ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            นำเสนอวิจัย ({getCurrentYearData().research.length})
          </button>
          <button
            onClick={() => setActiveTab('creative')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'creative'
                ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            นำเสนอสร้างสรรค์ ({getCurrentYearData().creative.length})
          </button>
        </div>

        {activeTab === 'general' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">ผู้เข้าร่วมทั่วไป</h3>
              <Button variant="outline" size="sm" onClick={() => handleExport('general')}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            <AttendeeTable attendees={filterAttendees(getCurrentYearData().general)} type="general" />
          </div>
        )}

        {activeTab === 'research' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">ผู้นำเสนอผลงานวิจัย/บทความวิชาการ</h3>
              <Button variant="outline" size="sm" onClick={() => handleExport('research')}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            <AttendeeTable attendees={filterAttendees(getCurrentYearData().research)} type="research" />
          </div>
        )}

        {activeTab === 'creative' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">ผู้นำเสนอผลงานสร้างสรรค์</h3>
              <Button variant="outline" size="sm" onClick={() => handleExport('creative')}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            <AttendeeTable attendees={filterAttendees(getCurrentYearData().creative)} type="creative" />
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">QR Code สำหรับเช็คอิน</DialogTitle>
            <DialogDescription className="text-center">
              ให้ผู้เข้าร่วมงานสแกน QR Code นี้เพื่อเช็คอินตัวเอง
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-6 py-4">
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm">
              <img
                src={generateQRCode()}
                alt="QR Code สำหรับเช็คอิน"
                className="w-64 h-64"
              />
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-gray-900">
                SACIT Symposium {selectedYear}
              </p>
              <p className="text-xs text-gray-500 break-all">
                {getCheckInUrl()}
              </p>
            </div>
            
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={copyCheckInUrl}
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                คัดลอกลิงก์
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(getCheckInUrl(), '_blank')}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                ดูหน้าเช็คอิน
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                แสดง QR Code นี้ที่จุดลงทะเบียนหรือส่งลิงก์ให้ผู้เข้าร่วมงาน
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendeesPage; 