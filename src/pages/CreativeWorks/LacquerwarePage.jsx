import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import cover5 from '/src/assets/cover5.jpg';

const LacquerwarePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Add CSS animation
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const works = [
    {
      id: 1,
      title: 'นาย พิจักษณ์ บาลี',
      artist: 'นาย พิจักษณ์ บาลี',
      organization: 'ประทิน เครื่องเขิน, มทร.ล้านนา',
      description: 'ผลงานเครื่องเขินที่ใช้ลักษณะการเขียนลวดลายโดยใช้รูปแบบการเขียนลายหางในรูปแบบของลายสันป่าตองต้นแหน เชียงใหม่',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative%20work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/1.%20%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%9E%E0%B8%B4%E0%B8%88%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B9%8C%20%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%B5/Pic/3.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/1.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%9E%E0%B8%B4%E0%B8%88%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B9%8C+%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%B5/1.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%9E%E0%B8%B4%E0%B8%88%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B9%8C+%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%B5.pdf',
      category: 'เครื่องเขิน',
      year: '2025',
      location: 'เชียงใหม่'
    },
    {
      id: 2,
      title: 'น.ส.สุวิมล เลาหสุวรรณพานิช',
      artist: 'คุณ มาลี สุขใจ',
      organization: 'ศูนย์ศิลปาชีพ',
      description: 'กล่องเครื่องรักที่ประดับด้วยลายดอกไม้แบบไทยประยุกต์ ใช้สีธรรมชาติจากดินและพืช',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/2.+%E0%B8%99.%E0%B8%AA.%E0%B8%AA%E0%B8%B8%E0%B8%A7%E0%B8%B4%E0%B8%A1%E0%B8%A5+%E0%B9%80%E0%B8%A5%E0%B8%B2%E0%B8%AB%E0%B8%AA%E0%B8%B8%E0%B8%A7%E0%B8%A3%E0%B8%A3%E0%B8%93%E0%B8%9E%E0%B8%B2%E0%B8%99%E0%B8%B4%E0%B8%8A/pic/18.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/2.+%E0%B8%99.%E0%B8%AA.%E0%B8%AA%E0%B8%B8%E0%B8%A7%E0%B8%B4%E0%B8%A1%E0%B8%A5+%E0%B9%80%E0%B8%A5%E0%B8%B2%E0%B8%AB%E0%B8%AA%E0%B8%B8%E0%B8%A7%E0%B8%A3%E0%B8%A3%E0%B8%93%E0%B8%9E%E0%B8%B2%E0%B8%99%E0%B8%B4%E0%B8%8A/2.+%E0%B8%99.%E0%B8%AA.%E0%B8%AA%E0%B8%B8%E0%B8%A7%E0%B8%B4%E0%B8%A1%E0%B8%A5+%E0%B9%80%E0%B8%A5%E0%B8%B2%E0%B8%AB%E0%B8%AA%E0%B8%B8%E0%B8%A7%E0%B8%A3%E0%B8%A3%E0%B8%93%E0%B8%9E%E0%B8%B2%E0%B8%99%E0%B8%B4%E0%B8%8A.pdf',
      category: 'เครื่องรักลาย',
      year: '2024',
      location: 'เชียงใหม่'
    },
    {
      id: 3,
      title: 'สุวิมล เลาหสุวรรณพานิช ปูรณฆฏะ',
      artist: 'อาจารย์ วิชัย รักศิลป์',
      organization: 'มหาวิทยาลัยเชียงใหม่',
      description: 'ถาดเครื่องเขินที่ผสมผสานเทคนิคดั้งเดิมกับดีไซน์สมัยใหม่',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/3.+%E0%B8%AA%E0%B8%B8%E0%B8%A7%E0%B8%B4%E0%B8%A1%E0%B8%A5+%E0%B9%80%E0%B8%A5%E0%B8%B2%E0%B8%AB%E0%B8%AA%E0%B8%B8%E0%B8%A7%E0%B8%A3%E0%B8%A3%E0%B8%93%E0%B8%9E%E0%B8%B2%E0%B8%99%E0%B8%B4%E0%B8%8A+%E0%B8%9B%E0%B8%B9%E0%B8%A3%E0%B8%93%E0%B8%86%E0%B8%8F%E0%B8%B0/pic/5.png',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/3.+%E0%B8%AA%E0%B8%B8%E0%B8%A7%E0%B8%B4%E0%B8%A1%E0%B8%A5+%E0%B9%80%E0%B8%A5%E0%B8%B2%E0%B8%AB%E0%B8%AA%E0%B8%B8%E0%B8%A7%E0%B8%A3%E0%B8%A3%E0%B8%93%E0%B8%9E%E0%B8%B2%E0%B8%99%E0%B8%B4%E0%B8%8A+%E0%B8%9B%E0%B8%B9%E0%B8%A3%E0%B8%93%E0%B8%86%E0%B8%8F%E0%B8%B0/3.+%E0%B8%AA%E0%B8%B8%E0%B8%A7%E0%B8%B4%E0%B8%A1%E0%B8%A5+%E0%B9%80%E0%B8%A5%E0%B8%B2%E0%B8%AB%E0%B8%AA%E0%B8%B8%E0%B8%A7%E0%B8%A3%E0%B8%A3%E0%B8%93%E0%B8%9E%E0%B8%B2%E0%B8%99%E0%B8%B4%E0%B8%8A+SACIT+Symposium+%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%9F%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%A1%E0%B8%99%E0%B8%B3%E0%B9%80%E0%B8%AA%E0%B8%99%E0%B8%AD%E0%B8%9C%E0%B8%A5%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%AA%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%AA%E0%B8%A3%E0%B8%A3%E0%B8%84%E0%B9%8C+%E0%B8%9B%E0%B8%B9%E0%B8%A3%E0%B8%93%E0%B8%86%E0%B8%8F%E0%B8%B0.pdf',
      category: 'เครื่องเขิน',
      year: '2024',
      location: 'เชียงใหม่'
    },
    {
      id: 4,
      title: 'น.ส.ฐิตาภา รัตนะ',
      artist: 'คุณ ประยูร ศิลปะไทย',
      organization: 'โรงเรียนศิลปะไทย',
      description: 'ชุดเครื่องรักที่ประดับด้วยทองคำเปลวตามแบบโบราณ',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/4.+%E0%B8%99.%E0%B8%AA.%E0%B8%90%E0%B8%B4%E0%B8%95%E0%B8%B2%E0%B8%A0%E0%B8%B2+%E0%B8%A3%E0%B8%B1%E0%B8%95%E0%B8%99%E0%B8%B0/pic/3.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/4.+%E0%B8%99.%E0%B8%AA.%E0%B8%90%E0%B8%B4%E0%B8%95%E0%B8%B2%E0%B8%A0%E0%B8%B2+%E0%B8%A3%E0%B8%B1%E0%B8%95%E0%B8%99%E0%B8%B0/4.+%E0%B8%99.%E0%B8%AA.%E0%B8%90%E0%B8%B4%E0%B8%95%E0%B8%B2%E0%B8%A0%E0%B8%B2+%E0%B8%A3%E0%B8%B1%E0%B8%95%E0%B8%99%E0%B8%B0+-+%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81+-+%E0%B8%A3%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%AD%E0%B8%A2%E0%B9%81%E0%B8%AB%E0%B9%88%E0%B8%87%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%97%E0%B8%A3%E0%B8%87.pdf',
      category: 'เครื่องรักทอง',
      year: '2024',
      location: 'อยุธยา'
    },
    {
      id: 5,
      title: 'อาจารย์ รัตนา แสงทอง',
      artist: 'อาจารย์ รัตนา แสงทอง',
      organization: 'มหาวิทยาลัยมหิดล',
      description: 'กล่องเครื่องเขินที่วาดลายนกยูงด้วยเทคนิคการเขียนสีแบบโบราณ',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/5.+%E0%B8%AD%E0%B8%B1%E0%B8%88%E0%B8%89%E0%B8%A3%E0%B8%B2%E0%B8%A0%E0%B8%A3%E0%B8%93%E0%B9%8C+%E0%B8%81%E0%B8%A5%E0%B9%88%E0%B8%B3%E0%B9%80%E0%B8%81%E0%B8%A5%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99+(%E0%B8%95%E0%B9%89%E0%B8%99%E0%B8%A3%E0%B8%B1%E0%B8%81)/pic/4.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/5.+%E0%B8%AD%E0%B8%B1%E0%B8%88%E0%B8%89%E0%B8%A3%E0%B8%B2%E0%B8%A0%E0%B8%A3%E0%B8%93%E0%B9%8C+%E0%B8%81%E0%B8%A5%E0%B9%88%E0%B8%B3%E0%B9%80%E0%B8%81%E0%B8%A5%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99+(%E0%B8%95%E0%B9%89%E0%B8%99%E0%B8%A3%E0%B8%B1%E0%B8%81)/5.+%E0%B8%AD%E0%B8%B1%E0%B8%88%E0%B8%89%E0%B8%A3%E0%B8%B2%E0%B8%A0%E0%B8%A3%E0%B8%93%E0%B9%8C+%E0%B8%81%E0%B8%A5%E0%B9%88%E0%B8%B3%E0%B9%80%E0%B8%81%E0%B8%A5%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99+(%E0%B8%95%E0%B9%89%E0%B8%99%E0%B8%A3%E0%B8%B1%E0%B8%81).pdf',
      category: 'เครื่องเขินลาย',
      year: '2024',
      location: 'นครปฐม'
    },
    {
      id: 6,
      title: 'คุณ สุชาติ วัฒนศิลป์',
      artist: 'คุณ สุชาติ วัฒนศิลป์',
      organization: 'ศูนย์ส่งเสริมศิลปาชีพ',
      description: 'ชุดเครื่องรักมุกที่ประยุกต์ใช้ในชีวิตประจำวันสมัยใหม่',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/6.+%E0%B8%AA%E0%B8%B8%E0%B8%8A%E0%B8%B2%E0%B8%95%E0%B8%B4+%E0%B8%AA%E0%B8%B8%E0%B8%82%E0%B8%99%E0%B8%B2+%E0%B8%8A%E0%B8%B4%E0%B9%89%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88+1/pic/4.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/5.+%E0%B8%AD%E0%B8%B1%E0%B8%88%E0%B8%89%E0%B8%A3%E0%B8%B2%E0%B8%A0%E0%B8%A3%E0%B8%93%E0%B9%8C+%E0%B8%81%E0%B8%A5%E0%B9%88%E0%B8%B3%E0%B9%80%E0%B8%81%E0%B8%A5%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99+(%E0%B8%95%E0%B9%89%E0%B8%99%E0%B8%A3%E0%B8%B1%E0%B8%81)/5.+%E0%B8%AD%E0%B8%B1%E0%B8%88%E0%B8%89%E0%B8%A3%E0%B8%B2%E0%B8%A0%E0%B8%A3%E0%B8%93%E0%B9%8C+%E0%B8%81%E0%B8%A5%E0%B9%88%E0%B8%B3%E0%B9%80%E0%B8%81%E0%B8%A5%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99+(%E0%B8%95%E0%B9%89%E0%B8%99%E0%B8%A3%E0%B8%B1%E0%B8%81).pdf',
      category: 'เครื่องรักมุก',
      year: '2024',
      location: 'สุโขทัย'
    },
    {
      id: 7,
      title: 'อาจารย์ สมพร ศิลปิน',
      artist: 'อาจารย์ สมพร ศิลปิน',
      organization: 'มหาวิทยาลัยศิลปกรรมศาสตร์',
      description: 'หีบเครื่องเขินที่ตกแต่งด้วยลายกนกแบบดั้งเดิม ใช้เทคนิคการเขียนสีที่ละเอียดประณีต',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/7.++%E0%B8%AA%E0%B8%B8%E0%B8%8A%E0%B8%B2%E0%B8%95%E0%B8%B4+%E0%B8%AA%E0%B8%B8%E0%B8%82%E0%B8%99%E0%B8%B2+%E0%B8%8A%E0%B8%B4%E0%B9%89%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88+2/pic/3.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/7.++%E0%B8%AA%E0%B8%B8%E0%B8%8A%E0%B8%B2%E0%B8%95%E0%B8%B4+%E0%B8%AA%E0%B8%B8%E0%B8%82%E0%B8%99%E0%B8%B2+%E0%B8%8A%E0%B8%B4%E0%B9%89%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88+2/7.++%E0%B8%AA%E0%B8%B8%E0%B8%8A%E0%B8%B2%E0%B8%95%E0%B8%B4+%E0%B8%AA%E0%B8%B8%E0%B8%82%E0%B8%99%E0%B8%B2+%E0%B8%8A%E0%B8%B4%E0%B9%89%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88+2.pdf',
      category: 'เครื่องเขิน',
      year: '2024',
      location: 'กรุงเทพมหานคร'
    },
    {
      id: 8,
      title: 'นางสาวศตพร กว้างขวาง',
      artist: 'คุณ วิมล ทองคำ',
      organization: 'ศูนย์หัตถกรรมไทย',
      description: 'ชุดเครื่องรักที่ประดับด้วยลายไทยแบบดั้งเดิม สะท้อนความงามของศิลปะไทย',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/8.+%E0%B8%99%E0%B8%B2%E0%B8%87%E0%B8%AA%E0%B8%B2%E0%B8%A7%E0%B8%A8%E0%B8%95%E0%B8%9E%E0%B8%A3+%E0%B8%81%E0%B8%A7%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%82%E0%B8%A7%E0%B8%B2%E0%B8%87/pic/7.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/8.+%E0%B8%99%E0%B8%B2%E0%B8%87%E0%B8%AA%E0%B8%B2%E0%B8%A7%E0%B8%A8%E0%B8%95%E0%B8%9E%E0%B8%A3+%E0%B8%81%E0%B8%A7%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%82%E0%B8%A7%E0%B8%B2%E0%B8%87/8.++%E0%B8%99%E0%B8%B2%E0%B8%87%E0%B8%AA%E0%B8%B2%E0%B8%A7%E0%B8%A8%E0%B8%95%E0%B8%9E%E0%B8%A3+%E0%B8%81%E0%B8%A7%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%82%E0%B8%A7%E0%B8%B2%E0%B8%87.pdf',
      category: 'เครื่องรัก',
      year: '2024',
      location: 'นครศรีธรรมราช'
    },
    {
      id: 9,
      title: 'นายสุเมธ อินทร์โจม',
      artist: 'อาจารย์ ประชา ช่างเขิน',
      organization: 'วิทยาลัยศิลปกรรม',
      description: 'ถาดเครื่องเขินที่ตกแต่งด้วยลายลิงแบบไทยประยุกต์ ผสมผสานความคลาสสิกกับสมัยใหม่',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/9.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%AA%E0%B8%B8%E0%B9%80%E0%B8%A1%E0%B8%98+%E0%B8%AD%E0%B8%B4%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B9%8C%E0%B9%82%E0%B8%88%E0%B8%A1/pic/6.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/9.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%AA%E0%B8%B8%E0%B9%80%E0%B8%A1%E0%B8%98+%E0%B8%AD%E0%B8%B4%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B9%8C%E0%B9%82%E0%B8%88%E0%B8%A1/9.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%AA%E0%B8%B8%E0%B9%80%E0%B8%A1%E0%B8%98+%E0%B8%AD%E0%B8%B4%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B9%8C%E0%B9%82%E0%B8%88%E0%B8%A1.pdf',
      category: 'เครื่องเขิน',
      year: '2024',
      location: 'ลำปาง'
    },
    {
      id: 10,
      title: 'นายประณัย ณ สมบูรณ์',
      artist: 'คุณ สุภาพร มุกทอง',
      organization: 'กลุ่มช่างศิลป์',
      description: 'กล่องเครื่องรักมุกที่ใช้สีทองเป็นหลัก ประดับด้วยมุกแท้ตามแบบฉบับไทย',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/10.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%93%E0%B8%B1%E0%B8%A2+%E0%B8%93+%E0%B8%AA%E0%B8%A1%E0%B8%9A%E0%B8%B9%E0%B8%A3%E0%B8%93%E0%B9%8C/pic/7.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/10.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%93%E0%B8%B1%E0%B8%A2+%E0%B8%93+%E0%B8%AA%E0%B8%A1%E0%B8%9A%E0%B8%B9%E0%B8%A3%E0%B8%93%E0%B9%8C/10.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%93%E0%B8%B1%E0%B8%A2+%E0%B8%93+%E0%B8%AA%E0%B8%A1%E0%B8%9A%E0%B8%B9%E0%B8%A3%E0%B8%93%E0%B9%8C.pdf',
      category: 'เครื่องรักมุก',
      year: '2024',
      location: 'สมุทรปราการ'
    },
    {
      id: 11,
      title: 'นายประณัย ณ สมบูรณ์',
      artist: 'อาจารย์ สมศักดิ์ ดอกบัว',
      organization: 'มหาวิทยาลัยราชภัฏ',
      description: 'หีบเครื่องเขินที่ตกแต่งด้วยลายดอกบัวอันเป็นสัญลักษณ์ของความบริสุทธิ์',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/11.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%93%E0%B8%B1%E0%B8%A2+%E0%B8%93+%E0%B8%AA%E0%B8%A1%E0%B8%9A%E0%B8%B9%E0%B8%A3%E0%B8%93%E0%B9%8C/pic/3.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/11.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%93%E0%B8%B1%E0%B8%A2+%E0%B8%93+%E0%B8%AA%E0%B8%A1%E0%B8%9A%E0%B8%B9%E0%B8%A3%E0%B8%93%E0%B9%8C/11.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%93%E0%B8%B1%E0%B8%A2+%E0%B8%93+%E0%B8%AA%E0%B8%A1%E0%B8%9A%E0%B8%B9%E0%B8%A3%E0%B8%93%E0%B9%8C.pdf',
      category: 'เครื่องเขิน',
      year: '2024',
      location: 'อุบลราชธานี'
    },
    {
      id: 12,
      title: 'นายเกษมสันต์ ยอดสง่า',
      artist: 'คุณ วิรัช ครุฑทอง',
      organization: 'ศูนย์ศิลปะแห่งชาติ',
      description: 'ชุดเครื่องรักที่ประดับด้วยลายครุฑอันเป็นสัญลักษณ์ของพระมหากษัตริย์',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/12.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%81%E0%B8%A9%E0%B8%A1%E0%B8%AA%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B9%8C+%E0%B8%A2%E0%B8%AD%E0%B8%94%E0%B8%AA%E0%B8%87%E0%B9%88%E0%B8%B2/pic/5.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/12.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%81%E0%B8%A9%E0%B8%A1%E0%B8%AA%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B9%8C+%E0%B8%A2%E0%B8%AD%E0%B8%94%E0%B8%AA%E0%B8%87%E0%B9%88%E0%B8%B2/12.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%81%E0%B8%A9%E0%B8%A1%E0%B8%AA%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B9%8C+%E0%B8%A2%E0%B8%AD%E0%B8%94%E0%B8%AA%E0%B8%87%E0%B9%88%E0%B8%B2.pdf',
      category: 'เครื่องรัก',
      year: '2024',
      location: 'กรุงเทพมหานคร'
    },
    {
      id: 13,
      title: 'นายณรงค์เดช ดอกแก้ว (ขันดอกแก้ว)',
      artist: 'อาจารย์ มาลี เถาวัลย์',
      organization: 'สถาบันศิลปะไทย',
      description: 'ถาดเครื่องเขินที่ตกแต่งด้วยลายเถาวัลย์แบบไทยดั้งเดิม สวยงามและประณีต',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/13.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%93%E0%B8%A3%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B9%80%E0%B8%94%E0%B8%8A++%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7+(%E0%B8%82%E0%B8%B1%E0%B8%99%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7)/pic/4.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/13.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%93%E0%B8%A3%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B9%80%E0%B8%94%E0%B8%8A++%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7+(%E0%B8%82%E0%B8%B1%E0%B8%99%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7)/13.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%93%E0%B8%A3%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B9%80%E0%B8%94%E0%B8%8A++%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7+(%E0%B8%82%E0%B8%B1%E0%B8%99%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7).pdf',
      category: 'เครื่องเขิน',
      year: '2024',
      location: 'เพชรบุรี'
    },
    {
      id: 14,
      title: 'นายณรงค์เดช ดอกแก้ว',
      artist: 'คุณ สุรีย์ พุ่มข้าว',
      organization: 'วิสาหกิจชุมชน',
      description: 'กล่องเครื่องรักที่ตกแต่งด้วยลายพุ่มข้าวสะท้อนวิถีชีวิตเกษตรกรไทย',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/14.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%93%E0%B8%A3%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B9%80%E0%B8%94%E0%B8%8A++%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7+(%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%88%E0%B9%89%E0%B8%B2%E0%B9%83%E0%B8%99%E0%B8%9B%E0%B8%A3%E0%B8%B2%E0%B8%AA%E0%B8%B2%E0%B8%97)/pic/4.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/14.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%93%E0%B8%A3%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B9%80%E0%B8%94%E0%B8%8A++%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7+(%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%88%E0%B9%89%E0%B8%B2%E0%B9%83%E0%B8%99%E0%B8%9B%E0%B8%A3%E0%B8%B2%E0%B8%AA%E0%B8%B2%E0%B8%97)/14.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%93%E0%B8%A3%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B9%80%E0%B8%94%E0%B8%8A++%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7+(%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%88%E0%B9%89%E0%B8%B2%E0%B9%83%E0%B8%99%E0%B8%9B%E0%B8%A3%E0%B8%B2%E0%B8%AA%E0%B8%B2%E0%B8%97).pdf',
      category: 'เครื่องรัก',
      year: '2024',
      location: 'สุพรรณบุรี'
    },
    {
      id: 15,
      title: 'นายบุญฤทธิ์ เจริญชัย',
      artist: 'นายบุญฤทธิ์ เจริญชัย',
      organization: 'มหาวิทยาลัยเทคโนโลยี',
      description: 'หีบเครื่องเขินที่ประดับด้วยลายหงส์อันเป็นสัญลักษณ์ของความสง่างาม',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/15.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%9A%E0%B8%B8%E0%B8%8D%E0%B8%A4%E0%B8%97%E0%B8%98%E0%B8%B4%E0%B9%8C+%E0%B9%80%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%8D%E0%B8%8A%E0%B8%B1%E0%B8%A2/pic/3.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/15.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%9A%E0%B8%B8%E0%B8%8D%E0%B8%A4%E0%B8%97%E0%B8%98%E0%B8%B4%E0%B9%8C+%E0%B9%80%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%8D%E0%B8%8A%E0%B8%B1%E0%B8%A2/15.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%9A%E0%B8%B8%E0%B8%8D%E0%B8%A4%E0%B8%97%E0%B8%98%E0%B8%B4%E0%B9%8C+%E0%B9%80%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%8D%E0%B8%8A%E0%B8%B1%E0%B8%A2.pdf',
      category: 'เครื่องเขิน',
      year: '2024',
      location: 'นครราชสีมา'
    },
    {
      id: 16,
      title: 'นางสาวป่านทิพย์ พัฒรชนม',
      artist: 'คุณ อรพิน มุกแดง',
      organization: 'โรงเรียนศิลปะ',
      description: 'ชุดเครื่องรักมุกที่ใช้สีแดงเป็นหลัก สื่อถึงความมงคลและความเจริญรุ่งเรือง',
              image: cover5,
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/16.+%E0%B8%99%E0%B8%B2%E0%B8%87%E0%B8%AA%E0%B8%B2%E0%B8%A7%E0%B8%9B%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B4%E0%B8%9E%E0%B8%A2%E0%B9%8C+%E0%B8%9E%E0%B8%B1%E0%B8%92%E0%B8%A3%E0%B8%8A%E0%B8%99%E0%B8%A1/16.+%E0%B8%99%E0%B8%B2%E0%B8%87%E0%B8%AA%E0%B8%B2%E0%B8%A7%E0%B8%9B%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B4%E0%B8%9E%E0%B8%A2%E0%B9%8C+%E0%B8%9E%E0%B8%B1%E0%B8%92%E0%B8%A3%E0%B8%8A%E0%B8%99%E0%B8%A1.pdf',
      category: 'เครื่องรักมุก',
      year: '2024',
      location: 'ชลบุรี'
    },
    {
      id: 17,
      title: 'นางสาวรัตนรัตน์ ขาวทุ่ง',
      artist: 'อาจารย์ สมชาย มังกรทอง',
      organization: 'วิทยาลัยช่างศิลป์',
      description: 'ถาดเครื่องเขินที่ตกแต่งด้วยลายมังกรแบบจีน-ไทย ผสมผสานวัฒนธรรมอย่างลงตัว',
              image: cover5,
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/17.+%E0%B8%99%E0%B8%B2%E0%B8%87%E0%B8%AA%E0%B8%B2%E0%B8%A7%E0%B8%A3%E0%B8%B1%E0%B8%95%E0%B8%99%E0%B8%A3%E0%B8%B1%E0%B8%95%E0%B8%99%E0%B9%8C++%E0%B8%82%E0%B8%B2%E0%B8%A7%E0%B8%97%E0%B8%B8%E0%B9%88%E0%B8%87/17.+%E0%B8%99%E0%B8%B2%E0%B8%87%E0%B8%AA%E0%B8%B2%E0%B8%A7%E0%B8%A3%E0%B8%B1%E0%B8%95%E0%B8%99%E0%B8%A3%E0%B8%B1%E0%B8%95%E0%B8%99%E0%B9%8C++%E0%B8%82%E0%B8%B2%E0%B8%A7%E0%B8%97%E0%B8%B8%E0%B9%88%E0%B8%87.pdf',
      category: 'เครื่องเขิน',
      year: '2024',
      location: 'สมุทรสาคร'
    }
  ];

  // Calculate pagination
  const totalPages = Math.ceil(works.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWorks = works.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative mt-20">
        {/* Top Banner */}
        <div className="w-full py-16" style={{
          background: 'linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%)'
        }}>
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-center" style={{
              color: 'rgb(83, 49, 146)',
              fontFamily: 'Prompt',
              fontSize: '48px',
              fontStyle: 'normal',
              fontWeight: '700',
              lineHeight: 'normal'
            }}>
              ผลงานสร้างสรรค์
            </h1>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="w-full py-4" style={{
          background: 'var(--gra-2, linear-gradient(90deg, #533193 0%, #BFB4EE 100%))'
        }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center gap-8">
              <Link to="/news" className="cursor-pointer">
                <span style={{
                  background: 'var(--gra-1, linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Prompt'
                }}>ข่าวสาร</span>
              </Link>
              <Link to="/exhibition" className="cursor-pointer">
                <span style={{
                  background: 'var(--gra-1, linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Prompt'
                }}>นิทรรศการ</span>
              </Link>
              <Link to="/creative-works" className="flex items-center gap-2 cursor-pointer">
                <span className="text-lg text-white">✦</span>
                <span className="font-medium" style={{
                  color: 'rgb(83, 49, 146)',
                  fontFamily: 'Prompt'
                }}>ผลงานสร้างสรรค์</span>
              </Link>
              <Link to="/images" className="cursor-pointer">
                <span style={{
                  background: 'var(--gra-1, linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Prompt'
                }}>ภาพ</span>
              </Link>
              <Link to="/videos" className="cursor-pointer">
                <span style={{
                  background: 'var(--gra-1, linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Prompt'
                }}>วิดีโอ</span>
              </Link>
              <Link to="/proceeding" className="cursor-pointer">
                <span style={{
                  background: 'var(--gra-1, linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Prompt'
                }}>Proceeding</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Dark Purple Bar */}
        <div className="w-full h-2" style={{
          background: '#533193'
        }}></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            to="/creative-works"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
            style={{
              fontFamily: 'Prompt'
            }}
          >
            <span>←</span>
            กลับไปยังผลงานสร้างสรรค์
          </Link>
        </div>

        {/* Works Grid */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center" style={{
            fontFamily: 'Prompt'
          }}>ผลงานเครื่องรัก เครื่องเขิน</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 justify-items-center">
            {currentWorks.map((work, index) => (
              <div 
                key={work.id} 
                className="relative rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fade-in-up cursor-pointer" 
                style={{
                  width: '100%',
                  maxWidth: '350px',
                  height: '450px',
                  flexShrink: 0,
                  animationDelay: `${index * 0.1}s`
                }}
                onClick={() => work.pdfUrl && work.pdfUrl !== '#' && window.open(work.pdfUrl, '_blank')}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={work.image} 
                    alt={work.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/80"></div>
                
                {/* Content */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                  {/* Content Section - All content at bottom */}
                  <div className="space-y-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className="text-white text-xs font-bold px-3 py-1" style={{
                        fontFamily: 'Prompt',
                        borderRadius: '15px',
                        border: '1px solid #B3FFD1',
                        textShadow: '0 1px 2px rgba(0,0,0,0.6)'
                      }}>
                        เครื่องรัก เครื่องเขิน
                      </span>
                      <span className="text-white text-xs font-bold px-3 py-1" style={{
                        fontFamily: 'Prompt',
                        borderRadius: '15px',
                        border: '1px solid #B3FFD1',
                        textShadow: '0 1px 2px rgba(0,0,0,0.6)'
                      }}>
                        {work.category}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white leading-tight" style={{
                      fontFamily: 'Prompt',
                      textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                    }}>
                      {work.title}
                    </h3>
                    
                    {/* Arrow Button */}
                    <div className="flex justify-end">
                      <div 
                        className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (work.pdfUrl && work.pdfUrl !== '#') {
                            window.open(work.pdfUrl, '_blank');
                          }
                        }}
                      >
                        <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
                style={{ fontFamily: 'Prompt' }}
              >
                ก่อนหน้า
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  style={{ fontFamily: 'Prompt' }}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
                style={{ fontFamily: 'Prompt' }}
              >
                ถัดไป
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LacquerwarePage; 