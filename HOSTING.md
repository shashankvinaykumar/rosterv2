# Hosting Guide for APM Roster

This guide covers several hosting options for your Vite + React application.

## Prerequisites

First, build your application for production:

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

---

## Option 1: Vercel (Recommended - Easiest)

**Best for:** Quick deployment, automatic HTTPS, custom domains, free tier

### Steps:

1. **Install Vercel CLI** (optional, can also use web interface):
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   - Follow the prompts
   - It will detect Vite automatically
   - Your site will be live in seconds!

3. **Or use the web interface:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel auto-detects Vite and deploys

**Pros:**
- ✅ Free tier with generous limits
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Automatic deployments on git push
- ✅ Global CDN

---

## Option 2: Netlify

**Best for:** Simple deployments, form handling, serverless functions

### Steps:

1. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Build and deploy:**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Or use the web interface:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login
   - Drag and drop your `dist` folder
   - Or connect your Git repository for auto-deployments

**Pros:**
- ✅ Free tier
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Easy drag-and-drop deployment

---

## Option 3: Cloudflare Pages

**Best for:** Fast global CDN, free tier, great performance

### Steps:

1. **Build your app:**
   ```bash
   npm run build
   ```

2. **Deploy via Cloudflare Dashboard:**
   - Go to [pages.cloudflare.com](https://pages.cloudflare.com)
   - Sign up/login
   - Click "Create a project"
   - Connect your Git repository OR upload the `dist` folder
   - Build command: `npm run build`
   - Build output directory: `dist`

**Pros:**
- ✅ Free tier
- ✅ Very fast global CDN
- ✅ Automatic HTTPS
- ✅ Custom domains

---

## Option 4: GitHub Pages

**Best for:** Free hosting for public repositories

### Steps:

1. **Install gh-pages package:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json scripts:**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Update vite.config.js** to set base path:
   ```js
   export default defineConfig({
     base: '/rosterv2/', // Replace with your repo name
     plugins: [react()],
     // ... rest of config
   })
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages:**
   - Go to your repo Settings → Pages
   - Select source: `gh-pages` branch
   - Your site will be at: `https://yourusername.github.io/rosterv2/`

**Pros:**
- ✅ Free for public repos
- ✅ Integrated with GitHub

**Cons:**
- ⚠️ Requires public repository (or GitHub Pro)
- ⚠️ Need to configure base path

---

## Option 5: AWS S3 + CloudFront

**Best for:** Enterprise, custom infrastructure needs

### Steps:

1. **Build:**
   ```bash
   npm run build
   ```

2. **Upload to S3:**
   - Create an S3 bucket
   - Enable static website hosting
   - Upload `dist` folder contents
   - Set bucket policy for public read access

3. **Optional - Add CloudFront:**
   - Create CloudFront distribution
   - Point to S3 bucket
   - Get CloudFront URL

**Pros:**
- ✅ Highly scalable
- ✅ Custom domain with Route 53
- ✅ Full control

**Cons:**
- ⚠️ More complex setup
- ⚠️ Costs money (though minimal for static sites)

---

## Option 6: Traditional Web Hosting (cPanel, etc.)

**Best for:** If you already have web hosting

### Steps:

1. **Build:**
   ```bash
   npm run build
   ```

2. **Upload:**
   - Upload all files from `dist` folder to your web root (usually `public_html`)
   - Ensure `index.html` is in the root

3. **Configure:**
   - Some hosts may need `.htaccess` for SPA routing:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

---

## Quick Comparison

| Platform | Ease | Free Tier | Auto Deploy | Custom Domain |
|----------|------|-----------|-------------|---------------|
| Vercel | ⭐⭐⭐⭐⭐ | ✅ | ✅ | ✅ |
| Netlify | ⭐⭐⭐⭐⭐ | ✅ | ✅ | ✅ |
| Cloudflare Pages | ⭐⭐⭐⭐ | ✅ | ✅ | ✅ |
| GitHub Pages | ⭐⭐⭐ | ✅ | ✅ | ✅ |
| AWS S3 | ⭐⭐ | ❌ | ❌ | ✅ |

---

## Recommended: Vercel

For the easiest deployment experience, I recommend **Vercel**:

1. Push your code to GitHub
2. Go to vercel.com and sign in with GitHub
3. Click "New Project" and import your repo
4. Vercel will auto-detect Vite and deploy
5. Done! Your site is live with HTTPS and a custom domain option

---

## Notes

- The `merged_roster.json` file will be included in the build
- Make sure it's not too large (consider compressing or hosting separately if needed)
- All static assets are optimized during build
- The app works as a Single Page Application (SPA)

