# 🚀 Deployment Guide

This guide will help you deploy the AI Voice Chat App to various platforms.

## 📋 Prerequisites

- Node.js 16+ installed
- Git repository cloned
- Gemini API key ready
- Domain name (optional)

## 🌐 Deployment Options

### 1. Heroku Deployment

#### Setup Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Add environment variables
heroku config:set GEMINI_API_KEY=your_api_key_here
heroku config:set NODE_ENV=production
```

#### Deploy
```bash
# Add Heroku remote
heroku git:remote -a your-app-name

# Deploy
git push heroku main
```

### 2. Vercel Deployment

#### Setup Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login
```

#### Deploy
```bash
# Deploy from project root
vercel

# Set environment variables in Vercel dashboard
# GEMINI_API_KEY=your_api_key_here
```

### 3. Railway Deployment

#### Setup Railway
1. Go to [Railway](https://railway.app/)
2. Connect your GitHub repository
3. Add environment variables in Railway dashboard

#### Deploy
```bash
# Railway will automatically deploy from your Git repository
# No additional commands needed
```

### 4. DigitalOcean App Platform

#### Setup
1. Go to [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
2. Connect your GitHub repository
3. Configure build settings

#### Build Configuration
```yaml
# Build Command
npm run build

# Run Command
npm start

# Environment Variables
GEMINI_API_KEY=your_api_key_here
NODE_ENV=production
```

## 🔧 Production Configuration

### Environment Variables
```env
GEMINI_API_KEY=your_production_api_key
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://yourdomain.com
```

### Build Scripts
Add these to your `package.json`:

```json
{
  "scripts": {
    "build": "cd client && npm run build",
    "start": "cd server && npm start",
    "postinstall": "cd client && npm install && cd ../server && npm install"
  }
}
```

### Client Configuration
Update `client/src/App.js` to use production API URL:

```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com' 
  : 'http://localhost:3001';
```

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files to Git
- Use platform-specific secret management
- Rotate API keys regularly

### CORS Configuration
```javascript
// In server/app.js
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
};
```

### Rate Limiting
- Implement rate limiting for production
- Monitor API usage
- Set up alerts for quota limits

## 📊 Monitoring

### Health Checks
Add a health check endpoint:

```javascript
// In server/app.js
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
});
```

### Logging
```javascript
// Add structured logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check build logs for errors

2. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names and values
   - Verify API key is valid

3. **CORS Errors**
   - Update CORS origin to your domain
   - Check if client and server URLs match
   - Verify HTTPS configuration

4. **API Rate Limits**
   - Monitor API usage
   - Implement caching if needed
   - Consider upgrading API plan

### Debug Commands
```bash
# Check logs
heroku logs --tail

# Check environment variables
heroku config

# Restart app
heroku restart
```

## 📈 Performance Optimization

### Client Optimization
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading

### Server Optimization
- Enable caching headers
- Use compression middleware
- Implement request throttling

### Database (if added)
- Use connection pooling
- Implement query optimization
- Set up proper indexing

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run build
      - run: npm test
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: ${{ secrets.HEROKU_APP_NAME }}
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

## 📞 Support

For deployment issues:
1. Check platform-specific documentation
2. Review error logs
3. Verify environment configuration
4. Contact platform support if needed

---

**Happy Deploying! 🚀** 