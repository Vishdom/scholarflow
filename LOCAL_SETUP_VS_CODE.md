# 📂 Download & Organize Files Locally + VS Code Setup

Complete guide for downloading, organizing files locally, and syncing with VS Code & GitHub.

---

## 🎯 What You're Doing

1. Download all files from outputs folder to your computer
2. Organize them in correct directory structure
3. Open in VS Code
4. Connect to GitHub
5. Push to your repository

**Total time: 15-20 minutes**

---

## 📥 STEP 1: Download Files to Your Computer

### Option A: Download as ZIP (Easiest)

1. **Download from outputs folder**
   - Click on `/mnt/user-data/outputs` folder
   - Click download button (if available)
   - Or select all files and download

2. **Extract ZIP file**
   - macOS: Double-click to extract
   - Windows: Right-click → Extract All
   - Linux: `unzip filename.zip`

3. **Create scholarflow folder**
   ```bash
   mkdir scholarflow
   cd scholarflow
   # Extract/move files here
   ```

### Option B: Copy Files One by One

If ZIP isn't available:

1. Create a folder: `scholarflow`
2. Copy each file:
   - All `.md` files to root
   - `.github/` directory to root
   - Component files to `src/` directories
   - `.gitignore` and `.env.example`

---

## 📁 STEP 2: Organize Files Locally

### Perfect Directory Structure

After extracting/copying, you should have:

```
scholarflow/
├── .github/
│   ├── FUNDING.yml
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── config.yml
│   ├── pull_request_template.md
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── src/
│   ├── lib/
│   │   ├── booleanParser.ts
│   │   └── semanticSearch.ts
│   └── components/research/
│       ├── SearchModeSelector.tsx
│       └── BooleanSearchHelp.tsx
│
├── README.md
├── LICENSE
├── CHANGELOG.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTORS.md
├── SECURITY.md
├── .gitignore
├── .env.example
├── package.json (your existing file)
└── [other files]
```

### Verify Structure

```bash
# Check main directories
ls -la
ls -la .github/
ls -la src/

# Verify key files exist
ls README.md LICENSE CHANGELOG.md CONTRIBUTING.md
```

---

## 💻 STEP 3: Open in VS Code

### Option A: Open from Terminal

```bash
# Navigate to scholarship folder
cd scholarflow

# Open in VS Code
code .
```

### Option B: Open from VS Code

1. Open VS Code
2. File → Open Folder
3. Navigate to `scholarflow` folder
4. Click "Open"

### VS Code File Explorer

You should see in VS Code's file explorer:

```
📁 scholarflow
  📁 .github
  📁 src
  📄 README.md
  📄 LICENSE
  📄 CHANGELOG.md
  ... (other files)
```

---

## 🔗 STEP 4: Initialize Git & Connect to GitHub

### If you already have GitHub repo:

```bash
# Navigate to folder
cd scholarflow

# Initialize git
git init

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/scholarflow.git

# Verify connection
git remote -v
```

Expected output:
```
origin  https://github.com/YOUR_USERNAME/scholarflow.git (fetch)
origin  https://github.com/YOUR_USERNAME/scholarflow.git (push)
```

### If you DON'T have GitHub repo yet:

1. Go to https://github.com/new
2. Create repo named `scholarflow`
3. Copy the URL
4. Run these commands:

```bash
cd scholarflow
git init
git remote add origin <paste-url-here>
git remote -v
```

---

## 📤 STEP 5: Push Files to GitHub

### Configure Git (First Time)

```bash
git config --global user.email "your.email@example.com"
git config --global user.name "Your Name"
```

### Stage & Commit Files

```bash
# Add all files
git add .

# Check what will be committed
git status

# Create commit
git commit -m "chore: add github configuration, documentation, and components

- Add professional documentation
- Add GitHub templates and workflows
- Add React/TypeScript components
- Add environment configuration
- Add security and community guidelines"
```

### Push to GitHub

```bash
# Push to GitHub
git push -u origin main

# If you get "main" doesn't exist error:
git branch -M main
git push -u origin main
```

✅ **Files are now on GitHub!**

---

## 🎨 VS Code Extensions (Recommended)

Install these extensions for better development:

1. **GitLens** - Git integration
   - See who changed what
   - Blame annotations
   - Repository explorer

2. **GitHub Copilot** - AI code assistance
   - Smart code suggestions
   - Function generation

3. **Prettier** - Code formatter
   - Auto-format code
   - Consistency

4. **ESLint** - Code quality
   - Find problems
   - Suggestions

5. **Thunder Client** - API testing
   - Test endpoints
   - Mock servers

### Install Extensions

In VS Code:
1. Click Extensions icon (left sidebar)
2. Search for each extension
3. Click "Install"

---

## 🔄 VS Code + GitHub Workflow

### Daily Workflow

```bash
# 1. See what changed
git status

# 2. Stage changes
git add .

# 3. Commit with message
git commit -m "feat: add new feature"

# 4. Push to GitHub
git push
```

### In VS Code

**Source Control Tab** (left sidebar):

1. Click **Source Control** icon
2. See all changed files
3. Click "+" to stage files
4. Enter commit message
5. Click checkmark to commit
6. Click "..." → Push

### Create & Switch Branches

```bash
# Create new feature branch
git checkout -b feature/my-feature

# Do your work...

# Push branch
git push origin feature/my-feature

# Create PR on GitHub website
```

---

## 🔐 Managing Secrets in VS Code

### Create .env.local (NOT committed)

In VS Code:

