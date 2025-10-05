#!/bin/bash

echo "🚀 Deploying Frontend to Production"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running from correct directory
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Error: dist directory not found!${NC}"
    echo "Please run 'npm run build' first"
    exit 1
fi

# Check for localhost in build
echo -e "${YELLOW}🔍 Checking for localhost references...${NC}"
if grep -r "localhost:5001" dist/assets/*.js > /dev/null 2>&1; then
    echo -e "${RED}❌ ERROR: Found localhost:5001 in build!${NC}"
    echo "Please ensure environment variables are set correctly"
    exit 1
else
    echo -e "${GREEN}✅ No localhost references found${NC}"
fi

# Check for production URL
echo -e "${YELLOW}🔍 Verifying production API URL...${NC}"
if grep -r "symposium\.sacit\.or\.th/api" dist/assets/*.js > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Production API URL found in build${NC}"
else
    echo -e "${YELLOW}⚠️  Warning: Production URL not found (might use env variable)${NC}"
fi

echo ""
echo -e "${YELLOW}📋 Build Summary:${NC}"
ls -lh dist/assets/*.js | tail -5

echo ""
read -p "Continue with deployment? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 1
fi

# Backup current production
BACKUP_DIR="/var/www/symposium.sacit.or.th.backup.$(date +%Y%m%d_%H%M%S)"
echo -e "${YELLOW}💾 Creating backup...${NC}"
sudo cp -r /var/www/symposium.sacit.or.th "$BACKUP_DIR"
echo -e "${GREEN}✅ Backup created: $BACKUP_DIR${NC}"

# Deploy new build
echo -e "${YELLOW}🚀 Deploying to production...${NC}"
sudo rm -rf /var/www/symposium.sacit.or.th/*
sudo cp -r dist/* /var/www/symposium.sacit.or.th/
sudo chown -R www-data:www-data /var/www/symposium.sacit.or.th

# Test nginx configuration
echo -e "${YELLOW}🧪 Testing nginx configuration...${NC}"
if sudo nginx -t 2>&1; then
    echo -e "${GREEN}✅ Nginx configuration valid${NC}"
    
    # Reload nginx
    echo -e "${YELLOW}🔄 Reloading nginx...${NC}"
    sudo systemctl reload nginx
    echo -e "${GREEN}✅ Nginx reloaded${NC}"
else
    echo -e "${RED}❌ Nginx configuration error!${NC}"
    echo "Restoring from backup..."
    sudo rm -rf /var/www/symposium.sacit.or.th/*
    sudo cp -r "$BACKUP_DIR"/* /var/www/symposium.sacit.or.th/
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "🌐 Production URL: https://symposium.sacit.or.th"
echo "📦 Backup Location: $BACKUP_DIR"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "1. Open https://symposium.sacit.or.th in your browser"
echo "2. Press F12 to open Developer Tools"
echo "3. Go to Network tab and refresh the page"
echo "4. Check that API calls go to: https://symposium.sacit.or.th/api"
echo "" 