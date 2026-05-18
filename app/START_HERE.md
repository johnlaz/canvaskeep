# CanvasKeep - Ready to Deploy

Your app is ready! All files are in this folder with your Client ID already configured.

## Quick Deploy to GitHub Pages

### Option 1: Command Line (Git)
```bash
# 1. Create new repo on GitHub (call it "canvaskeep")

# 2. Clone it
git clone https://github.com/YOUR-USERNAME/canvaskeep.git
cd canvaskeep

# 3. Copy all files from outputs folder into this folder

# 4. Push to GitHub
git add .
git commit -m "Add CanvasKeep"
git push origin main
```

### Option 2: GitHub Web UI (No Command Line)
1. Go to https://github.com/new
2. Create repo named "canvaskeep"
3. Go to your new repo
4. Click "Add file" → "Upload files"
5. Drag and drop ALL files from outputs folder
6. Click "Commit changes"

### Option 3: GitHub Desktop App
1. Create repo named "canvaskeep"
2. Open GitHub Desktop
3. Copy all files into the repo folder
4. GitHub Desktop will detect changes
5. Commit and push

---

## After Upload: Enable GitHub Pages

1. Go to your repo on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Source," select **main** branch
5. Click **Save**
6. Wait 2-3 minutes
7. You'll see your live URL: https://YOUR-USERNAME.github.io/canvaskeep

---

## Final Step: Add URL to Google Cloud

1. Go to https://console.cloud.google.com
2. Select your project
3. **APIs & Services** → **Credentials**
4. Click your OAuth Client ID
5. Under **Authorized JavaScript origins**, add:
   ```
   https://YOUR-USERNAME.github.io
   ```
6. Click **Save**
7. Wait 5-10 minutes

---

## Done!

Your app is live and ready to use!

Users can:
- Open the link
- Add artwork photos
- Organize by child
- View gallery mode
- Backup to Google Drive
- All offline-first

---

## Files Included

- **index.html** - Main app (with your Client ID ✅)
- **manifest.json** - PWA config
- **sw.js** - Service Worker (offline support)
- **icons** - App icons for phones/desktop
- **README.md** - Info about the app
- **Markdown guides** - Setup instructions

Just upload everything and you're good to go!

