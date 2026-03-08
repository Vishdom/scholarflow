# Changelog

All notable changes to ScholarFlow will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Boolean search with AND, OR, NOT operators
- Semantic search using AI embeddings
- Hybrid search mode combining both approaches
- Search mode selector UI component
- Boolean search help modal with examples
- Semantic search synonyms dictionary
- Search validation and error handling

### Changed
- Updated search types for advanced filtering
- Improved component structure for better maintainability
- Enhanced error boundaries and error handling
- Optimized bundle size and performance

### Fixed
- Unused imports in AppContext
- Missing accessibility labels on buttons
- Search filter change debouncing

## [1.0.0] - 2026-03-07

### Added
- Initial release of ScholarFlow
- Basic keyword search functionality
- Paper saving and collections
- Search history tracking
- Dark/light theme support
- Responsive design
- Local paper management
- Real-time search results with pagination

### Features
- Search papers from OpenAlex database
- Save favorite papers locally
- Organize papers in collections
- Track search history
- Filter by year and subject
- Sort by relevance, citations, or date
- Beautiful responsive UI
- Accessible components

---

## Version History

### Pre-Release Development

**2026-02-20** - Project initialization
- Setup project structure
- Configure TypeScript and build tools
- Create base components
- Setup Supabase integration

**2026-02-15** - Core features
- Implement paper search
- Add paper saving functionality
- Create search history
- Build responsive UI

**2026-02-10** - Setup
- Initialize React project with Vite
- Configure Tailwind CSS
- Setup shadcn/ui components
- Create project documentation

---

## Migration Guides

### Upgrading to Advanced Search (v2.0)

#### Breaking Changes
- `SearchFilters` interface now requires `searchMode` field
- Search API endpoint expects new `embedding` field for semantic search

#### Migration Steps

1. **Update types**
   ```typescript
   // Old
   const filters: SearchFilters = {
     yearFrom: 2020,
     yearTo: 2024,
   };

   // New
   const filters: SearchFilters = {
     yearFrom: 2020,
     yearTo: 2024,
     searchMode: 'simple', // Add this
   };
   ```

2. **Update components**
   - Add `SearchModeSelector` to your search UI
   - Pass `searchMode` props through component tree

3. **Update backend**
   - Update Supabase function to handle new `searchMode` parameter
   - Add embedding support for semantic search

---

## Known Issues

### Current Release
- Semantic search requires OpenAI API credentials
- Large result sets may have performance impact
- Boolean search limited to 1000 character queries

### Roadmap Fixes
- [ ] Implement pagination optimization
- [ ] Add result caching
- [ ] Improve semantic search performance
- [ ] Add multi-language support

---

## Security Releases

### [1.0.1] - 2026-02-28
- Security: Fixed potential XSS vulnerability in paper display
- Security: Improved input validation

---

## Deprecations

### Version 1.x Features

These features will be deprecated in v2.0:
- Legacy search API (use new advanced search instead)
- Old collection format (will auto-migrate)

---

## Future Releases

### v1.1.0 (Q2 2026)
- [ ] Advanced filter UI
- [ ] CSV/BibTeX export
- [ ] Search analytics
- [ ] Collaborative collections

### v1.2.0 (Q3 2026)
- [ ] Paper recommendations
- [ ] Full-text search
- [ ] Citation network visualization
- [ ] Multi-language UI

### v2.0.0 (Q4 2026)
- [ ] User accounts and cloud sync
- [ ] Paper annotation tools
- [ ] Zotero/Mendeley integration
- [ ] Public API for developers

---

## Release Process

### Before Release
1. Update version in package.json
2. Update CHANGELOG.md
3. Tag release in git
4. Create release notes on GitHub

### After Release
1. Deploy to production
2. Post announcements
3. Monitor for issues
4. Plan next release

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

All releases are licensed under the MIT License.
See [LICENSE](./LICENSE) for details.
