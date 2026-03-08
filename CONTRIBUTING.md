# Contributing to ScholarFlow

First off, thank you for considering contributing to ScholarFlow! 🎉 It's people like you that make ScholarFlow such a great tool for researchers.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs if possible**
* **Include your environment (OS, browser, Node version)**

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and the expected behavior**
* **Explain why this enhancement would be useful**

### 🔧 Pull Requests

* Fill in the required template
* Follow the TypeScript and React styleguides
* Include appropriate test cases
* Update documentation as needed
* End all files with a newline
* Avoid platform-dependent code

---

## Development Setup

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher
- Git

### Local Development

1. **Fork the repo**
```bash
# Click "Fork" on GitHub
```

2. **Clone your fork**
```bash
git clone https://github.com/YOUR_USERNAME/scholarflow.git
cd scholarflow
```

3. **Add upstream remote**
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/scholarflow.git
```

4. **Install dependencies**
```bash
npm install
```

5. **Create feature branch**
```bash
git checkout -b feature/your-feature-name
```

6. **Start development server**
```bash
npm run dev
```

7. **Make your changes and test**
```bash
# Run linter
npm run lint

# Format code
npm run format

# Run tests
npm run test
```

8. **Commit with clear messages**
```bash
git commit -m "Add/Fix: Brief description of changes"
```

9. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

10. **Create Pull Request**
    - Go to GitHub and click "New Pull Request"
    - Fill out the PR template completely

---

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` type (use `unknown` if necessary)
- Enable strict mode in tsconfig.json
- Add JSDoc comments to exported functions

```typescript
/**
 * Searches for papers with the given query
 * @param query - Search query string (2-200 chars)
 * @param filters - Search filters
 * @returns Promise resolving to search results
 * @throws Error if query is invalid
 */
export async function searchPapers(
  query: string,
  filters: SearchFilters
): Promise<SearchResults> {
  // Implementation
}
```

### React Components

- Use functional components with hooks
- Use TypeScript for prop types
- Memoize when necessary with `React.memo`
- Use descriptive names for components

```typescript
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  disabled = false,
}) => (
  <button onClick={onClick} disabled={disabled}>
    {children}
  </button>
);
```

### Styling

- Use Tailwind CSS for styling
- Use `@apply` directive for complex patterns
- Keep inline styles minimal
- Use CSS classes consistently

```typescript
// Good ✅
<div className="flex gap-2 p-4 bg-white rounded-lg shadow-md">

// Avoid ❌
<div style={{ display: 'flex', gap: '8px' }}>
```

### File Organization

```
src/
├── components/
│   ├── ComponentName/
│   │   ├── ComponentName.tsx
│   │   ├── ComponentName.test.tsx
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── useHookName.ts
│   └── useHookName.test.ts
├── lib/
│   ├── utility.ts
│   └── utility.test.ts
└── types/
    └── index.ts
```

---

## Commit Messages

Use clear, descriptive commit messages. Format:

```
Type: Brief description (50 chars max)

Longer explanation if needed. Explain what and why, not how.
Keep lines under 72 characters.

Fixes #123
Closes #456
```

### Types
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc)
- `refactor:` Code refactoring without feature change
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Build, dependencies, tooling

### Examples
```bash
git commit -m "feat: Add boolean search operators (AND, OR, NOT)"
git commit -m "fix: Correct cosine similarity calculation"
git commit -m "docs: Add semantic search guide"
git commit -m "refactor: Extract search logic to custom hook"
```

---

## Testing

All new features should include tests. We use **Vitest** for testing.

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Writing Tests

```typescript
// Example test file: src/lib/booleanParser.test.ts
import { describe, it, expect } from 'vitest';
import { validateBooleanQuery, parseBooleanQuery } from './booleanParser';

describe('booleanParser', () => {
  describe('validateBooleanQuery', () => {
    it('should accept valid queries', () => {
      const result = validateBooleanQuery('"machine learning" AND healthcare');
      expect(result.valid).toBe(true);
    });

    it('should reject unbalanced parentheses', () => {
      const result = validateBooleanQuery('(AI OR ML');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unbalanced');
    });
  });

  describe('parseBooleanQuery', () => {
    it('should parse terms and operators', () => {
      const result = parseBooleanQuery('"AI" AND healthcare');
      expect(result.terms).toEqual(['AI', 'healthcare']);
      expect(result.operators).toEqual(['AND']);
    });
  });
});
```

---

## Documentation

When adding features, please update documentation:

1. **Code Comments**: Explain complex logic
2. **JSDoc**: Document public APIs
3. **Markdown Docs**: Update relevant guide
4. **Examples**: Include usage examples

### Documentation Structure
```
docs/
├── INSTALLATION.md
├── CONFIGURATION.md
├── QUICK_START.md
├── BOOLEAN_SEARCH.md
├── SEMANTIC_SEARCH.md
├── HYBRID_SEARCH.md
├── ARCHITECTURE.md
├── API_REFERENCE.md
├── DEPLOY_VERCEL.md
├── DEPLOY_NETLIFY.md
├── BACKEND_SETUP.md
├── CODE_QUALITY.md
└── ROADMAP.md
```

---

## Pull Request Process

1. **Update documentation** if needed
2. **Add/update tests** for new features
3. **Run tests locally**: `npm run test`
4. **Lint code**: `npm run lint`
5. **Format code**: `npm run format`
6. **Push to your fork**
7. **Create PR** with detailed description
8. **Respond to review feedback** promptly
9. **Maintain conversation** with reviewers

### PR Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update

## Related Issues
Fixes #123

## How Has This Been Tested?
Describe testing you've done.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally
```

---

## Code Review

All submissions require review. We use GitHub pull requests for this purpose. Reviewers will:

- Check code quality and style
- Verify functionality with tests
- Review documentation
- Suggest improvements
- Approve or request changes

### Common Review Comments

- ❓ "Could you explain this logic?"
- 💡 "Have you considered using X instead?"
- 🎯 "This would be clearer as..."
- ⚠️ "This might break when..."
- ✨ "Great implementation!"

Treat review feedback as learning opportunities, not criticism!

---

## Recognition

Contributors are recognized in:
- `CONTRIBUTORS.md` file
- GitHub contributors page
- Release notes
- Project README (for significant contributions)

---

## Questions?

- **Documentation**: Check [docs/](../docs/)
- **Discussions**: [GitHub Discussions](https://github.com/yourname/scholarflow/discussions)
- **Issues**: [GitHub Issues](https://github.com/yourname/scholarflow/issues)

---

## Additional Notes

### Issue and Pull Request Labels

Labels help organize and track issues/PRs:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested
- `wontfix` - This will not be worked on

---

## Recognition Policy

We recognize all contributions, big or small! Contributors may be recognized through:

1. **GitHub Contributors page** - Automatically updated
2. **CONTRIBUTORS.md file** - Manual updates for major contributors
3. **Release notes** - Mentioned in version releases
4. **README shout-outs** - For significant contributions
5. **Twitter mentions** - For community contributions

Thank you for contributing to ScholarFlow! 🚀
