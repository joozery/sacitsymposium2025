# 📡 Frontend API Configuration - สรุป

## 🔗 เส้น API ที่ใช้ในระบบ

### Backend API URL (ที่เพิ่งทดสอบเสร็จ):
```
http://localhost:5001
```

### Frontend กำลังใช้:
```javascript
// ไฟล์: src/services/api.js (บรรทัดที่ 4)
const API_BASE_URL = 'http://localhost:5001/api';
```

✅ **ตรงกันแล้ว! ไม่ต้องแก้ไข**

---

## 📂 ไฟล์ที่เกี่ยวข้อง

### 1. **Main API Service** 
**ไฟล์:** `/home/admin-1/fullstack-app/frontend/src/services/api.js`

```javascript
const API_BASE_URL = 'http://localhost:5001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
```

### 2. **Environment Files**
- `.env` - Development environment
- `.env.production` - Production environment
- `env.example` - Template สำหรับ production:
  ```
  VITE_API_BASE_URL=https://symposium.sacit.or.th
  ```

---

## 🔧 API Endpoints ที่ Frontend ใช้

### 1. **Exhibitions API** (`exhibitionsAPI`)
```javascript
GET    /api/exhibitions          - ดึงรายการนิทรรศการทั้งหมด
GET    /api/exhibitions/:id      - ดึงนิทรรศการตาม ID
POST   /api/exhibitions          - สร้างนิทรรศการใหม่
PUT    /api/exhibitions/:id      - แก้ไขนิทรรศการ
DELETE /api/exhibitions/:id      - ลบนิทรรศการ
```

### 2. **Speakers API** (`speakersAPI`)
```javascript
GET    /api/speakers             - ดึงรายการวิทยากรทั้งหมด
GET    /api/speakers/:id         - ดึงวิทยากรตาม ID
POST   /api/speakers             - สร้างวิทยากรใหม่
PUT    /api/speakers/:id         - แก้ไขวิทยากร
DELETE /api/speakers/:id         - ลบวิทยากร
```

### 3. **Attendees API** (`attendeesAPI`)
```javascript
GET    /api/attendees            - ดึงรายการผู้เข้าร่วม
GET    /api/attendees/:type      - ดึงตามประเภท (general/research/creative)
GET    /api/attendees/stats      - สถิติผู้เข้าร่วม
GET    /api/attendees/export     - Export ข้อมูล
```

### 4. **Upload API**
```javascript
POST   /api/upload               - อัพโหลดไฟล์เดี่ยว
POST   /api/upload/multiple      - อัพโหลดหลายไฟล์
DELETE /api/upload/delete        - ลบไฟล์จาก S3
```

---

## 🌐 การใช้งาน API ใน Frontend

### ตัวอย่างการเรียกใช้:

```javascript
// Import API service
import { exhibitionsAPI, speakersAPI } from '@/services/api';

// ดึงข้อมูล Exhibitions
const exhibitions = await exhibitionsAPI.getExhibitions();

// ดึงข้อมูล Speakers
const speakers = await speakersAPI.getSpeakers();

// สร้าง Exhibition ใหม่
const newExhibition = await exhibitionsAPI.createExhibition({
  name: 'ชื่อนิทรรศการ',
  position: 'ตำแหน่ง',
  imageFile: imageFile,
  pdfFile: pdfFile
});
```

---

## ⚙️ วิธีเปลี่ยน API URL

### สำหรับ Development (localhost):
**ไฟล์:** `src/services/api.js`
```javascript
const API_BASE_URL = 'http://localhost:5001/api';
```

### สำหรับ Production (server จริง):
**ไฟล์:** `.env.production`
```bash
VITE_API_BASE_URL=https://symposium.sacit.or.th/api
```

แล้วแก้ไข `src/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
```

---

## 🔐 Authentication

API มีการใช้ JWT Token:

```javascript
// Token ถูกเพิ่มอัตโนมัติใน header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 📝 ตัวอย่าง API อื่นๆ ที่พบ

### Simple APIs (ใช้ fetch โดยตรง):
1. **`src/services/simpleExhibitionsAPI.js`**
   ```javascript
   const API_URL = '/api/exhibitions';
   ```

2. **`src/services/simpleSpeakersAPI.js`**
   ```javascript
   const API_URL = 'http://localhost:5001/api/speakers';
   ```

---

## ✅ สรุป

### URL ที่ต้องใช้:
```
Backend URL:  http://localhost:5001
API Base:     http://localhost:5001/api
```

### ✅ สถานะปัจจุบัน:
- Frontend **กำลังใช้** `http://localhost:5001/api` อยู่แล้ว
- Backend **กำลังทำงาน** ที่ port `5001` อยู่แล้ว
- **ไม่ต้องแก้ไขอะไร** - ใช้งานได้เลย!

### 🚀 วิธีทดสอบ:
```bash
# ตรวจสอบ Backend
curl http://localhost:5001/health

# ตรวจสอบ API
curl http://localhost:5001/api/exhibitions
curl http://localhost:5001/api/speakers

# รัน Frontend (ในโฟลเดอร์ frontend)
npm run dev
```

---

**หมายเหตุ:** Frontend และ Backend ใช้ port เดียวกัน (5001) และ config ตรงกันแล้ว ระบบพร้อมใช้งาน! 🎉 