1. File → New File
2. Name it `.env.local`
3. Add your secrets:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_secret_key_here
```

4. Save file
5. `.gitignore` already excludes it

**⚠️ NEVER commit .env.local**

---

## 📋 Directory Structure Reference

### Root Level Files

```
.env.example              ← Template (committed)
.env.local               ← Your secrets (NOT committed)
.gitignore               ← Git ignore rules (committed)
package.json             ← Project dependencies
README.md                ← Project overview
LICENSE                  ← MIT License
CHANGELOG.md             ← Version history
CONTRIBUTING.md          ← Contribution guide
CODE_OF_CONDUCT.md       ← Community standards
SECURITY.md              ← Security policy
```

### GitHub Configuration

```
.github/
├── FUNDING.yml          ← Sponsorship options
├── ISSUE_TEMPLATE/      ← Issue templates
│   ├── bug_report.md
│   ├── feature_request.md
│   └── config.yml
├── pull_request_template.md
└── workflows/           ← CI/CD automation
    ├── ci.yml          ← Tests/linting
    └── deploy.yml      ← Deployment
```

### Source Code

```
src/
├── lib/                 ← Utilities & libraries
│   ├── booleanParser.ts
│   ├── semanticSearch.ts
│   ├── supabase.ts
│   └── utils.ts
├── components/          ← React components
│   ├── research/
│   │   ├── SearchModeSelector.tsx
│   │   ├── BooleanSearchHelp.tsx
│   │   └── ... (other components)
│   └── ui/             ← UI library components
├── contexts/            ← React contexts
├── hooks/               ← Custom hooks
├── pages/               ← Page components
├── types/               ← TypeScript types
├── App.tsx              ← Root component
└── main.tsx             ← Entry point
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] All files downloaded successfully
- [ ] Directory structure matches above
- [ ] Can open folder in VS Code
- [ ] Git initialized (`git status` works)
- [ ] Remote configured (`git remote -v` shows origin)
- [ ] Can see files in VS Code explorer
- [ ] .env.local created (if needed)
- [ ] Files pushed to GitHub

---

## 🆘 Troubleshooting

### "Permission denied" when git push

```bash
# Check remote URL
git remote -v

# If using HTTPS, try SSH:
git remote set-url origin git@github.com:YOUR_USERNAME/scholarflow.git

# Or generate personal access token on GitHub
# Use token as password when pushing
```

### VS Code doesn't recognize Git

```bash
# Open integrated terminal in VS Code
# Terminal → New Terminal

# Initialize git
git init

# Check status
git status
```

### Files don't appear in VS Code

1. Click File → Open Folder
2. Select scholarflow folder
3. Click Open

### Changes not showing in Source Control

1. Open Source Control tab
2. Click refresh icon
3. Or close and reopen VS Code

---

## 📚 VS Code Tips & Tricks

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Command Palette | Cmd+Shift+P (Mac) / Ctrl+Shift+P (Windows) |
| Open Terminal | Ctrl+` |
| New File | Cmd+N (Mac) / Ctrl+N (Windows) |
| Save All | Cmd+Shift+S / Ctrl+Shift+S |
| Find & Replace | Cmd+H / Ctrl+H |
| Source Control | Ctrl+Shift+G |
| Extensions | Cmd+Shift+X / Ctrl+Shift+X |

### Integrated Terminal

1. Terminal → New Terminal
2. Or press Ctrl+`
3. Run git commands directly in VS Code

### Git in VS Code

1. Click Source Control icon (left sidebar)
2. See all changes
3. Stage/commit/push without terminal

---

## 🚀 Next Steps

### Immediate (Next 5 minutes)
- [ ] Verify all files downloaded
- [ ] Check directory structure
- [ ] Open in VS Code
- [ ] Run `git status` to verify git works

### Short Term (Next 30 minutes)
- [ ] Create .env.local with your secrets
- [ ] Install VS Code extensions
- [ ] Test git push command
- [ ] Verify files on GitHub

### Medium Term (Next hour)
- [ ] Read CONTRIBUTING.md
- [ ] Review component code
- [ ] Plan first feature
- [ ] Create GitHub issues

---

## 📞 Need Help?

### Common Issues

| Problem | Solution |
|---------|----------|
| Can't clone repo | Make sure URL is correct, check GitHub access |
| Git not found | Install Git from git-scm.com |
| VS Code doesn't open folder | Try File → Open Folder, select scholarflow |
| Files not staged | Click "+" icon in Source Control tab |
| Push fails | Check internet, verify GitHub credentials |

### Documentation Files

- **STEP_BY_STEP_GITHUB_SETUP.md** - Detailed GitHub setup
- **GITHUB_SETUP_CHECKLIST.md** - Checklist to track progress
- **README.md** - Project overview
- **CONTRIBUTING.md** - How to contribute

---

## 💡 Pro Tips

1. **Use VS Code's Source Control tab** - No need to memorize git commands
2. **Create branches for features** - Keep main clean
3. **Write clear commit messages** - Helps future developers
4. **Use .gitignore** - Already configured for you
5. **Keep .env.local out of git** - Already in .gitignore

---

## 🎯 You're Ready!

After completing this guide, you'll have:

✅ Files organized locally
✅ VS Code set up and ready
✅ Git initialized and connected to GitHub
✅ Files pushed to GitHub repository
✅ Ready to start developing

**Next: Read CONTRIBUTING.md and start coding! 🚀**

---

## Quick Command Reference

```bash
# Setup
cd scholarflow
git init
git remote add origin <url>

# Daily workflow
git status              # See what changed
git add .               # Stage files
git commit -m "msg"     # Create commit
git push                # Push to GitHub

# Branches
git checkout -b feature/name   # Create branch
git checkout main              # Switch to main
git push origin feature/name   # Push branch

# Check status
git log --oneline       # See commits
git remote -v           # See GitHub connection
git branch -a           # See all branches
```

---

**Congratulations! Your local setup is complete! 🎉**

All files are organized and ready for development. Start with reading the README.md and CONTRIBUTING.md files.
