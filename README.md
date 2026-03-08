# ScholarFlow 📚

Advanced research paper discovery platform with Boolean and Semantic search capabilities.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-purple.svg)](https://vitejs.dev/)

## ✨ Features

### 🔍 Advanced Search Modes
- **Simple Search** - Basic keyword search
- **Boolean Search** - AND, OR, NOT operators with full syntax support
- **Semantic Search** - AI-powered meaning-based discovery
- **Hybrid Search** - Combines boolean precision with semantic understanding

### 💾 Paper Management
- Save favorite papers locally
- Organize papers in collections
- Search history tracking
- Quick access to saved papers

### 🎨 User Experience
- Responsive design (mobile, tablet, desktop)
- Dark/light theme support
- Real-time search with loading states
- Beautiful UI with Tailwind CSS
- Accessible components (WCAG compliant)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/scholarflow.git
cd scholarflow

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🔧 Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📖 Documentation

- [Setup Guide](./docs/SETUP.md) - Installation & configuration
- [User Manual](./docs/USER_MANUAL.md) - Feature walkthrough
- [Boolean Search](./docs/BOOLEAN_SEARCH.md) - AND, OR, NOT operators
- [Semantic Search](./docs/SEMANTIC_SEARCH.md) - AI-powered discovery
- [API Documentation](./docs/API.md) - Backend integration
- [Contributing](./CONTRIBUTING.md) - How to contribute

## 🛠️ Tech Stack

- **React** 18.3.1 - UI Framework
- **TypeScript** 5.5.3 - Type Safety
- **Vite** 5.4.1 - Build Tool
- **Tailwind CSS** 3.4.11 - Styling
- **shadcn/ui** - Component Library
- **Supabase** - Backend/Database
- **React Query** - State Management
- **React Router** v6 - Routing

## 📁 Project Structure

```
src/
├── components/         # React components
├── contexts/          # Global state
├── hooks/             # Custom hooks
├── lib/               # Utilities & libraries
├── pages/             # Page components
├── types/             # TypeScript types
├── App.tsx            # Root component
└── main.tsx           # Entry point
```

## 🔐 Environment Variables

Create `.env.local`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

See `.env.example` for all available variables.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Make changes
4. Commit (`git commit -m 'Add amazing feature'`)
5. Push (`git push origin feature/amazing`)
6. Open Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Support

- 📖 [Documentation](./docs)
- 💬 [GitHub Issues](https://github.com/yourusername/scholarflow/issues)
- 📧 support@scholarflow.dev

---

Made with ❤️ by researchers, for researchers
