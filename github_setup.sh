#!/bin/bash
# GitHub Setup Script for ScholarFlow
# This script automates the GitHub setup process
# Usage: bash github_setup.sh

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         ScholarFlow - GitHub Setup Guide                       ║"
echo "║                Complete 5-Step Process                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "\n${BLUE}════════════════════════════════════════════════════════════════${NC}\n"

# ============================================================================
# STEP 1: CREATE GITHUB REPOSITORY
# ============================================================================

echo -e "${GREEN}STEP 1: CREATE GITHUB REPOSITORY${NC}"
echo -e "${YELLOW}⚠️  This requires manual action on GitHub.com${NC}\n"

cat << 'EOF'
Follow these steps:

1. Go to https://github.com/new
2. Fill in the form:
   - Repository name: scholarflow
   - Description: Advanced research paper discovery with Boolean and Semantic search
   - Visibility: Public (recommended)
   - Initialize with: Nothing (don't add README/gitignore)
3. Click "Create repository"
4. You'll see the repository URL like:
   https://github.com/YOUR_USERNAME/scholarflow.git

Copy this URL for Step 2.
EOF

echo -e "\n${BLUE}════════════════════════════════════════════════════════════════${NC}\n"

# ============================================================================
# STEP 2: CLONE REPOSITORY
# ============================================================================

echo -e "${GREEN}STEP 2: CLONE REPOSITORY LOCALLY${NC}\n"

read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Paste the repository URL from GitHub: " REPO_URL

# Extract repo name from URL
REPO_NAME=$(basename "$REPO_URL" .git)

echo -e "\n${YELLOW}Cloning repository...${NC}"
git clone "$REPO_URL"
cd "$REPO_NAME"

echo -e "${GREEN}✓ Repository cloned successfully${NC}"
echo -e "Current directory: $(pwd)\n"

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}\n"

# ============================================================================
# STEP 3: COPY FILES FROM OUTPUTS
# ============================================================================

echo -e "${GREEN}STEP 3: COPY ALL FILES FROM OUTPUTS FOLDER${NC}\n"

# Get the path to outputs folder
read -p "Enter the path to outputs folder (or press Enter for ~/Downloads/scholarflow-outputs): " OUTPUTS_PATH
OUTPUTS_PATH="${OUTPUTS_PATH:-~/Downloads/scholarflow-outputs}"
OUTPUTS_PATH=$(eval echo "$OUTPUTS_PATH")

if [ ! -d "$OUTPUTS_PATH" ]; then
    echo -e "${RED}✗ Error: Outputs folder not found at $OUTPUTS_PATH${NC}"
    echo "Please download the outputs folder from Claude and try again."
    exit 1
fi

echo -e "${YELLOW}Copying files from: $OUTPUTS_PATH${NC}\n"

# Create .github directory structure
echo "Creating .github directory structure..."
mkdir -p .github/ISSUE_TEMPLATE
mkdir -p .github/workflows

