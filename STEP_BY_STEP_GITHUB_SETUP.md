# 📖 Step-by-Step GitHub Setup Guide

Complete manual walkthrough for setting up your ScholarFlow GitHub repository.

## Prerequisites

- GitHub account (free)
- Git installed on your computer
- All files from the outputs folder
- ~15 minutes of your time

---

## 🔴 STEP 1: Create GitHub Repository

### On GitHub.com

1. **Go to GitHub**
   - Visit https://github.com/new
   - Or click "New" → "New repository" from your profile

2. **Fill in Repository Details**
   
   | Field | Value |
   |-------|-------|
   | Repository name | `scholarflow` |
   | Description | `Advanced research paper discovery with Boolean and Semantic search` |
   | Public/Private | **Public** (recommended) |
   | Add .gitignore | **No** (we have our own) |
   | Add LICENSE | **No** (we have MIT License) |
   | Add README | **No** (we have our own) |

3. **Create the Repository**
   - Click the green "Create repository" button
   - You'll see a page like:
   
   ```
   Quick setup — if you've done this kind of thing before
   HTTPS  SSH
   https://github.com/YOUR_USERNAME/scholarflow.git
   ```

4. **Copy the URL**
   - Copy the HTTPS URL: `https://github.com/YOUR_USERNAME/scholarflow.git`
   - You'll need this in Step 2

✅ **Step 1 Complete!**

---

## 🟠 STEP 2: Clone Repository Locally

### On Your Computer

1. **Open Terminal/Command Prompt**
   - macOS/Linux: Terminal application
   - Windows: Git Bash or Command Prompt
   - Navigate to where you want the project

2. **Clone the Repository**
   
   ```bash
   git clone https://github.com/YOUR_USERNAME/scholarflow.git
   cd scholarflow
   ```

3. **Verify Cloning**
   
   ```bash
   pwd                    # macOS/Linux - shows current directory
   cd                     # Windows - shows current directory
   git remote -v          # Should show origin URL
   ```

   Expected output:
   ```
   origin  https://github.com/YOUR_USERNAME/scholarflow.git (fetch)
   origin  https://github.com/YOUR_USERNAME/scholarflow.git (push)
   ```

✅ **Step 2 Complete!**

---

## 🟡 STEP 3: Copy Files from Outputs

### Directory Structure First

1. **Create Directory Structure** (if not already created)

   ```bash
   # Create GitHub templates directory
   mkdir -p .github/ISSUE_TEMPLATE
   mkdir -p .github/workflows
   
   # Create source code directories (if needed)
   mkdir -p src/lib
   mkdir -p src/components/research
   ```

2. **Verify Directory Creation**

   ```bash
   # macOS/Linux
   ls -la .github/
   ls -la src/
   
   # Windows
   dir .github
   dir src
   ```

### Copy Files

**From your outputs folder, copy:**

#### Root Documentation Files
```bash
# Copy these .md files to repository root
- README.md
- LICENSE
- CHANGELOG.md
- CONTRIBUTING.md
- CODE_OF_CONDUCT.md
- CONTRIBUTORS.md
- SECURITY.md
- GITHUB_SETUP_GUIDE.md
- GITHUB_FILES_SUMMARY.md
- BOOLEAN_SEMANTIC_README.md
- BOOLEAN_SEMANTIC_SEARCH.md
- CODE_ANALYSIS_IMPROVEMENTS.md
- INTEGRATION_GUIDE.md
- QUICK_IMPLEMENTATION_GUIDE.md
- .env.example
- .gitignore
```

#### GitHub Templates and Workflows
```bash
# Copy to .github/ directory
.github/
├── FUNDING.yml
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   ├── feature_request.md
│   └── config.yml
├── pull_request_template.md
└── workflows/
    ├── ci.yml
    └── deploy.yml
```

#### React/TypeScript Components
```bash
# Copy to src/ directory
src/lib/
├── booleanParser.ts
└── semanticSearch.ts

src/components/research/
├── SearchModeSelector.tsx
└── BooleanSearchHelp.tsx
```

