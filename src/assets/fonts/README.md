# 🎨 Custom Fonts Setup

## วิธีการเพิ่มฟ้อนต์ .otf ลงในโปรเจค

### 1. เพิ่มไฟล์ฟ้อนต์
วางไฟล์ .otf ของคุณในโฟลเดอร์ `src/assets/fonts/`

ตัวอย่าง:
```
src/assets/fonts/
├── fonts.css
├── README.md
├── YourFont-Regular.otf
├── YourFont-Bold.otf
├── YourFont-Light.otf
└── YourFont-Italic.otf
```

### 2. แก้ไขไฟล์ fonts.css
เปลี่ยนชื่อฟ้อนต์และ path ในไฟล์ `fonts.css`:

```css
@font-face {
  font-family: 'YourFont-Regular';
  src: url('./YourFont-Regular.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

### 3. แก้ไข CSS Variables
อัพเดท CSS variables ใน `fonts.css`:

```css
:root {
  --font-custom-regular: 'YourFont-Regular', 'Noto Sans Thai', sans-serif;
  --font-custom-bold: 'YourFont-Bold', 'Noto Sans Thai', sans-serif;
}
```

### 4. แก้ไข Tailwind Config
อัพเดท `tailwind.config.js`:

```js
fontFamily: {
  'custom': ['YourFont-Regular', 'Noto Sans Thai', 'sans-serif'],
  'custom-bold': ['YourFont-Bold', 'Noto Sans Thai', 'sans-serif'],
}
```

## วิธีการใช้งาน

### 1. ใช้กับ Tailwind Classes
```jsx
<h1 className="font-custom text-2xl">ข้อความปกติ</h1>
<h2 className="font-custom-bold text-xl">ข้อความตัวหนา</h2>
<p className="font-custom-light">ข้อความตัวบาง</p>
```

### 2. ใช้กับ CSS Classes
```jsx
<h1 className="font-custom">ข้อความปกติ</h1>
<h2 className="font-custom-bold">ข้อความตัวหนา</h2>
```

### 3. ใช้กับ CSS Variables
```css
.my-text {
  font-family: var(--font-custom-regular);
}
```

### 4. ใช้กับ Inline Style
```jsx
<p style={{ fontFamily: 'var(--font-custom-regular)' }}>
  ข้อความ
</p>
```

## ตัวอย่างการใช้งานจริง

```jsx
// หัวข้อหลัก
<h1 className="font-custom-bold text-4xl text-[#533193]">
  SACIT Symposium 2025
</h1>

// เนื้อหา
<p className="font-custom text-lg text-gray-700">
  ยินดีต้อนรับสู่งานประชุมวิชาการ
</p>

// ปุ่ม
<button className="font-custom-bold bg-[#533193] text-white px-6 py-3 rounded-lg">
  ลงทะเบียน
</button>
```

## Tips & Best Practices

### 1. Font Loading Performance
- ใช้ `font-display: swap` เพื่อให้โหลดเร็ว
- พิจารณาใช้ font subsetting หากฟ้อนต์มีขนาดใหญ่

### 2. Fallback Fonts
- ระบุ fallback fonts เสมอ: `'Noto Sans Thai', sans-serif`
- ทดสอบการแสดงผลเมื่อฟ้อนต์หลักโหลดไม่สำเร็จ

### 3. Font Formats
- .otf รองรับในเบราว์เซอร์สมัยใหม่ทั้งหมด
- หากต้องการรองรับเบราว์เซอร์เก่า อาจต้องแปลงเป็น .woff2

### 4. License
- ตรวจสอบ license ของฟ้อนต์ว่าอนุญาตให้ใช้บนเว็บไซต์
- บางฟ้อนต์อาจต้องซื้อ web license แยก

## การแก้ปัญหา

### ฟ้อนต์ไม่แสดง
1. ตรวจสอบ path ของไฟล์ .otf
2. ตรวจสอบชื่อ font-family ให้ตรงกัน
3. เปิด Developer Tools ดู Network tab ว่าไฟล์โหลดสำเร็จหรือไม่

### ฟ้อนต์ไทยแสดงผลผิด
1. ตรวจสอบว่าฟ้อนต์รองรับภาษาไทย
2. เพิ่ม fallback font ที่รองรับไทย

### Performance ช้า
1. ใช้ font subsetting
2. Preload ฟ้อนต์สำคัญ
3. ใช้ font-display: swap 