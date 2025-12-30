# Quick Deployment Commands

Since your repository is already set up, here are the exact commands to deploy:

## Step 1: Commit Your Latest Changes

```bash
cd c:\Users\Hp\OneDrive\Desktop\Anik-portfolio\portfolio

# Check what files have changed
git status

# Add all changes
git add .

# Commit with a message
git commit -m "Added IISWPS project and removed Portfolio v1"

# Push to GitHub
git push origin main
```

## Step 2: Enable GitHub Pages

1. Go to: https://github.com/Anik-tB/portfolio/settings/pages
2. Under "Source", select:
   - Branch: `main`
   - Folder: `/ (root)`
3. Click "Save"
4. Wait 1-2 minutes for deployment

## Step 3: Access Your Live Portfolio

Your portfolio will be available at one of these URLs:
- `https://anik-tb.github.io/portfolio/`

OR if you want it at the root domain (`https://anik-tb.github.io`):

### Option: Rename Repository for Root Domain

1. Go to repository settings: https://github.com/Anik-tB/portfolio/settings
2. Under "Repository name", change `portfolio` to `Anik-tB.github.io`
3. Click "Rename"
4. Update your local remote:
   ```bash
   git remote set-url origin https://github.com/Anik-tB/Anik-tB.github.io.git
   ```
5. Your site will be at: `https://anik-tb.github.io`

---

**Current Repository**: https://github.com/Anik-tB/portfolio
**After Deployment**: https://anik-tb.github.io/portfolio/

Choose which URL structure you prefer!
