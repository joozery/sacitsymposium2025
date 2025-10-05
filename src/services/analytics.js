import ReactGA from 'react-ga4';

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-XHDQ3NB0MB'; // ID จริงของ SACIT Symposium
const GA_MEASUREMENT_ID_KEY = 'ga_measurement_id';
let isInitialized = false;

const analytics = {
  init: (measurementId = GA_MEASUREMENT_ID) => {
    if (measurementId && !isInitialized) {
      ReactGA.initialize(measurementId);
      isInitialized = true;
      console.log('🚀 Google Analytics initialized with ID:', measurementId);
    }
  },

  trackPageView: (path, title = '') => {
    if (isInitialized) {
      ReactGA.send({ 
        hitType: 'pageview', 
        page: path,
        title: title 
      });
      console.log('📊 Page view tracked:', path);
    }
  },

  trackEvent: (category, action, label, value) => {
    if (isInitialized) {
      ReactGA.event({ 
        category, 
        action, 
        label, 
        value 
      });
      console.log('🎯 Event tracked:', { category, action, label, value });
    }
  },

  trackCertificateDownload: (certificateName) => {
    analytics.trackEvent('engagement', 'certificate_download', certificateName);
  },

  trackRegistration: (registrationType) => {
    analytics.trackEvent('engagement', 'sign_up', registrationType);
  },

  trackFormSubmit: (formName) => {
    analytics.trackEvent('engagement', 'form_submit', formName);
  },

  trackSearch: (searchTerm) => {
    analytics.trackEvent('engagement', 'search', searchTerm);
  },

  setMeasurementId: (id) => {
    localStorage.setItem(GA_MEASUREMENT_ID_KEY, id);
    isInitialized = false; // Re-initialize if ID changes
    analytics.init(id);
  },

  getMeasurementId: () => {
    return localStorage.getItem(GA_MEASUREMENT_ID_KEY) || GA_MEASUREMENT_ID;
  },

  isWorking: () => {
    return isInitialized;
  },

  // Mock data for development/unconnected state
  getAnalyticsData: async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          totalVisitors: '12,345',
          totalDownloads: '5,678',
          todayVisitors: '456',
          todayDownloads: '89',
          trafficSources: [
            { name: 'Google Search', value: '60%', color: 'bg-blue-500' },
            { name: 'Direct', value: '25%', color: 'bg-green-500' },
            { name: 'Social Media', value: '10%', color: 'bg-sky-500' },
            { name: 'Referrals', value: '5%', color: 'bg-yellow-500' },
          ],
          topKeywords: [
            { keyword: 'ใบประกาศนียบัตร SACIT', count: 120, source: 'Google' },
            { keyword: 'กิจกรรม SACIT 2025', count: 95, source: 'Direct' },
            { keyword: 'ดาวน์โหลดเกียรติบัตร', count: 70, source: 'Google' },
            { keyword: 'งานประชุมวิชาการ SACIT', count: 50, source: 'Facebook' },
            { keyword: 'QR Code เกียรติบัตร', count: 30, source: 'Google' },
          ],
        });
      }, 1000);
    });
  }
};

// Initialize GA on load with the saved or default ID
analytics.init();

export default analytics;