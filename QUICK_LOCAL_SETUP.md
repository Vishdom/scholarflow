# ⚡ Quick Local Setup (5 Minutes)

**Fastest way to get your ScholarFlow repository locally organized and ready in VS Code.**

---

## 🎯 TL;DR

```bash
# 1. Download files from outputs to ~/Downloads/scholarflow-files

# 2. Create and setup project
mkdir -p ~/projects/scholarflow
cd ~/projects/scholarflow

# 3. Create directory structure
mkdir -p .github/ISSUE_TEMPLATE .github/workflows src/lib src/components/research

# 4. Copy files
cp ~/Downloads/scholarflow-files/*.md .
cp ~/Downloads/scholarflow-files/.github/* .github/ -r
cp ~/Downloads/scholarflow-files/*.ts src/lib/
cp ~/Downloads/scholarflow-files/*.tsx src/components/research/

# 5. Initialize git
git init
git remote add origin https://github.com/YOUR_USERNAME/scholarflow.git

# 6. Open in VS Code
code .
```

**Done! 5 minutes ✅**

---

## 📂 Expected Directory Structure

```
scholarflow/
├── .github/
│   ├── FUNDING.yml
│   ├── ISSUE_TEMPLATE/
│   ├── pull_request_template.md
│   └── workflows/
├── src/
│   ├── lib/
│   │   ├── booleanParser.ts
│   │   └── semanticSearch.ts
│   └── components/research/
│       ├── SearchModeSelector.tsx
│       └── BooleanSearchHelp.tsx
├── README.md
├── LICENSE
├── CHANGELOG.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTORS.md
├── SECURITY.md
├── .gitignore
└── .env.example
```

---

## 🚀 VS Code Setup (30 seconds)

1. **Open folder in VS Code**
   ```bash
   code .
   ```

2. **Install recommended extensions**
   - GitLens
   - Prettier
   - ESLint

3. **Open integrated terminal**
   - Press `Ctrl+`` or Terminal → New Terminal

4. **Verify git**
   ```bash
   git status
   ```

✅ **Ready to code!**

---

## 💾 Push to GitHub

```bash
# Configure git (first time only)
git config --global user.email "your@email.com"
git config --global user.name "Your Name"

# Stage and commit
git add .
git commit -m "chore: initial project setup"

# Push
git push -u origin main
```

---

## ✅ Verification

Check these:

- [ ] All files visible in VS Code explorer
- [ ] `.github` folder visible
- [ ] `src` folder visible
- [ ] `git status` works in terminal
- [ ] `git remote -v` shows GitHub URL

---

## 📋 File Checklist

### Root Files (Should have)
- [ ] README.md
- [ ] LICENSE
- [ ] CHANGELOG.md
- [ ] CONTRIBUTING.md
- [ ] CODE_OF_CONDUCT.md
- [ ] CONTRIBUTORS.md
- [ ] SECURITY.md
- [ ] .gitignore
- [ ] .env.example

### GitHub Files (Should have)
- [ ] .github/FUNDING.yml
- [ ] .github/ISSUE_TEMPLATE/bug_report.md
- [ ] .github/ISSUE_TEMPLATE/feature_request.md
- [ ] .github/ISSUE_TEMPLATE/config.yml
- [ ] .github/pull_request_template.md
- [ ] .github/workflows/ci.yml
- [ ] .github/workflows/deploy.yml

### Source Files (Should have)
- [ ] src/lib/booleanParser.ts
- [ ] src/lib/semanticSearch.ts
- [ ] src/components/research/SearchModeSelector.tsx
- [ ] src/components/research/BooleanSearchHelp.tsx

---

## 🔐 Create .env.local

```bash
# In VS Code, create new file: .env.local
# Add your secrets:

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_secret_key_here
```

⚠️ **Never commit .env.local** (already in .gitignore)

---

## 📱 VS Code Commands

| Action | Command |
|--------|---------|
| Open folder | `code .` |
| New terminal | Ctrl+` |
| Save all | Ctrl+Shift+S |
| Git status | In terminal: `git status` |
| Commit | `git commit -m "msg"` |
| Push | `git push` |
| Source Control | Ctrl+Shift+G |

---

## 🎯 Next: Push to GitHub

After files are organized locally:

```bash
# 1. Initialize git
git init

# 2. Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/scholarflow.git

# 3. Stage files
git add .

# 4. Commit
git commit -m "chore: initial project setup"

# 5. Push
git push -u origin main
```

✅ **Files are now on GitHub!**

---

## 📖 Need More Details?

- **LOCAL_SETUP_VS_CODE.md** - Full setup guide
- **STEP_BY_STEP_GITHUB_SETUP.md** - Detailed GitHub setup
- **GITHUB_SETUP_CHECKLIST.md** - Tracking checklist

---

## 🎉 You're Done!

Your ScholarFlow repository is:
- ✅ Downloaded locally
- ✅ Organized correctly
- ✅ Ready in VS Code
- ✅ Connected to GitHub
- ✅ Ready to push

**Next: Read README.md and start developing! 🚀**
