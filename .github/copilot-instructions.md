# Email Assistant - Bureau de la traduction

Modern React web application for email template generation for the Canadian Government Translation Bureau clients. The application provides 22 pre-configured email templates with intelligent variables, bilingual support (FR/EN), and advanced editing capabilities.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the information here.

## Working Effectively

### Bootstrap and Build the Repository
- Install dependencies: `npm install --legacy-peer-deps` (required due to date-fns version conflict with react-day-picker)
  - **Timing**: ~1 second for subsequent installs, ~10 seconds for fresh install
  - **NEVER CANCEL**: Always completes quickly, but use `timeout: 30` if needed
- Build production version: `npm run build` 
  - **Timing**: ~3 seconds. NEVER CANCEL. Set timeout to 60+ seconds for safety
  - Uses vite.config.prod.js configuration
  - Outputs to `dist/` directory with versioned assets
- Run development server: `npm run dev`
  - **Timing**: Starts in ~0.5 seconds on port 5174
  - **URL**: http://localhost:5174/email-assistant/
  - Hot reload enabled, supports all modern React features
- Run production preview: `npm run preview`
  - **Timing**: Starts immediately on port 5175
  - **URL**: http://localhost:5175/email-assistant/
  - Tests the actual production build

### Code Quality and Linting
- Run linting: `npm run lint`
  - **Timing**: ~1 second. NEVER CANCEL. Set timeout to 30+ seconds
  - **Expected**: Currently has 10 issues (1 error, 9 warnings) - these are acceptable
  - **Critical**: The unused `searchRef` variable in App.jsx is known and acceptable
- Auto-fix linting: `npm run lint:fix`
  - **Timing**: ~1 second. Fixes most formatting issues automatically

### Environment Requirements
- **Node.js**: v20.19.5+ (tested and working)
- **npm**: v10.8.2+ (tested and working) 
- **Package Manager**: Use npm with `--legacy-peer-deps` flag (pnpm not required despite pnpm-lock.yaml presence)
- **Browser**: Modern browsers supporting ES2020+ features

## Manual Validation Scenarios

**ALWAYS run these complete end-to-end scenarios after making changes:**

### Scenario 1: Complete Email Generation Workflow
1. Start development server: `npm run dev`
2. Navigate to http://localhost:5174/email-assistant/
3. **Verify**: Page loads with "Assistant pour rédaction de courriels aux clients" title
4. **Verify**: Left panel shows "22 modèles disponibles"
5. Click "Devis avec approbation requise" template
6. **Verify**: Variables panel appears with 5 input fields
7. **Verify**: Email editing panel shows pre-filled subject and body
8. Change project number from "123-456456-789" to "999-888777-001"
9. **Verify**: Subject and body text update automatically with new project number
10. Click "Copier Tout" button
11. **Verify**: Button changes to "✅ Email copié !" confirming copy success
12. **Result**: Complete email generation workflow functions correctly

### Scenario 2: Bilingual Language Switching
1. With template loaded, click "EN" button in "Langue du modèle" section
2. **Verify**: Template title changes to English (e.g., "Quote with approval required")
3. **Verify**: Email subject and body content switches to English
4. **Verify**: All template descriptions in left panel switch to English
5. Switch back to "FR" and verify French content returns
6. **Result**: Bilingual functionality works seamlessly

### Scenario 3: Search and Filter Functionality
1. Type "transcription" in the search box
2. **Verify**: Template list filters to show only 1 result: "Quote for transcription"
3. **Verify**: Counter shows "1 modèles disponibles" 
4. Clear search and verify all 22 templates return
5. **Result**: Search filtering works correctly

## Build and Deployment

### GitHub Actions Integration
- **CI/CD**: Automated deployment via `.github/workflows/deploy.yml`
- **Trigger**: Pushes to `main` branch automatically deploy to GitHub Pages
- **Build Command**: `pnpm build` (CI uses pnpm v10.4.1)
- **Output**: Deployed to https://snarky1980.github.io/email-assistant/
- **NEVER CANCEL**: GitHub Actions build may take 2-5 minutes. Always let it complete.

