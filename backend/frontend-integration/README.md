# 🎤 Speakers Frontend Integration

ระบบจัดการผู้บรรยายแบบครบวงจร พร้อม UI Components และ API Integration

## 📦 ส่วนประกอบ

### 🧩 Components
- **`SpeakerForm`** - ฟอร์มสำหรับเพิ่ม/แก้ไขผู้บรรยาย
- **`SpeakerList`** - รายการผู้บรรยายพร้อมฟีเจอร์ CRUD
- **`SpeakersAPI`** - API Service Class
- **`useSpeakers`** - Custom React Hook

### 📁 File Structure
```
frontend-integration/
├── SpeakerForm.jsx          # Form Component
├── SpeakerList.jsx          # List Component  
├── speakersAPI.js           # API Service
├── useSpeakers.js           # Custom Hook
├── ExampleApp.jsx           # ตัวอย่างการใช้งาน
├── index.js                 # Export ทั้งหมด
└── README.md                # เอกสารนี้
```

## 🚀 การติดตั้งและใช้งาน

### 1. 📋 Prerequisites

```bash
# Dependencies ที่จำเป็น
npm install react react-dom
npm install @radix-ui/react-dialog
npm install @radix-ui/react-alert-dialog  
npm install lucide-react
npm install class-variance-authority
npm install clsx tailwind-merge
```

### 2. 📂 การ Import

```javascript
// Import ทั้งหมด
import { 
  SpeakerForm, 
  SpeakerList, 
  SpeakersAPI, 
  useSpeakers 
} from './frontend-integration';

// หรือ Import แต่ละตัว
import SpeakerForm from './frontend-integration/SpeakerForm';
import SpeakerList from './frontend-integration/SpeakerList';
import SpeakersAPI from './frontend-integration/speakersAPI';
import useSpeakers from './frontend-integration/useSpeakers';
```

### 3. ⚙️ การตั้งค่า Environment Variables

```bash
# ใน .env.local (Next.js) หรือ .env (React)
# Production (Heroku)
NEXT_PUBLIC_API_URL=https://backendsacit-42f532a9097c.herokuapp.com

# หรือสำหรับ Development (Local Backend)
# NEXT_PUBLIC_API_URL=http://localhost:5470
```

## 🖼️ การใช้งาน Components

### 1. SpeakerForm Component

```javascript
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SpeakerForm } from './frontend-integration';

const MyApp = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);

  const handleSuccess = (speakerData) => {
    console.log('Speaker saved:', speakerData);
    setShowDialog(false);
    // Refresh list หรือ redirect
  };

  return (
    <div>
      {/* Create New Speaker */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>เพิ่มผู้บรรยายใหม่</DialogTitle>
          </DialogHeader>
          <SpeakerForm
            onSuccess={handleSuccess}
            onCancel={() => setShowDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Existing Speaker */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>แก้ไขข้อมูลผู้บรรยาย</DialogTitle>
          </DialogHeader>
          <SpeakerForm
            speaker={selectedSpeaker}  // Pass existing speaker data
            onSuccess={handleSuccess}
            onCancel={() => setShowDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
```

#### Props ของ SpeakerForm

| Prop | Type | Description |
|------|------|-------------|
| `speaker` | Object | ข้อมูลผู้บรรยายสำหรับแก้ไข (optional) |
| `onSuccess` | Function | Callback เมื่อบันทึกสำเร็จ |
| `onCancel` | Function | Callback เมื่อยกเลิก |
| `onSubmit` | Function | Callback แบบเก่า (backward compatibility) |

### 2. SpeakerList Component

```javascript
import React from 'react';
import { SpeakerList } from './frontend-integration';

const SpeakersPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">จัดการผู้บรรยาย</h1>
      <SpeakerList />
    </div>
  );
};
```

### 3. useSpeakers Hook

