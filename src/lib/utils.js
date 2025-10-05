import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

// ฟังก์ชันแปลงวันที่เป็นภาษาไทย
export function formatThaiDate(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // ตรวจสอบว่าวันที่ถูกต้อง
    if (isNaN(date.getTime())) return dateString;
    
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543; // แปลงเป็นพุทธศักราช
    
    return `${day} ${month} ${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

// ฟังก์ชันแปลงวันที่และเวลา
export function formatThaiDateTime(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return dateString;
    
    const thaiDate = formatThaiDate(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${thaiDate} เวลา ${hours}:${minutes} น.`;
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return dateString;
  }
}

// ฟังก์ชันแปลงวันที่แบบสั้น
export function formatThaiDateShort(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return dateString;
    
    const day = date.getDate();
    const month = date.getMonth() + 1; // เดือนแบบตัวเลข
    const year = date.getFullYear() + 543;
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}