### Build Configurations
- **Development**: `vite.config.js` (port 5174, includes HMR)
- **Production**: `vite.config.prod.js` (optimized assets, versioned filenames)
- **Base URL**: `/email-assistant/` for GitHub Pages deployment

## Key Project Structure

### Critical Files and Directories
```
email-assistant/
├── src/
│   ├── App.jsx                     # Main component (648 lines) - core application logic
│   ├── main.jsx                    # React entry point
│   ├── components/
│   │   ├── ui/                     # Shadcn/ui components (30+ reusable components)
│   │   ├── EmailAssistant.jsx      # Alternative component (not used in main)
│   │   └── TemplateSelector.jsx    # Template selection logic
│   ├── utils/
│   │   └── storage.js              # localStorage utilities for state persistence
│   └── assets/
│       └── react.svg               # React logo
├── public/
│   ├── complete_email_templates.json  # EMAIL TEMPLATES DATABASE (43KB, 22 templates)
│   └── favicon.ico                 # Application icon
├── vite.config.js                  # Development configuration
├── vite.config.prod.js             # Production build configuration
├── package.json                    # Dependencies and scripts
└── .github/workflows/deploy.yml    # Automated deployment
```

### Email Templates Database
- **Location**: `public/complete_email_templates.json`
- **Size**: 43KB with 22 complete templates
- **Structure**: Contains `templates` array and `variables` definitions
- **Languages**: Full French and English translations for all templates
- **Categories**: Devis et estimations, Gestion de projets, Problèmes techniques, Services spécialisés, Communications générales

## Development Guidelines

### Making Changes to Templates
- Edit `public/complete_email_templates.json` to modify templates
- **Structure**: Each template has `id`, `title_fr`, `title_en`, `description_fr`, `description_en`, `category`, `subject_fr`, `subject_en`, `body_fr`, `body_en`, and `variables` array
- **Variables**: Support types: `text`, `email`, `phone`, `date`, `time`, `number`
- **Testing**: Always test both FR and EN versions after template changes

### Code Architecture
- **Main Logic**: `src/App.jsx` contains the entire application state and logic
- **Styling**: Tailwind CSS with Shadcn/ui component library
- **State Management**: React hooks with localStorage persistence via `utils/storage.js`
- **Variables**: Color-coded by type (blue=email, green=phone, purple=date, orange=time, amber=number, gray=text)

### Common Development Tasks
- **Add new template**: Edit `complete_email_templates.json`, test in both languages
- **Modify UI components**: Edit files in `src/components/ui/` (Shadcn/ui based)
- **Change styling**: Modify Tailwind classes in component files
- **Update dependencies**: Use `npm install --legacy-peer-deps` for compatibility

## Troubleshooting

### Known Issues and Solutions
- **Dependency conflicts**: Always use `npm install --legacy-peer-deps` due to date-fns version mismatch
- **ESLint warnings**: 9 warnings about fast-refresh exports are expected and safe to ignore
- **Unused variable**: `searchRef` in App.jsx is acceptable (planned feature)
- **Port conflicts**: Dev server auto-switches from 5174 to next available port if busy

### Build Failures
- **"Failed to resolve" errors**: Run `rm -rf dist/* assets/index*.* && npm run build` to clean old build files
- **ESM import issues**: Ensure vite.config files use `fileURLToPath` instead of `__dirname`
- **Path resolution**: Verify `@` alias points to `./src` in vite configs

## Performance and Timing Expectations

### Command Execution Times (Measured)
- `npm install --legacy-peer-deps`: 1-10 seconds
- `npm run build`: 2.5-3 seconds
- `npm run dev`: 0.5 seconds startup
- `npm run lint`: 1 second
- **CRITICAL**: All builds complete quickly. NEVER CANCEL commands prematurely.

### Application Performance
- **Initial load**: <1 second with 22 templates
- **Template switching**: Instant (React state updates)
- **Variable updates**: Real-time text replacement
- **Search filtering**: Instant response for all 22 templates

Always validate your changes using the complete manual scenarios above before considering your work complete.