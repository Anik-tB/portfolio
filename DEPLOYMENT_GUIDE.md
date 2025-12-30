# GitHub Pages Deployment Guide

This guide will help you deploy your portfolio to GitHub Pages so it's accessible on the internet.

## Prerequisites

✅ Git is installed (version 2.51.1.windows)
✅ Git repository is initialized
✅ Portfolio files are ready

## Step 1: Create a GitHub Repository

1. **Go to GitHub**: Visit [github.com](https://github.com) and sign in
2. **Create New Repository**:
   - Click the `+` icon in the top right → "New repository"
   - **Repository name**: `Anik-tB.github.io` (use your exact GitHub username)
   - **Description**: "My Personal Portfolio Website"
   - **Visibility**: Public (required for free GitHub Pages)
   - **DO NOT** initialize with README, .gitignore, or license
   - Click "Create repository"

> **Important**: The repository name MUST be `yourusername.github.io` for it to work as your main GitHub Pages site.

## Step 2: Connect Your Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Navigate to your portfolio directory
cd c:\Users\Hp\OneDrive\Desktop\Anik-portfolio\portfolio

# Check current status
git status

# Add all files to staging
git add .

# Commit your changes
git commit -m "Initial portfolio deployment"

# Add GitHub repository as remote (replace with your actual repo URL)
git remote add origin https://github.com/Anik-tB/Anik-tB.github.io.git

# Push to GitHub
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. **Go to Repository Settings**:
   - Navigate to your repository on GitHub
   - Click "Settings" tab
   - Click "Pages" in the left sidebar

2. **Configure GitHub Pages**:
   - **Source**: Select "Deploy from a branch"
   - **Branch**: Select `main` and `/ (root)`
   - Click "Save"

3. **Wait for Deployment**:
   - GitHub will build and deploy your site (takes 1-2 minutes)
   - A green checkmark will appear when ready
   - Your site will be live at: `https://Anik-tB.github.io`

## Step 4: Verify Your Deployment

1. Visit `https://Anik-tB.github.io` (replace with your username)
2. Your portfolio should be live!

## Making Updates

Whenever you make changes to your portfolio:

```bash
# Save your changes in your editor first

# Add changes
git add .

# Commit with a descriptive message
git commit -m "Updated projects section"

# Push to GitHub
git push

# Wait 1-2 minutes for GitHub Pages to rebuild
```

## Adding a Custom Domain (Optional)

If you want to use a custom domain like `www.yourdomain.com`:

1. **Buy a domain** from Namecheap, GoDaddy, etc.

2. **Add CNAME file** to your repository:
   - Create a file named `CNAME` (no extension)
   - Add your domain: `www.yourdomain.com`
   - Commit and push

3. **Configure DNS** at your domain registrar:
   - Add A records pointing to GitHub's IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Add CNAME record: `www` → `Anik-tB.github.io`

4. **Update GitHub Pages settings**:
   - Go to Settings → Pages
   - Enter your custom domain
   - Enable "Enforce HTTPS"

## Troubleshooting

### Site not loading?
- Wait 5-10 minutes after first deployment
- Check repository name matches `username.github.io` exactly
- Ensure repository is public

### Changes not showing?
- Wait 1-2 minutes for rebuild
- Clear browser cache (Ctrl + F5)
- Check GitHub Actions tab for build status

### 404 Error?
- Verify `index.html` is in the root directory
- Check file names are correct (case-sensitive)

## Useful Commands

```bash
# Check repository status
git status

# View commit history
git log --oneline

# Check remote repository
git remote -v

# Pull latest changes
git pull

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

## Next Steps

- ✅ Deploy your portfolio
- 📊 Add Google Analytics (optional)
- 🎨 Continue improving your portfolio
- 🌐 Consider buying a custom domain
- 📱 Test on mobile devices
- 🔍 Optimize for SEO

## Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Custom Domain Setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)

---

**Your Portfolio URL**: `https://Anik-tB.github.io`

Good luck with your deployment! 🚀
