/**
 * 🎤 Speakers Management System - Frontend Integration
 * 
 * 📡 API: https://backendsacit-42f532a9097c.herokuapp.com
 * 🗄️ Database: Connected and ready (3 sample speakers)
 * 🎨 UI: shadcn/ui + Tailwind CSS
 * 
 * Components are pre-configured to work with your Heroku backend.
 * No additional setup required - just import and use!
 */

// Export ทุกอย่างที่เกี่ยวข้องกับ Speakers
export { default as SpeakerForm } from './SpeakerForm.jsx';
export { default as SpeakerList } from './SpeakerList.jsx';
export { default as SpeakersAPI } from './speakersAPI.js';
export { default as useSpeakers } from './useSpeakers.js';

// Re-export สำหรับความสะดวก
export {
  SpeakerForm,
  SpeakerList,
  SpeakersAPI,
  useSpeakers
};

/**
 * 🚀 Quick Start:
 * 
 * import { SpeakerList } from './frontend-integration';
 * 
 * function App() {
 *   return <SpeakerList />; // That's it!
 * }
 * 
 * ✅ Automatically connects to: https://backendsacit-42f532a9097c.herokuapp.com
 * ✅ No configuration needed
 * ✅ Works out of the box
 */