### Verify All Files Copied

```bash
# Check root files
ls -la | grep -E "\.md|LICENSE|env"

# Check .github structure
ls -la .github/
ls -la .github/ISSUE_TEMPLATE/
ls -la .github/workflows/

# Check src files
ls -la src/lib/
ls -la src/components/research/
```

✅ **Step 3 Complete!**

---

## 🟢 STEP 4: Commit and Push to GitHub

### Configure Git (First Time Only)

```bash
# Set your email
git config --global user.email "your.email@example.com"

# Set your name
git config --global user.name "Your Name"

# Verify configuration
git config --global user.email
git config --global user.name
```

### Stage Files

```bash
# Add all files
git add .

# Verify what will be committed
git status

# You should see "Changes to be committed:" with all your files listed
```

### Commit Changes

```bash
# Create commit
git commit -m "chore: add github configuration, documentation, and components

- Add professional documentation (README, CHANGELOG, CONTRIBUTING, etc)
- Add GitHub issue and PR templates
- Add CI/CD workflows (lint, test, build, deploy)
- Add security policies and code of conduct
- Add React/TypeScript components for Boolean and Semantic search
- Add environment configuration template
- Setup branch protection and community guidelines"
```

### Push to GitHub

```bash
# Push to GitHub (first time)
git push -u origin main

# This creates the main branch and sets it as upstream
# Future pushes can just use: git push
```

Expected output:
```
Counting objects: 150, done.
Delta compression using up to 8 threads.
...
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

### Verify Push

```bash
# Check remote
git remote -v

# Check current branch
git branch -a

# Should show: * main (with remote tracking)
```

✅ **Step 4 Complete!**

---

## 🔵 STEP 5: Configure GitHub Settings

### Go to Repository Settings

1. **Navigate to Settings**
   - Go to: `https://github.com/YOUR_USERNAME/scholarflow`
   - Click "Settings" tab

### Configure General Settings

1. **Default Branch**
   - Settings → General
   - Default branch: Select `main`
   - Click "Update"

2. **Enable Features**
   - ✅ Tick: "Discussions"
   - ✅ Tick: "Projects"
   - Optional: Wiki (your choice)
   - Click "Save changes"

### Add Repository Secrets

1. **Go to Secrets**
   - Settings → Secrets and variables → Actions
   - Click "New repository secret"

2. **Add First Secret**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://your-project.supabase.co`
   - Click "Add secret"

3. **Add Second Secret**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `your_anon_key_here`
   - Click "Add secret"

### Setup Branch Protection

1. **Go to Branch Protection**
   - Settings → Code and automation → Branches
   - Click "Add rule"

2. **Create Rule for main**
   - Branch name pattern: `main`
   - ✅ Tick: "Require a pull request before merging"
   - ✅ Tick: "Require status checks to pass"
   - ✅ Tick: "Require branches to be up to date"
   - ✅ Tick: "Dismiss stale pull request approvals"
   - Click "Create"

### Enable Code Security

1. **Code Security Settings**
   - Settings → Code security and analysis
   - ✅ Enable: "Dependabot alerts"
   - ✅ Enable: "Dependabot security updates"
   - ✅ Enable: "Secret scanning"

### Enable GitHub Actions

1. **Activate Workflows**
   - Go to: "Actions" tab
   - If workflows are disabled: Click "I understand..."
   - Verify `ci.yml` and `deploy.yml` appear in workflow list

### Create Issue Labels

1. **Go to Labels**
   - Issues tab → Labels
   - Click "New label" for each:

   | Label | Color | Description |
   |-------|-------|-------------|
   | bug | #d73a4a (red) | Something isn't working |
   | enhancement | #0075ca (blue) | New feature or request |
   | documentation | #0366d6 (green) | Documentation |
   | good first issue | #7057ff (purple) | Good for newcomers |
   | help wanted | #ed9343 (orange) | Extra attention needed |
   | question | #f7eb3e (yellow) | Question or discussion |
   | wontfix | #cfd3d7 (gray) | Won't be addressed |

