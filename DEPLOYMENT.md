# 🚀 Vercel Deployment Guide - Breakout Game

This guide will walk you through deploying your Breakout game to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier works perfectly)
- [Git](https://git-scm.com/) installed on your computer
- A GitHub, GitLab, or Bitbucket account

## Method 1: Deploy via Vercel CLI (Fastest)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate with your Vercel account.

### Step 3: Deploy

From your project directory:

```bash
# First deployment (will prompt for project configuration)
vercel

# Or deploy directly to production
vercel --prod
```

The CLI will:
1. Detect your Vite project automatically
2. Build the project using `npm run build`
3. Deploy the `dist` folder
4. Provide you with a live URL

**That's it!** Your game is now live at `https://your-project.vercel.app`

---

## Method 2: Deploy via Git Integration (Recommended for Continuous Deployment)

### Step 1: Create a Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Vintage Breakout game"
```

### Step 2: Push to GitHub

1. Create a new repository on [GitHub](https://github.com/new)
2. **Don't** initialize with README (you already have one)
3. Copy the repository URL
4. Push your code:

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Vercel will auto-detect Vite configuration:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. Click **"Deploy"**

### Step 4: Verify Deployment

Once deployment completes (usually < 1 minute):
- Visit the provided URL
- Test all game features:
  - ✅ Start screen loads
  - ✅ Gameplay works smoothly
  - ✅ Sounds play correctly
  - ✅ Mobile controls work
  - ✅ High score persists
  - ✅ All 8 levels accessible

---

## Continuous Deployment

With Git integration, every push to your `main` branch automatically triggers a new deployment:

```bash
# Make changes to your code
git add .
git commit -m "Update brick colors"
git push

# Vercel automatically deploys the new version!
```

---

## Custom Domain (Optional)

To use your own domain:

1. Go to your project in Vercel Dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

---

## Environment Variables

This game doesn't require environment variables, but if you add features that need them:

1. Go to **"Settings"** → **"Environment Variables"**
2. Add variables as needed
3. Redeploy for changes to take effect

---

## Troubleshooting

### Build Fails

**Error**: `npm install` fails
- **Solution**: Delete `package-lock.json` and `node_modules`, then run `npm install` locally to regenerate

**Error**: Vite build fails
- **Solution**: Run `npm run build` locally to see the exact error
- Check that all imports are correct
- Verify file paths use `/` not `\`

### Game Doesn't Load

**Issue**: Blank screen after deployment
- **Solution**: Check browser console for errors
- Verify all assets are in the `dist` folder after build
- Ensure `vercel.json` is configured correctly

**Issue**: 404 errors on refresh
- **Solution**: The `vercel.json` configuration handles this. If missing, add:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Sounds Don't Play

**Issue**: Audio not working on mobile
- **Cause**: Mobile browsers require user interaction before audio
- **Solution**: Already handled in `SoundManager.js` - game initializes audio on first click

---

## Performance Optimization

Your game is already optimized, but for future reference:

```javascript
// vite.config.js
export default {
  build: {
    minify: 'terser',           // ✅ Already configured
    sourcemap: false,           // ✅ Already configured
    rollupOptions: {
      output: {
        manualChunks: undefined // ✅ Already configured
      }
    }
  }
}
```

---

## Monitoring

Vercel automatically provides:
- **Analytics**: View visitor traffic (Settings → Analytics)
- **Speed Insights**: Monitor performance
- **Deployment Logs**: Debug issues

---

## Quick Commands Reference

```bash
# Local development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel (CLI)
vercel --prod

# View deployment logs
vercel logs
```

---

## Project URLs

After deployment, you'll have:
- **Production URL**: `https://your-project.vercel.app`
- **Preview URLs**: Unique URL for each Git branch
- **Custom Domain**: (if configured)

---

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

**Your Breakout game is now live and ready to share with the world! 🎮🚀**