```javascript
import React, { useEffect } from 'react';
import { useSpeakers } from './frontend-integration';

const SpeakerStats = () => {
  const {
    speakers,
    loading,
    error,
    totalSpeakers,
    activeSpeakers,
    createSpeaker,
    updateSpeaker,
    deleteSpeaker,
    refresh
  } = useSpeakers({
    autoLoad: true,  // Auto load on mount
    initialStatus: 'active',  // Load only active speakers
    onError: (error) => console.error('Speakers error:', error)
  });

  const handleCreateSpeaker = async () => {
    try {
      const newSpeaker = await createSpeaker({
        name: 'ดร.ทดสอบ ระบบ',
        photoFile: null,  // File object
        pdfFile: null     // File object
      });
      console.log('Created:', newSpeaker);
    } catch (error) {
      console.error('Create failed:', error);
    }
  };

  if (loading) return <div>กำลังโหลด...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>สถิติผู้บรรยาย</h2>
      <p>ทั้งหมด: {totalSpeakers} คน</p>
      <p>ใช้งานอยู่: {activeSpeakers} คน</p>
      
      <button onClick={handleCreateSpeaker}>
        เพิ่มผู้บรรยาย
      </button>
      
      <button onClick={refresh}>
        Refresh
      </button>
    </div>
  );
};
```

#### Hook Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoLoad` | boolean | `true` | โหลดข้อมูลอัตโนมัติเมื่อ mount |
| `initialStatus` | string | `'active'` | Status เริ่มต้นสำหรับโหลดข้อมูล |
| `onError` | function | `null` | Callback เมื่อเกิด error |

#### Hook Returns

| Property | Type | Description |
|----------|------|-------------|
| `speakers` | Array | รายการผู้บรรยาย |
| `loading` | boolean | สถานะการโหลด |
| `error` | string | ข้อความ error |
| `totalSpeakers` | number | จำนวนผู้บรรยายทั้งหมด |
| `activeSpeakers` | number | จำนวนผู้บรรยายที่ใช้งานอยู่ |
| `createSpeaker(data)` | function | สร้างผู้บรรยายใหม่ |
| `updateSpeaker(id, data)` | function | อัปเดตผู้บรรยาย |
| `deleteSpeaker(id)` | function | ลบผู้บรรยาย (soft delete) |
| `refresh()` | function | รีเฟรชข้อมูล |

### 4. SpeakersAPI Direct Usage

```javascript
import { SpeakersAPI } from './frontend-integration';

// ใช้ API โดยตรง (จะใช้ Heroku URL โดยอัตโนมัติ)
const handleApiCalls = async () => {
  try {
    // Get all speakers
    const result = await SpeakersAPI.getAll({ status: 'active' });
    console.log('Speakers:', result.data);

    // Get speaker by ID
    const speaker = await SpeakersAPI.getById(1);
    console.log('Speaker:', speaker.data);

    // Create new speaker
    const formData = new FormData();
    formData.append('name', 'ดร.ใหม่ สร้างใหม่');
    formData.append('photo', photoFile);
    formData.append('pdf', pdfFile);
    
    const newSpeaker = await SpeakersAPI.create(formData);
    console.log('Created:', newSpeaker.data);

    // Update speaker
    const updateData = new FormData();
    updateData.append('name', 'ชื่อใหม่');
    
    const updated = await SpeakersAPI.update(1, updateData);
    console.log('Updated:', updated.data);

    // Delete speaker
    await SpeakersAPI.delete(1);
    console.log('Deleted successfully');

  } catch (error) {
    console.error('API Error:', error.message);
  }
};
```

## 🎨 Styling และ Customization

### CSS Classes ที่ใช้

Components ใช้ Tailwind CSS และ shadcn/ui:

```css
/* ตัวอย่าง custom styles */
.speaker-form {
  @apply space-y-6;
}

.speaker-card {
  @apply bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow;
}

.speaker-avatar {
  @apply h-16 w-16 rounded-full;
}
```

### การ Customize Components

```javascript
// Customize SpeakerForm
const CustomSpeakerForm = (props) => {
  return (
    <div className="my-custom-wrapper">
      <SpeakerForm 
        {...props}
        className="custom-form-styles"
      />
    </div>
  );
};
```

## 🔧 API Integration

### Backend Requirements

ต้องมี Backend API ที่รองรับ endpoints เหล่านี้:

```
GET    /api/speakers           - ดึงรายการผู้บรรยาย
GET    /api/speakers/:id       - ดึงข้อมูลผู้บรรยายตาม ID
POST   /api/speakers           - เพิ่มผู้บรรยายใหม่
PUT    /api/speakers/:id       - อัปเดตข้อมูลผู้บรรยาย
DELETE /api/speakers/:id       - ลบผู้บรรยาย
```

### API Response Format

