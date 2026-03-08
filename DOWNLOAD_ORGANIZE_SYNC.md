# 📥 Download → Organize → VS Code → GitHub Sync (Complete Guide)

**Everything you need to get ScholarFlow on your computer and synced with GitHub.**

---

## 🎯 Overview

**What you're doing:**
1. Download all 32 files from outputs
2. Organize them in correct folder structure locally
3. Open in VS Code
4. Connect to GitHub repository
5. Sync and push files

**Time: 20 minutes total**

---

## 📥 PART 1: Download Files

### Where to Download From

**Source:** `/mnt/user-data/outputs/` (this folder)

Contains:
- 16 documentation files (.md)
- 8 GitHub configuration files
- 4 React/TypeScript components
- 3 setup guides
- 1 setup script

### Download Steps

#### macOS/Linux
```bash
# Create downloads folder
mkdir -p ~/Downloads/scholarflow-source

# Copy files (adjust path as needed)
# You can use file manager to download or:
cp -r /path/to/outputs/* ~/Downloads/scholarflow-source/
```

#### Windows
1. Open File Explorer
2. Navigate to outputs folder
3. Select all files (Ctrl+A)
4. Right-click → Copy
5. Create folder `C:\Users\YourName\Downloads\scholarflow-source`
6. Right-click → Paste

#### Using Browser
1. Go to file manager in Claude
2. Download files to your Downloads folder
3. Extract if ZIP file

---

## 📂 PART 2: Organize Locally

### Create Project Directory

**macOS/Linux:**
```bash
mkdir -p ~/projects/scholarflow
cd ~/projects/scholarflow
```

**Windows (PowerShell):**
```powershell
mkdir -Path $env:USERPROFILE\projects\scholarflow
cd $env:USERPROFILE\projects\scholarflow
```

**Windows (Command Prompt):**
```cmd
mkdir %USERPROFILE%\projects\scholarflow
cd %USERPROFILE%\projects\scholarflow
```

### Create Folder Structure

**macOS/Linux:**
```bash
# Create all directories at once
mkdir -p .github/ISSUE_TEMPLATE
mkdir -p .github/workflows
mkdir -p src/lib
mkdir -p src/components/research
mkdir -p docs
```

**Windows (PowerShell):**
```powershell
New-Item -ItemType Directory -Path ".github/ISSUE_TEMPLATE" -Force
New-Item -ItemType Directory -Path ".github/workflows" -Force
New-Item -ItemType Directory -Path "src/lib" -Force
New-Item -ItemType Directory -Path "src/components/research" -Force
New-Item -ItemType Directory -Path "docs" -Force
```

### Copy Files to Correct Locations

**Copy root files (all .md files):**

macOS/Linux:
```bash
cp ~/Downloads/scholarflow-source/*.md .
cp ~/Downloads/scholarflow-source/.gitignore .
cp ~/Downloads/scholarflow-source/.env.example .
```

Windows:
```powershell
Copy-Item "$env:USERPROFILE\Downloads\scholarflow-source\*.md" .
Copy-Item "$env:USERPROFILE\Downloads\scholarflow-source\.gitignore" .
Copy-Item "$env:USERPROFILE\Downloads\scholarflow-source\.env.example" .
```

**Copy .github files:**

macOS/Linux:
```bash
cp -r ~/Downloads/scholarflow-source/.github/* .github/
```

Windows:
```powershell
Copy-Item "$env:USERPROFILE\Downloads\scholarflow-source\.github\*" .github\ -Recurse
```

**Copy source code:**

macOS/Linux:
```bash
cp ~/Downloads/scholarflow-source/booleanParser.ts src/lib/
cp ~/Downloads/scholarflow-source/semanticSearch.ts src/lib/
cp ~/Downloads/scholarflow-source/SearchModeSelector.tsx src/components/research/
cp ~/Downloads/scholarflow-source/BooleanSearchHelp.tsx src/components/research/
```

