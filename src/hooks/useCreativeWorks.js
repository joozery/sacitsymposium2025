import { useState, useEffect, useCallback } from 'react';

const useCreativeWorks = () => {
  const [creativeWorks, setCreativeWorks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCreativeWorks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Fetching creative works data from static files...');
      
      // Import data from creative works pages
      const lacquerwareData = [
        {
          id: 1,
          title: 'นาย พิจักษณ์ บาลี',
          artist: 'นาย พิจักษณ์ บาลี',
          organization: 'ประทิน เครื่องเขิน, มทร.ล้านนา',
          description: 'ผลงานเครื่องเขินที่ใช้ลักษณะการเขียนลวดลายโดยใช้รูปแบบการเขียนลายหางในรูปแบบของลายสันป่าตองต้นแหน เชียงใหม่',
          image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative%20work/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%B4%E0%B8%99/1.%20%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%9E%E0%B8%B4%E0%B8%88%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B9%8C%20%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%B5/Pic/3.jpg',
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
          category: 'เครื่องรักลาย',
          year: '2024',
          location: 'กรุงเทพมหานคร'
        }
      ];

      const handicraftsData = [
        {
          id: 1,
          title: 'น.ส.อัจฉราภรณ์ กล่ำเกลื่อน',
          artist: 'อาจารย์ สมศักดิ์ ช่างทอง',
          organization: 'มหาวิทยาลัยศิลปากร',
          description: 'ผลงานเครื่องเงินแกะสลักลายไทยประยุกต์ ที่ผสมผสานเทคนิคดั้งเดิมกับการออกแบบสมัยใหม่',
          image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%AB%E0%B8%B1%E0%B8%95%E0%B8%96%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B9%8C%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%93%E0%B8%B5%E0%B8%95%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B9%8C/1.+%E0%B8%99.%E0%B8%AA.%E0%B8%AD%E0%B8%B1%E0%B8%88%E0%B8%89%E0%B8%A3%E0%B8%B2%E0%B8%A0%E0%B8%A3%E0%B8%93%E0%B9%8C+%E0%B8%81%E0%B8%95%E0%B9%88%E0%B8%B3%E0%B9%80%E0%B8%81%E0%B8%A5%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99/pic/4.jpg',
          category: 'เครื่องเงิน',
          year: '2024',
          location: 'กรุงเทพมหานคร'
        }
      ];

      const appliedData = [
        {
          id: 1,
          title: 'ผศ.กนกนาฏ พรหมนคร',
          artist: 'อาจารย์ สมพร ไผ่เขียว',
          organization: 'มหาวิทยาลัยเกษตรศาสตร์',
          description: 'ผลิตภัณฑ์เครื่องใช้ในครัวจากไผ่ที่นำมาประยุกต์ใช้ในชีวิตประจำวันแบบยั่งยืน',
          image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%AB%E0%B8%B1%E0%B8%95%E0%B8%96%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%A2%E0%B8%B8%E0%B8%81%E0%B8%95%E0%B9%8C/1.+%E0%B8%9C%E0%B8%A8.%E0%B8%81%E0%B8%99%E0%B8%81%E0%B8%99%E0%B8%B2%E0%B8%8F+%E0%B8%9E%E0%B8%A3%E0%B8%AB%E0%B8%A1%E0%B8%99%E0%B8%84%E0%B8%A3/pic/4.jpg',
          category: 'ผลิตภัณฑ์ไผ่',
          year: '2024',
          location: 'กรุงเทพมหานคร'
        }
      ];

      const localData = [
        {
          id: 1,
          title: 'นายอิสระ ชูภักดี',
          artist: 'คุณ สมหญิง ไหมทอง',
          organization: 'กลุ่มทอผ้าบ้านโนนสวรรค์',
          description: 'ผ้าไหมมัดหมี่ลวดลายพื้นเมืองอีสาน ที่สืบทอดเทคนิคการทอแบบดั้งเดิมมากว่า 100 ปี',
          image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%AB%E0%B8%B1%E0%B8%95%E0%B8%96%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%96%E0%B8%B4%E0%B9%88%E0%B8%99+%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%AD%E0%B8%B7%E0%B9%88%E0%B8%99+%E0%B9%86/1.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%AD%E0%B8%B4%E0%B8%AA%E0%B8%A3%E0%B8%B0+%E0%B8%8A%E0%B8%B9%E0%B8%A0%E0%B8%B1%E0%B8%81%E0%B8%94%E0%B8%B5/pic/4.jpg',
          category: 'ผ้าไหมมัดหมี่',
          year: '2024',
          location: 'ขอนแก่น'
        }
      ];

      // Combine all data
      const allWorks = [
        ...lacquerwareData.map(item => ({
          ...item,
          name: item.title,
          owner_name: item.artist,
          photo_url: item.image,
          type: 'ผลิตภัณฑ์',
          pageUrl: '/creative-works/lacquerware'
        })),
        ...handicraftsData.map(item => ({
          ...item,
          name: item.title,
          owner_name: item.artist,
          photo_url: item.image,
          type: 'บทความ',
          pageUrl: '/creative-works/handicrafts'
        })),
        ...appliedData.map(item => ({
          ...item,
          name: item.title,
          owner_name: item.artist,
          photo_url: item.image,
          type: 'ประกาศ',
          pageUrl: '/creative-works/applied'
        })),
        ...localData.map(item => ({
          ...item,
          name: item.title,
          owner_name: item.artist,
          photo_url: item.image,
          type: 'บทความ',
          pageUrl: '/creative-works/local'
        }))
      ];

      // Take only first 4 items for display
      const displayWorks = allWorks.slice(0, 4);
      
      console.log('✅ Creative works data received:', displayWorks);
      setCreativeWorks(displayWorks);

    } catch (error) {
      console.error('❌ Error fetching creative works:', error);
      setError(error.message);
      
      // Fallback data
      const fallbackWorks = [
        {
          id: 1,
          name: 'ผาสาทแก้ว',
          description: 'ผ้าไหมทอลายโบราณ ผาสาทแก้ว',
          owner_name: 'ครูณกรณ์ ตั้งหลัก',
          photo_url: '/src/assets/gallery/01.jpg',
          category: 'ผ้าทอพื้นเมือง',
          type: 'ผลิตภัณฑ์',
          pageUrl: '/creative-works/lacquerware'
        },
        {
          id: 2,
          name: 'หัตถกรรมจักสาน',
          description: 'ตะกร้าไม้ไผ่ลวดลายประณีต',
          owner_name: 'กลุ่มแม่บ้านสร้างสรรค์',
          photo_url: '/src/assets/gallery/02.jpg',
          category: 'งานจักสาน',
          type: 'บทความ',
          pageUrl: '/creative-works/handicrafts'
        },
        {
          id: 3,
          name: 'Crafts Bangkok 2025',
          description: 'ประกาศรายชื่อผู้ผ่านการคัดเลือกเข้าร่วมจำหน่ายสินค้าในงาน Crafts Bangkok 2025',
          owner_name: '',
          photo_url: '/src/assets/gallery/03.jpg',
          category: 'งานแสดงสินค้า',
          type: 'ประกาศ',
          pageUrl: '/creative-works/applied'
        },
        {
          id: 4,
          name: 'เครื่องปั้นดินเผาลายคราม',
          description: 'ศิลปะเครื่องปั้นดินเผาแบบดั้งเดิม ลวดลายสีคราม',
          owner_name: 'อาจารย์สมศรี วิจิตรศิลป์',
          photo_url: '/src/assets/gallery/04.jpg',
          category: 'เครื่องปั้นดินเผา',
          type: 'บทความ',
          pageUrl: '/creative-works/local'
        }
      ];
      
      setCreativeWorks(fallbackWorks);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCreativeWorks();
  }, [fetchCreativeWorks]);

  return {
    creativeWorks,
    loading,
    error,
    refetch: fetchCreativeWorks
  };
};

export default useCreativeWorks;