```javascript
// Success Response
{
  "success": true,
  "data": {
    "id": 1,
    "name": "ดร.สมชาย ใจดี",
    "photo_url": "https://bucket.s3.amazonaws.com/speakers/photos/...",
    "pdf_url": "https://bucket.s3.amazonaws.com/speakers/documents/...",
    "pdf_filename": "presentation.pdf",
    "status": "active",
    "created_at": "2025-08-05T12:00:00.000Z",
    "updated_at": "2025-08-05T12:00:00.000Z"
  },
  "message": "Success message"
}

// Error Response
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## 🧪 Testing

### Unit Testing Example

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SpeakerForm } from './frontend-integration';

// Mock API
jest.mock('./frontend-integration/speakersAPI', () => ({
  create: jest.fn().mockResolvedValue({
    success: true,
    data: { id: 1, name: 'Test Speaker' }
  })
}));

test('SpeakerForm submission', async () => {
  const onSuccess = jest.fn();
  
  render(
    <SpeakerForm onSuccess={onSuccess} />
  );
  
  // Fill form
  fireEvent.change(screen.getByLabelText(/ชื่อ-นามสกุล/), {
    target: { value: 'Test Speaker' }
  });
  
  // Submit
  fireEvent.click(screen.getByText(/เพิ่มผู้บรรยาย/));
  
  // Wait for success
  await waitFor(() => {
    expect(onSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Test Speaker' })
    );
  });
});
```

## 🚨 Error Handling

### Common Errors

```javascript
// Network errors
try {
  await SpeakersAPI.getAll();
} catch (error) {
  if (error.message.includes('Network')) {
    // Handle network error
  } else if (error.message.includes('Server')) {
    // Handle server error
  }
}

// Validation errors
try {
  await SpeakersAPI.create(invalidData);
} catch (error) {
  // error.message จะมีข้อความ validation error
  console.error('Validation:', error.message);
}
```

### Error States ใน Components

```javascript
const MyComponent = () => {
  const { error, clearError } = useSpeakers();
  
  return (
    <div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            <Button onClick={clearError}>ปิด</Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
```

## 📱 Responsive Design

Components รองรับ responsive design:

```javascript
// Grid breakpoints
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Speaker cards */}
</div>

// Mobile-first approach
<div className="flex flex-col sm:flex-row gap-4">
  {/* Content */}
</div>
```

## 🔒 Security Considerations

### File Upload Security

```javascript
// File validation ใน SpeakersAPI
SpeakersAPI.validateImageFile(file); // ตรวจสอบรูปภาพ
SpeakersAPI.validatePdfFile(file);   // ตรวจสอบ PDF

// Size limits
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
```

### API Security

```javascript
// API calls ผ่าน HTTPS เท่านั้น
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // https://...

// Handle authentication (ถ้ามี)
const headers = {
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json'
};
```

## 🎯 Best Practices

### 1. Performance
```javascript
// ใช้ useMemo สำหรับ expensive operations
const filteredSpeakers = useMemo(() => {
  return speakers.filter(speaker => 
    speaker.name.includes(searchTerm)
  );
}, [speakers, searchTerm]);
```

### 2. User Experience
```javascript
// Loading states
{loading && <Loader2 className="animate-spin" />}

// Empty states
{speakers.length === 0 && <EmptyState />}

// Error boundaries
<ErrorBoundary fallback={<ErrorFallback />}>
  <SpeakerList />
</ErrorBoundary>
```

### 3. Code Organization
```javascript
// ใช้ TypeScript (แนะนำ)
interface Speaker {
  id: number;
  name: string;
  photo_url?: string;
  pdf_url?: string;
  status: 'active' | 'inactive';
}
```

## 🆘 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - ตรวจสอบ `NEXT_PUBLIC_API_URL`
   - ตรวจสอบ Backend server ทำงานหรือไม่

2. **File Upload Failed**
   - ตรวจสอบขนาดไฟล์ (สูงสุด 10MB)
   - ตรวจสอบประเภทไฟล์ที่รองรับ

3. **Components Not Rendering**
   - ตรวจสอบ import paths
   - ตรวจสอบ CSS/Tailwind configuration

## 📞 Support

หากมีปัญหาการใช้งาน:

1. ตรวจสอบ Browser Console สำหรับ error messages
2. ตรวจสอบ Network tab สำหรับ API calls
3. ดู Backend logs สำหรับ server-side errors

---

## 📄 License

MIT License - ใช้งานได้อย่างอิสระ