Windows:
```powershell
Copy-Item "$env:USERPROFILE\Downloads\scholarflow-source\booleanParser.ts" src\lib\
Copy-Item "$env:USERPROFILE\Downloads\scholarflow-source\semanticSearch.ts" src\lib\
Copy-Item "$env:USERPROFILE\Downloads\scholarflow-source\SearchModeSelector.tsx" src\components\research\
Copy-Item "$env:USERPROFILE\Downloads\scholarflow-source\BooleanSearchHelp.tsx" src\components\research\
```

### Verify Structure

```bash
# List all files recursively
tree .

# Or simple listing
ls -la
ls -la .github/
ls -la src/lib/
ls -la src/components/research/
```

Expected output:
```
.
├── .github/
├── src/
├── docs/
├── README.md
├── LICENSE
└── [other files]
```

---

## 💻 PART 3: Open in VS Code

### Option A: From Terminal

```bash
# From scholarflow directory
code .
```

### Option B: From VS Code

1. Open VS Code
2. File → Open Folder
3. Navigate to your scholarflow folder
4. Click Open

### Option C: Drag & Drop

1. Open VS Code
2. Drag scholarflow folder to VS Code window

### Verify Files in VS Code

In VS Code's Explorer (left sidebar), you should see:

```
📁 scholarflow
  📁 .github
    📄 FUNDING.yml
    📁 ISSUE_TEMPLATE
    📁 workflows
  📁 src
    📁 lib
      📄 booleanParser.ts
      📄 semanticSearch.ts
    📁 components
  📄 README.md
  📄 LICENSE
  ... (more files)
```

---

## 🔗 PART 4: Connect to GitHub

### Prerequisite: GitHub Repository

If you don't have a GitHub repo yet:

1. Go to https://github.com/new
2. Create repository: `scholarflow`
3. Don't initialize with README/gitignore
4. Copy the HTTPS URL

### Initialize Git Locally

**In VS Code terminal (Ctrl+`):**

```bash
# Initialize git
git init

# Add GitHub remote (paste YOUR URL)
git remote add origin https://github.com/YOUR_USERNAME/scholarflow.git

# Verify connection
git remote -v
```

Expected output:
```
origin  https://github.com/YOUR_USERNAME/scholarflow.git (fetch)
origin  https://github.com/YOUR_USERNAME/scholarflow.git (push)
```

### Configure Git (First Time)

```bash
# Set your email
git config --global user.email "your.email@example.com"

# Set your name
git config --global user.name "Your Name"

# Verify
git config --global user.email
git config --global user.name
```

---

## 📤 PART 5: Sync with GitHub

### Stage Files

**Option A: VS Code Source Control**

1. Click Source Control icon (left sidebar)
2. Click "+" next to each file to stage
3. Or click "+" at top to stage all

**Option B: Terminal**

```bash
git add .
git status  # Review what will be added
```

### Create Commit

**Option A: VS Code**

1. In Source Control tab
2. Enter message in text box
3. Click checkmark to commit

**Option B: Terminal**

```bash
git commit -m "chore: initial project setup

- Add professional documentation
- Add GitHub templates and workflows
- Add React/TypeScript components
- Setup for collaboration"
```

### Push to GitHub

**Option A: VS Code**

1. In Source Control tab
2. Click "..." → Push

**Option B: Terminal**

```bash
git push -u origin main

# If you get error about "main" not existing:
git branch -M main
git push -u origin main
```

Expected output:
```
Counting objects: ...
Delta compression using up to 8 threads
...
 * [new branch]      main -> main
```

✅ **Files are now on GitHub!**

---

## ✅ Verification Checklist

### Local Files
- [ ] All .md files in root directory
- [ ] LICENSE file present
- [ ] .github folder exists
- [ ] src/lib folder with .ts files
- [ ] src/components/research folder with .tsx files
- [ ] .gitignore present
- [ ] .env.example present

### VS Code
- [ ] Folder opens in VS Code
- [ ] File explorer shows all files
- [ ] Source Control shows initialized git
- [ ] Terminal works (Ctrl+`)

### GitHub
- [ ] Repo created on GitHub
- [ ] Remote configured (`git remote -v` works)
- [ ] Files pushed to GitHub
- [ ] Files visible on github.com

---

## 🔐 Create .env.local

⚠️ **Do NOT commit this to git!**

### In VS Code:

