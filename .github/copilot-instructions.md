# Email Assistant - GitHub Copilot Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Prerequisites and Environment Setup
- Use Node.js 20+ (tested with Node.js 20.19.5 and npm 10.8.2)
- The project uses npm as the package manager (package-lock.json present)
- Repository uses React 19 + Vite 6 + Tailwind CSS 4 + Shadcn/ui components

### Installation and Build Process
- **ALWAYS start with installation**: `npm install` -- takes ~14 seconds, NEVER CANCEL
- **Linting**: `npm run lint` -- takes ~1 second, produces 6 warnings (not errors) related to React refresh components
- **Development build**: `npm run build:dev` -- takes ~1.4 seconds using default vite.config.js
- **Production build**: `npm run build` -- takes ~1.4 seconds using vite.config.prod.js, NEVER CANCEL
- **CRITICAL**: All build commands complete in under 2 seconds. Set timeout to 300+ seconds for safety

### Development and Testing
- **Development server**: `npm run dev` -- starts on port 5174 with hot reload at http://localhost:5174/email-assistant/
- **Preview server**: `npm run preview` -- serves production build on port 5175
- **MANUAL VALIDATION REQUIREMENT**: After ANY changes, test the complete user workflow:
  1. Select a template from the left panel (22 templates available)
  2. Fill in variables in the Variables section (different types: text, number, email, date, etc.)
  3. Edit the generated Subject and Body in the editing section
  4. Test ALL copy buttons: "Copier Objet", "Copier Corps", "Copier Tout", "Copier le lien"
  5. Test language switching (FR/EN for both interface and templates)
  6. Test search and category filtering functionality

### Application Architecture
- **Main entry**: src/main.jsx renders src/App.jsx
- **Primary component**: src/App.jsx (~500+ lines) contains the complete application logic
- **UI components**: src/components/ui/ contains Shadcn/ui reusable components
- **Data source**: public/complete_email_templates.json contains 22 email templates with variables
- **Configuration**: Multiple Vite configs for dev/prod, ESLint config, Tailwind setup
- **Base path**: Application runs under /email-assistant/ path for GitHub Pages deployment

### Key Project Structure
```
email-assistant/
├── src/
│   ├── App.jsx                 # Main application (500+ lines)
│   ├── main.jsx               # Entry point
│   ├── components/ui/         # Shadcn/ui components
│   └── utils/storage.js       # Local storage utilities
├── public/
│   └── complete_email_templates.json  # Email templates data
├── .github/workflows/deploy.yml       # GitHub Pages deployment
├── package.json               # Dependencies and scripts
├── vite.config.js            # Default Vite config
├── vite.config.dev.js        # Development config
├── vite.config.prod.js       # Production config (used by npm run build)
└── eslint.config.js          # Linting configuration
```

### Deployment and CI/CD
- **GitHub Pages**: Automatic deployment via .github/workflows/deploy.yml using pnpm
- **Build command in CI**: `pnpm build` (uses production config)
- **Deploy target**: dist/ folder to GitHub Pages
- **Live URL**: https://snarky1980.github.io/email-assistant/

## Validation and Quality Assurance

### Pre-commit Validation Steps
1. **ALWAYS run linting**: `npm run lint` -- must complete with only warnings, no errors
2. **ALWAYS build successfully**: `npm run build` -- must complete without errors
3. **ALWAYS test application manually**: Load http://localhost:5174/email-assistant/ and verify:
   - Template selection works
   - Variable filling and validation works
   - Email editing works
   - Copy functionality works (all 4 copy buttons)
   - Language switching works (FR/EN)
   - Search and filtering work

### Application Features to Test
- **Email Templates**: 22 pre-configured templates in French and English
- **Variable System**: Supports different types (text, number, email, phone, date, time) with validation
- **Copy Functions**: 4 distinct copy buttons - Subject, Body, All, Deep Link
- **Bilingual Interface**: Complete FR/EN switching for both interface and template content
- **Search & Filter**: Real-time search and category filtering of templates
- **Responsive Design**: Works on desktop and mobile viewports

### Common Issues and Solutions
- **Port conflicts**: Dev server tries port 5174, falls back to next available port automatically
- **Build path**: Production builds use `/email-assistant/` base path for GitHub Pages
- **Linting warnings**: 6 React refresh warnings are expected and don't block builds
- **Dependencies**: All dependencies install cleanly with npm, no compatibility issues

## Time Expectations
- **npm install**: ~14 seconds
- **npm run lint**: ~1 second  
- **npm run build**: ~1.4 seconds
- **npm run dev startup**: ~1 second
- **NEVER CANCEL**: All commands complete quickly, but set generous timeouts (300+ seconds) for safety

## Critical Reminders
- **ALWAYS validate manually** after making changes by testing the complete user workflow
- **NEVER skip the validation steps** - the application must work end-to-end
- **Use the exact commands** listed above - they are all validated to work
- **Test all 4 copy buttons** and both language modes (FR/EN) after any changes
- **Screenshot the working application** when making UI changes for user verification