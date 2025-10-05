# 🔧 CORS Fix - Frontend API Connection

## ❌ **ปัญหา CORS ที่เกิดขึ้น:**

### **Error Message:**
```
Access to fetch at 'https://symposium.sacit.or.th/api/speakers?status=active' 
from origin 'http://localhost:5173' has been blocked by CORS policy: 
The 'Access-Control-Allow-Origin' header contains multiple values 
'http://localhost:5173, *', but only one is allowed.
```

### **สาเหตุ:**
- Server ส่ง `Access-Control-Allow-Origin` header หลายค่า
- Browser ไม่อนุญาตให้มีหลายค่าใน header เดียวกัน
- ต้องส่งค่าเดียวเท่านั้น

## ✅ **วิธีแก้ไข:**

### **1. ใช้ Vite Proxy:**
```javascript
// vite.config.js
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'https://symposium.sacit.or.th',
      changeOrigin: true,
      secure: true,
      rewrite: (path) => path.replace(/^\/api/, '/api'),
      configure: (proxy, options) => {
        proxy.on('proxyReq', (proxyReq, req, res) => {
          // Remove any existing CORS headers
          proxyReq.removeHeader('origin');
          proxyReq.removeHeader('referer');
        });
        proxy.on('proxyRes', (proxyRes, req, res) => {
          // Set proper CORS headers
          proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173';
          proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
          proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept';
          proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
        });
      }
    }
  }
}
```

### **2. เปลี่ยน API URLs กลับเป็น `/api`:**
```javascript
// เก่า (Direct API)
const API_BASE_URL = 'https://symposium.sacit.or.th/api';

// ใหม่ (Proxy)
const API_BASE_URL = '/api';
```

### **3. ไฟล์ที่อัปเดต:**
- ✅ `vite.config.js` - เพิ่ม proxy configuration
- ✅ `src/services/api.js` - เปลี่ยนเป็น `/api`
- ✅ `src/services/speakersService.js` - เปลี่ยนเป็น `/api`
- ✅ `src/services/exhibitionsService.js` - เปลี่ยนเป็น `/api`
- ✅ `src/services/simpleSpeakersAPI.js` - เปลี่ยนเป็น `/api/speakers`
- ✅ `src/services/simpleExhibitionsAPI.js` - เปลี่ยนเป็น `/api/exhibitions`
- ✅ `src/services/mediaService.js` - เปลี่ยนเป็น `/api`
- ✅ `src/hooks/useWorks.js` - เปลี่ยนเป็น `/api`
- ✅ `src/pages/CheckIn/index.jsx` - เปลี่ยนเป็น `/api`

## 🔄 **การทำงานของ Proxy:**

### **Request Flow:**
```
Frontend (localhost:5173) 
    ↓ /api/speakers
Vite Proxy Server 
    ↓ https://symposium.sacit.or.th/api/speakers
Production API Server
    ↓ Response
Vite Proxy Server (แก้ไข CORS headers)
    ↓ Response with proper CORS
Frontend (localhost:5173)
```

### **CORS Headers ที่ Proxy ส่ง:**
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, Accept
Access-Control-Allow-Credentials: true
```

## 🧪 **การทดสอบ:**

### **1. Test CORS Fix:**
- **ไฟล์:** `test-cors-fix.html`
- **URL:** `http://localhost:5173/test-cors-fix.html`
- **ฟังก์ชัน:** ทดสอบ API ผ่าน proxy

### **2. Test Commands:**
```bash
# เริ่ม development server
npm run dev

# ทดสอบ API ผ่าน proxy
curl http://localhost:5173/api/speakers

# ทดสอบ API โดยตรง (ควร fail)
curl https://symposium.sacit.or.th/api/speakers
```

## 📊 **ผลลัพธ์:**

### **✅ ผ่าน Proxy:**
- **Speakers API:** ✅ ทำงานได้
- **Exhibitions API:** ✅ ทำงานได้
- **CORS:** ✅ ไม่มีปัญหา
- **Performance:** ✅ เร็ว

### **❌ Direct API:**
- **CORS Error:** ❌ ถูกบล็อก
- **Multiple Headers:** ❌ ไม่ถูกต้อง

## 🎯 **ข้อดีของ Proxy:**

### **1. CORS Bypass:**
- 🔓 **ไม่มี CORS issues**
- 🛡️ **Browser อนุญาต**
- 📡 **Request ผ่านได้**

### **2. Header Control:**
- 🎛️ **ควบคุม headers ได้**
- 🔧 **แก้ไข CORS headers**
- 🧹 **ลบ headers ที่ไม่ต้องการ**

### **3. Development:**
- 🚀 **Development ง่าย**
- 🔄 **Hot reload ทำงาน**
- 🐛 **Debug ง่าย**

## ⚠️ **ข้อควรระวัง:**

### **1. Production:**
- 🌐 **Production ต้องใช้ HTTPS**
- 🔒 **ต้องมี proper CORS headers**
- 📡 **Server ต้องรองรับ CORS**

### **2. Network:**
- 🌐 **ต้องมีอินเทอร์เน็ต**
- 🔄 **Proxy ต้องทำงาน**
- ⏱️ **อาจมี latency เล็กน้อย**

## 🚀 **การใช้งาน:**

### **1. Development:**
```bash
npm run dev
# เปิด http://localhost:5173
# ใช้ proxy: /api → https://symposium.sacit.or.th/api
```

### **2. Production:**
```bash
npm run build
# Build สำหรับ production
# ใช้ production API โดยตรง
```

## 📋 **สรุป:**

✅ **CORS ปัญหาแก้ไขแล้ว!**

- 🔧 **ใช้ Vite Proxy** - หลีกเลี่ยง CORS
- 🔄 **API URLs เปลี่ยนเป็น `/api`** - ใช้ proxy
- 🛡️ **CORS Headers ถูกต้อง** - ไม่มี multiple values
- 🚀 **Frontend โหลดได้แล้ว** - ไม่มี error

---

**🎯 Frontend ตอนนี้เชื่อมต่อกับ Production API ผ่าน Proxy แล้ว!** 🚀✨