1. File → New File
2. Name: `.env.local`
3. Add your secrets:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_secret_key_here
```

4. Save (Cmd+S / Ctrl+S)

✅ Already in `.gitignore` - won't be committed

---

## 🎨 VS Code Extensions (Optional)

Recommended extensions to install:

1. **GitLens**
   - Better git integration
   - See blame info

2. **Prettier**
   - Auto-format code
   - Consistent style

3. **ESLint**
   - Code quality
   - Find problems

4. **Thunder Client**
   - API testing
   - Test endpoints

### Install:

1. Click Extensions icon (left sidebar)
2. Search for extension name
3. Click Install

---

## 📋 File Locations Reference

| File Type | Location | Purpose |
|-----------|----------|---------|
| Documentation | Root directory | README, guides, policies |
| GitHub config | `.github/` | Templates, workflows |
| Source code | `src/lib/` | TypeScript utilities |
| Components | `src/components/research/` | React components |
| Secrets | `.env.local` | Your API keys (NOT in git) |
| Ignore rules | `.gitignore` | What NOT to commit |

---

## 🚀 Next Steps

After everything is synced:

### Immediate
- [ ] Verify files on GitHub
- [ ] Test git commands
- [ ] Create .env.local
- [ ] Install extensions

### This Week
- [ ] Read README.md
- [ ] Review CONTRIBUTING.md
- [ ] Setup GitHub branch protection
- [ ] Add repository secrets to GitHub

### Next
- [ ] Create feature branches
- [ ] Start development
- [ ] Accept contributions

---

## 🆘 Troubleshooting

### "git command not found"
```bash
# Install Git from git-scm.com
# Or: brew install git (Mac)
# Or: apt-get install git (Linux)
```

### "VS Code won't open"
```bash
# Install from: code.visualstudio.com
# Or use: File → Open Folder in file manager
```

### "git push fails"
```bash
# Check connection
git remote -v

# Check status
git status

# Try authenticating again
git pull origin main
```

### "Files show as untracked"
```bash
# This is normal first time
git add .
git status  # Review
git commit -m "initial"
git push -u origin main
```

---

## 📊 Visual Workflow

```
┌─────────────────────┐
│  Downloads Folder   │
│  (32 files)         │
└──────────┬──────────┘
           │ Download
           ▼
┌─────────────────────┐
│  Local Folder       │
│ ~/projects/         │
│ scholarflow/        │
└──────────┬──────────┘
           │ Open in VS Code
           ▼
┌─────────────────────┐
│   VS Code           │
│  - File Explorer    │
│  - Terminal         │
│  - Source Control   │
└──────────┬──────────┘
           │ git push
           ▼
┌─────────────────────┐
│   GitHub            │
│ scholarflow repo    │
│ ready for collab!   │
└─────────────────────┘
```

---

## 💡 Pro Tips

1. **Use VS Code's integrated terminal** - No need to switch windows
2. **Check Source Control tab often** - See what changed
3. **Commit frequently** - Small, meaningful commits
4. **Create branches for features** - Keep main clean
5. **Review before pushing** - Check `git status` first

---

## 🎉 You're Done!

After completing this guide:

✅ Files downloaded to your computer
✅ Files organized in correct structure
✅ Folder open in VS Code
✅ Git initialized and connected to GitHub
✅ Files pushed to GitHub
✅ Ready for development!

**Next: Start coding! 🚀**

---

## 📞 Quick Reference

### Essential Commands

```bash
# Check status
git status

# Add files
git add .

# Commit
git commit -m "your message"

# Push
git push

# Create branch
git checkout -b feature/name

# Switch branch
git checkout main

# View log
git log --oneline
```

### VS Code Shortcuts

| Action | Shortcut |
|--------|----------|
| Terminal | Ctrl+` |
| Source Control | Ctrl+Shift+G |
| Save | Cmd+S / Ctrl+S |
| Find | Cmd+F / Ctrl+F |
| Replace | Cmd+H / Ctrl+H |
| Command Palette | Cmd+Shift+P / Ctrl+Shift+P |

---

**Congratulations! Your ScholarFlow repository is fully set up locally and synced with GitHub! 🎉**