# Copy root documentation files
echo "Copying root documentation..."
cp "$OUTPUTS_PATH"/*.md . 2>/dev/null || echo "Note: Some .md files may already exist"
cp "$OUTPUTS_PATH"/.gitignore . 2>/dev/null || true
cp "$OUTPUTS_PATH"/.env.example . 2>/dev/null || true

# Copy GitHub templates
echo "Copying GitHub templates..."
cp "$OUTPUTS_PATH"/.github/FUNDING.yml .github/ 2>/dev/null || true
cp "$OUTPUTS_PATH"/.github/ISSUE_TEMPLATE/* .github/ISSUE_TEMPLATE/ 2>/dev/null || true
cp "$OUTPUTS_PATH"/.github/pull_request_template.md .github/ 2>/dev/null || true
cp "$OUTPUTS_PATH"/.github/workflows/* .github/workflows/ 2>/dev/null || true

# Create src directory structure and copy components
echo "Copying React/TypeScript components..."
mkdir -p src/lib
mkdir -p src/components/research

cp "$OUTPUTS_PATH"/booleanParser.ts src/lib/ 2>/dev/null || true
cp "$OUTPUTS_PATH"/semanticSearch.ts src/lib/ 2>/dev/null || true
cp "$OUTPUTS_PATH"/SearchModeSelector.tsx src/components/research/ 2>/dev/null || true
cp "$OUTPUTS_PATH"/BooleanSearchHelp.tsx src/components/research/ 2>/dev/null || true

echo -e "${GREEN}✓ All files copied successfully${NC}\n"

# List copied files
echo "Files copied:"
ls -la | grep -E "^-.*\.md|LICENSE|env"
echo ""
ls -la .github/
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}\n"

# ============================================================================
# STEP 4: COMMIT AND PUSH TO GITHUB
# ============================================================================

echo -e "${GREEN}STEP 4: COMMIT AND PUSH TO GITHUB${NC}\n"

# Check git status
echo -e "${YELLOW}Current git status:${NC}"
git status
echo ""

# Configure git (if needed)
read -p "Configure git user (y/n)? " -n 1 -r CONFIGURE_GIT
echo ""
if [[ $CONFIGURE_GIT =~ ^[Yy]$ ]]; then
    read -p "Enter your git email: " GIT_EMAIL
    read -p "Enter your git name: " GIT_NAME
    git config --global user.email "$GIT_EMAIL"
    git config --global user.name "$GIT_NAME"
    echo -e "${GREEN}✓ Git configured${NC}\n"
fi

# Add all files
echo -e "${YELLOW}Adding all files...${NC}"
git add .
echo -e "${GREEN}✓ Files staged${NC}\n"

# Show what will be committed
echo -e "${YELLOW}Files to be committed:${NC}"
git diff --cached --name-only
echo ""

# Commit
echo -e "${YELLOW}Creating commit...${NC}"
git commit -m "chore: add github configuration, documentation, and components

- Add professional documentation (README, CHANGELOG, CONTRIBUTING, etc)
- Add GitHub issue and PR templates
- Add CI/CD workflows (lint, test, build, deploy)
- Add security policies and code of conduct
- Add React/TypeScript components for Boolean and Semantic search
- Add environment configuration template
- Setup branch protection and community guidelines"

echo -e "${GREEN}✓ Changes committed${NC}\n"

# Push to GitHub
echo -e "${YELLOW}Pushing to GitHub...${NC}"
git push origin main
echo -e "${GREEN}✓ Successfully pushed to GitHub!${NC}\n"

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}\n"

# ============================================================================
# STEP 5: CONFIGURE GITHUB SETTINGS
# ============================================================================

echo -e "${GREEN}STEP 5: CONFIGURE GITHUB SETTINGS${NC}"
echo -e "${YELLOW}⚠️  This requires manual action on GitHub${NC}\n"

cat << 'EOF'
Go to: https://github.com/YOUR_USERNAME/scholarflow/settings

Configure these settings:

═══════════════════════════════════════════════════════════════

1. GENERAL SETTINGS
   ✓ Go to Settings → General
   ✓ Set default branch to: main
   ✓ Tick: "Enable discussions"
   ✓ Tick: "Enable projects"
   ✓ Optional: Enable wiki

═══════════════════════════════════════════════════════════════

2. BRANCH PROTECTION (Protect main)
   ✓ Settings → Code and automation → Branches
   ✓ Add rule for "main" branch
   ✓ Tick: "Require pull request reviews before merging"
   ✓ Tick: "Require status checks to pass"
   ✓ Tick: "Require branches to be up to date"
   ✓ Tick: "Dismiss stale pull request approvals"

═══════════════════════════════════════════════════════════════

3. ADD SECRETS & VARIABLES
   ✓ Settings → Secrets and variables → Actions
   ✓ New repository secret:
     Name: VITE_SUPABASE_URL
     Value: https://your-project.supabase.co
   
   ✓ New repository secret:
     Name: VITE_SUPABASE_ANON_KEY
     Value: your_anon_key_here

═══════════════════════════════════════════════════════════════

4. CODE SECURITY
   ✓ Settings → Code security and analysis
   ✓ Tick: "Enable Dependabot alerts"
   ✓ Tick: "Enable Dependabot security updates"
   ✓ Tick: "Enable secret scanning"

═══════════════════════════════════════════════════════════════

5. CREATE ISSUE LABELS
   ✓ Go to Issues → Labels
   ✓ Create these labels:
     - bug (red)
     - enhancement (blue)
     - documentation (green)
     - good first issue (purple)
     - help wanted (orange)
     - question (yellow)
     - wontfix (gray)

═══════════════════════════════════════════════════════════════

6. ENABLE ACTIONS (if not already enabled)
   ✓ Go to Actions tab
   ✓ Click "I understand..." to enable workflows
   ✓ Check that ci.yml and deploy.yml show up

═══════════════════════════════════════════════════════════════
EOF

echo ""
read -p "Press Enter after you've completed GitHub configuration..."

echo -e "\n${BLUE}════════════════════════════════════════════════════════════════${NC}\n"

# ============================================================================
# VERIFICATION
# ============================================================================

echo -e "${GREEN}✓ SETUP COMPLETE!${NC}\n"

cat << 'EOF'
Your ScholarFlow repository is now set up on GitHub!

WHAT'S BEEN DONE:
✓ Repository created and cloned
✓ All files copied (documentation, templates, components)
✓ Files committed and pushed to GitHub
✓ Repository settings configured

NEXT STEPS:
1. Visit: https://github.com/YOUR_USERNAME/scholarflow
2. Check that your files are visible
3. Create your first release
4. Create GitHub project board for roadmap
5. Start accepting contributions!

USEFUL LINKS:
- GitHub Repository: https://github.com/YOUR_USERNAME/scholarflow
- GitHub Issues: https://github.com/YOUR_USERNAME/scholarflow/issues
- GitHub Discussions: https://github.com/YOUR_USERNAME/scholarflow/discussions
- GitHub Projects: https://github.com/YOUR_USERNAME/scholarflow/projects

DOCUMENTATION:
- README.md - Project overview
- CONTRIBUTING.md - How to contribute
- SECURITY.md - Security policy
- CHANGELOG.md - Version history

Need help?
- See GITHUB_SETUP_GUIDE.md for detailed instructions
- Check INDEX.md for file navigation
- Read FINAL_GITHUB_SUMMARY.txt for quick reference
EOF

echo -e "\n${GREEN}Happy coding! 🚀${NC}\n"
