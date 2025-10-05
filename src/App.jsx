import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import analytics from '@/services/analytics';
import Layout from '@/components/Layout';
// import AdminAuthGuard from '@/components/AdminAuthGuard';
import Navbar from '@/components/Navbar';
import Dashboard from '@/pages/Dashboard';
import CertificatesPage from '@/pages/Certificates';
import GoogleAnalytics from '@/pages/GoogleAnalytics';
import MultimediaPage from '@/pages/Multimedia/index';
import SubmissionsReviewPage from '@/pages/SubmissionsReview/index';
import UsersPage from '@/pages/Users/index';
import TemplatesPage from '@/pages/Templates/index';
import EbooksPage from '@/pages/Ebooks/index';
import SettingsPage from '@/pages/Settings/index';
import ExhibitionsPage from '@/pages/Exhibitions/index';
import WorksPage from '@/pages/Works/index';
import LandingPage from '@/pages/LandingPage';
import Register from '@/pages/Register';
import RegisterTerms from '@/pages/RegisterTerms';
import RegisterForm from '@/pages/RegisterForm';
import RegisterResearch from '@/pages/RegisterResearch';
import RegisterCreative from '@/pages/RegisterCreative';
import RegisterSuccess from '@/pages/RegisterSuccess';
import Login from '@/pages/Login';
import AdminLogin from '@/pages/AdminLogin';
import AgendaPage from '@/pages/Agenda/index';
import AdminAgenda from '@/pages/Agenda/AdminAgenda';
import SpeakersPage from '@/pages/Speakers/index';
import AttendeesPage from '@/pages/Attendees/index';
import CheckInPage from '@/pages/CheckIn/index';
import Account from '@/pages/Account';
import { Toaster } from '@/components/ui/toaster';
import About from '@/pages/About';
import CookiePolicy from '@/pages/CookiePolicy';
import SacitSymposiumEN from '@/pages/SacitSymposiumEN';
import SacitSymposiumTH from '@/pages/SacitSymposiumTH';
import News from '@/pages/News';
import Exhibition from '@/pages/News/Exhibition';
import CreativeWorks from '@/pages/CreativeWorks';
import LacquerwarePage from '@/pages/CreativeWorks/LacquerwarePage';
import HandicraftsPage from '@/pages/CreativeWorks/HandicraftsPage';
import AppliedHandicraftsPage from '@/pages/CreativeWorks/AppliedHandicraftsPage';
import LocalHandicraftsPage from '@/pages/CreativeWorks/LocalHandicraftsPage';
import MainExhibitionLacquerLegacy from '@/pages/CreativeWorks/MainExhibitionLacquerLegacy';
import PublicSpeakersPage from '@/pages/Speakers/PublicSpeakersPage';
import CollaborativePartners from '@/pages/CreativeWorks/CollaborativePartners';
import Images from '@/pages/News/Images';
import Videos from '@/pages/News/Videos';
import Proceeding from '@/pages/News/Proceeding';
import FolderDetail from '@/pages/FolderDetail';
import Footer from '@/components/Footer';

const AdminLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

// Component to handle navbar logic
const AppWithNavbar = () => {
  const location = useLocation();

  // Track page views when location changes
  useEffect(() => {
    analytics.trackPageView(location.pathname, document.title);
  }, [location]);
  
  // Determine navbar configuration based on route
  const getNavbarConfig = () => {
    const path = location.pathname;
    
    // Admin pages - no navbar (Layout handles its own navbar)
    if (path.toLowerCase().startsWith('/admin')) {
      return null;
    }
    
    // Login page - no navbar
    if (path === '/login') {
      return null;
    }
    
    // CheckIn page - simple navbar only
    if (path === '/checkin') {
      return { variant: 'simple' };
    }
    
    // Account page - user navbar without navigation
    if (path === '/account') {
      return { showNavigation: false };
    }
    
    // Landing page, Register pages, and other pages - full navbar (same as landing page)
    return {};
  };
  
  const navbarConfig = getNavbarConfig();
  
  const handleFeatureClick = () => {
    console.log("Feature not implemented yet.");
  };
  
  return (
    <>
      {navbarConfig && (
        <Navbar 
          {...navbarConfig}
          onFeatureClick={handleFeatureClick}
        />
      )}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/sacit-symposium-en" element={<SacitSymposiumEN />} />
        <Route path="/sacit-symposium-th" element={<SacitSymposiumTH />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/speakers" element={<PublicSpeakersPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/submissions" element={<SubmissionsReviewPage />} />
        <Route path="/news" element={<CreativeWorks />} />
        <Route path="/news-old" element={<News />} />
        <Route path="/exhibition" element={<Exhibition />} />
        <Route path="/creative-works" element={<CreativeWorks />} />
        <Route path="/creative-works/lacquer-legacy" element={<MainExhibitionLacquerLegacy />} />
        <Route path="/creative-works/works" element={<WorksPage />} />
        <Route path="/creative-works/partners" element={<CollaborativePartners />} />
        <Route path="/creative-works/lacquerware" element={<LacquerwarePage />} />
        <Route path="/creative-works/handicrafts" element={<HandicraftsPage />} />
        <Route path="/creative-works/applied" element={<AppliedHandicraftsPage />} />
        <Route path="/creative-works/local" element={<LocalHandicraftsPage />} />
        <Route path="/images" element={<Images />} />
        <Route path="/folder/:folderId" element={<FolderDetail />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/proceeding" element={<Proceeding />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/terms" element={<RegisterTerms />} />
        <Route path="/register/form" element={<RegisterForm />} />
        <Route path="/register/research" element={<RegisterResearch />} />
        <Route path="/register/creative" element={<RegisterCreative />} />
        <Route path="/register/success" element={<RegisterSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/checkin" element={<CheckInPage />} />
        <Route path="/account" element={<Account />} />
        <Route path="/my-account" element={<Account />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="agenda" element={<AdminAgenda />} />
          <Route path="speakers" element={<SpeakersPage />} />
          <Route path="exhibitions" element={<ExhibitionsPage />} />
          <Route path="works" element={<WorksPage />} />
          <Route path="attendees" element={<AttendeesPage />} />
          <Route path="certificates" element={<CertificatesPage />} />
          <Route path="google-analytics" element={<GoogleAnalytics />} />
          <Route path="multimedia" element={<MultimediaPage />} />
          <Route path="submissions-review" element={<SubmissionsReviewPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="ebooks" element={<EbooksPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </>
  );
};

// Component to conditionally render footer
const ConditionalFooter = () => {
  const location = useLocation();
  
  // Don't show footer on admin pages
  if (location.pathname.toLowerCase().startsWith('/admin')) {
    return null;
  }
  
  return <Footer />;
};

function App() {
  useEffect(() => {
    // Initialize Google Analytics
    analytics.init();
    console.log('🚀 Google Analytics initialized with ID:', analytics.getMeasurementId());
  }, []);

  return (
    <>
      <Router>
        <AppWithNavbar />
        <ConditionalFooter />
        <Toaster />
      </Router>
    </>
  );
}

export default App;