✅ **Step 5 Complete!**

---

## ✅ Verify Everything

### Check GitHub Repository

1. **Visit Your Repository**
   - Go to: `https://github.com/YOUR_USERNAME/scholarflow`
   - Verify you see:
     - ✅ README.md displayed
     - ✅ Files in file browser
     - ✅ .github directory visible

2. **Check Workflows**
   - Click "Actions" tab
   - Verify `ci` and `deploy` workflows are listed
   - They may show "No workflow runs yet" - that's OK

3. **Check Issue Templates**
   - Click "Issues" tab
   - Click "New Issue"
   - Verify you see template dropdown with bug/feature options

4. **Check PR Template**
   - Click "Pull Requests" tab
   - Create a test PR
   - Verify template appears

5. **Check Settings**
   - Settings tab
   - Verify all configurations saved
   - Verify secrets are listed (without showing values)

---

## 🎉 Success Indicators

You'll know everything is set up correctly when:

✅ README.md renders nicely on GitHub homepage
✅ All files are visible in the repository
✅ Issue templates appear when creating an issue
✅ PR template appears when creating a pull request
✅ LICENSE is recognized by GitHub
✅ Workflows are visible in Actions tab
✅ Branch protection is active on main
✅ Secrets are stored securely
✅ Dependabot alerts are enabled

---

## 🚀 Next Steps

After GitHub setup:

### Immediate (Next Hour)
1. ✅ Create first release/tag
2. ✅ Write initial project board
3. ✅ Invite team members (if any)

### Short Term (Next Week)
1. Create `/docs` directory with additional guides
2. Add CI/CD badges to README
3. Setup GitHub Pages (optional)
4. Create project documentation

### Medium Term (Next Month)
1. Make first release
2. Build community
3. Accept contributions
4. Monitor security alerts

---

## 🆘 Troubleshooting

### Issue: Push fails with "permission denied"
**Solution:**
```bash
# Update remote URL to use SSH (if SSH key configured)
git remote set-url origin git@github.com:YOUR_USERNAME/scholarflow.git
git push -u origin main
```

### Issue: "main" branch doesn't exist
**Solution:**
```bash
# Create and push main branch
git branch -M main
git push -u origin main
```

### Issue: Files don't appear on GitHub
**Solution:**
```bash
# Verify files are committed
git log --oneline  # Should show your commit

# Check if push succeeded
git remote -v      # Should show origin

# Try pushing again
git push origin main
```

### Issue: Workflows won't run
**Solution:**
1. Check Actions tab - enable if disabled
2. Verify ci.yml and deploy.yml are in `.github/workflows/`
3. Check for YAML syntax errors in workflow files

### Issue: Can't add secrets
**Solution:**
1. Go to Settings → Secrets and variables → Actions
2. Make sure you're in the right repository
3. Use exact names: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

---

## 📞 Need More Help?

- **GitHub Docs:** https://docs.github.com
- **GitHub Guides:** https://guides.github.com
- **Repository Specific:**
  - CONTRIBUTING.md - Contributing guidelines
  - GITHUB_SETUP_GUIDE.md - Setup reference
  - GITHUB_FILES_SUMMARY.md - File descriptions

---

## 📋 Quick Reference

### Essential Git Commands
```bash
# Check status
git status

# View commit log
git log --oneline

# View remotes
git remote -v

# Switch branches
git checkout develop
git checkout main

# Create new branch
git checkout -b feature/my-feature

# Push branch
git push origin feature/my-feature
```

### Important GitHub URLs
```
Repository:     https://github.com/YOUR_USERNAME/scholarflow
Issues:         https://github.com/YOUR_USERNAME/scholarflow/issues
Pull Requests:  https://github.com/YOUR_USERNAME/scholarflow/pulls
Actions:        https://github.com/YOUR_USERNAME/scholarflow/actions
Settings:       https://github.com/YOUR_USERNAME/scholarflow/settings
```

---

**Congratulations! Your GitHub repository is ready! 🎉**

Next: Read CONTRIBUTING.md to accept your first contributions!
