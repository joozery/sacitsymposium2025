# 🚀 Production Configuration Guide

## 📍 API URL Configuration

Your Heroku backend is deployed at:
**https://backendsacit-42f532a9097c.herokuapp.com**

## ⚙️ Environment Setup

### For Next.js Projects:
Create `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=https://backendsacit-42f532a9097c.herokuapp.com
```

### For Create React App:
Create `.env` file:
```bash
REACT_APP_API_URL=https://backendsacit-42f532a9097c.herokuapp.com
```

### For Vite Projects:
Create `.env` file:
```bash
VITE_API_URL=https://backendsacit-42f532a9097c.herokuapp.com
```

## 🔧 API Service Configuration

The `speakersAPI.js` file has been updated to use your Heroku URL as default:

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendsacit-42f532a9097c.herokuapp.com';
```

This means:
- ✅ **Production**: Uses Heroku URL automatically
- ✅ **Development**: Can override with environment variable
- ✅ **No Config Needed**: Works out of the box

## 🧪 Testing Your Production API

### 1. Browser Test:
Open `test-frontend-integration.html` in your browser

### 2. Command Line Test:
```bash
# Test API health
curl https://backendsacit-42f532a9097c.herokuapp.com/health

# Test Speakers API
curl https://backendsacit-42f532a9097c.herokuapp.com/api/speakers

# Test S3 connection
curl https://backendsacit-42f532a9097c.herokuapp.com/health/s3
```

### 3. Frontend Integration Test:
```javascript
import { SpeakersAPI } from './frontend-integration';

// This will use your Heroku API automatically
const testAPI = async () => {
  try {
    const result = await SpeakersAPI.getAll();
    console.log('✅ API working:', result.data);
  } catch (error) {
    console.error('❌ API error:', error);
  }
};
```

## 🌐 CORS Configuration

Make sure your Heroku backend allows requests from your frontend domain.

If deploying frontend to Vercel/Netlify, add your domain to CORS settings:

```javascript
// In your backend server.js
app.use(cors({
  origin: [
    'https://your-frontend-domain.vercel.app',
    'https://your-custom-domain.com',
    'http://localhost:3000' // for development
  ]
}));
```

## 🔒 Security Checklist

- ✅ **HTTPS**: Your Heroku URL uses HTTPS
- ✅ **Environment Variables**: API URL can be configured
- ✅ **CORS**: Configure allowed origins
- ✅ **File Upload**: S3 bucket permissions are set
- ✅ **API Keys**: AWS credentials are in Heroku config vars

## 📱 Deployment Options

### Option 1: Vercel (Recommended for Next.js)
```bash
# Add environment variable in Vercel dashboard
NEXT_PUBLIC_API_URL=https://backendsacit-42f532a9097c.herokuapp.com
```

### Option 2: Netlify
```bash
# Add to netlify.toml or dashboard
REACT_APP_API_URL=https://backendsacit-42f532a9097c.herokuapp.com
```

### Option 3: Static Hosting
The components will work with any static hosting since they use your Heroku API.

## 🧩 Component Usage

All components are now configured for production:

```javascript
// ✅ Ready to use - no additional config needed
import { SpeakerForm, SpeakerList, useSpeakers } from './frontend-integration';

const App = () => {
  return (
    <div>
      <SpeakerList /> {/* Connects to Heroku API automatically */}
    </div>
  );
};
```

## 🔄 Development vs Production

### Development Mode:
```bash
# Override with local backend
NEXT_PUBLIC_API_URL=http://localhost:5470
```

### Production Mode:
```bash
# Uses Heroku by default (no config needed)
# Or explicitly set:
NEXT_PUBLIC_API_URL=https://backendsacit-42f532a9097c.herokuapp.com
```

## 🆘 Troubleshooting

### If API calls fail:

1. **Check Network Tab**: Look for CORS errors
2. **Verify API URL**: Make sure Heroku app is running
3. **Check Console**: Look for JavaScript errors
4. **Test Direct**: Try API endpoints directly in browser

### Common Issues:

```javascript
// ❌ Mixed Content (HTTP/HTTPS)
// Make sure both frontend and backend use HTTPS

// ❌ CORS Error
// Add your frontend domain to backend CORS config

// ❌ API Not Found
// Verify Heroku app is deployed and running
```

## ✅ Verification

Your setup is correct if:
- ✅ `test-frontend-integration.html` works
- ✅ API calls return data (not errors)
- ✅ File uploads work to S3
- ✅ React components display speakers

---

**Your Speakers Management System is ready for production! 🎉**