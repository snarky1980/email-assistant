# Email Assistant - Bureau de la traduction

Email Assistant is a modern React web application for email template management for the Canadian government's Translation Bureau. It provides a bilingual (French/English) interface for managing 22 pre-configured email templates with intelligent variables and specialized input types.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

- Bootstrap, build, and test the repository:
  - `npm install -g pnpm` -- Install pnpm package manager globally (required)
  - `pnpm install --no-frozen-lockfile` -- Install dependencies (takes ~18 seconds). Use --no-frozen-lockfile due to lockfile mismatch.
  - `pnpm build` -- Build for production (takes ~2 seconds). Uses vite.config.prod.js configuration.
  - `pnpm lint` -- Run ESLint checks (takes ~2 seconds). Expect 6 warnings about fast refresh in UI components.
  - `pnpm lint:fix` -- Fix auto-fixable linting issues (takes ~2 seconds)

- Run the application:
  - Development server: `pnpm dev` -- Starts on port 5174 or next available port
  - Production preview: `pnpm preview` -- Starts on port 5175, serves built files from dist/

- GitHub Pages deployment:
  - Automatic deployment via `.github/workflows/deploy.yml` on push to main branch
  - Uses pnpm in CI environment
  - Builds with production config and deploys to GitHub Pages

## Known Issues and Limitations

- **Development Mode Bug**: The development server (`pnpm dev`) loads correctly and displays all templates, but clicking on templates may trigger infinite render loops causing application crashes. This is a known issue in the current codebase.
- **Production Mode**: Works correctly in production preview (`pnpm preview`) - templates load and display properly.
- **Lockfile Mismatch**: Always use `pnpm install --no-frozen-lockfile` instead of `--frozen-lockfile` due to package.json/lockfile inconsistencies.
- **No Tests**: The project has no test suite configured. There's an App-test.jsx file but no test runner setup.

## Validation Scenarios

After making changes, always validate using these scenarios:

1. **Build Validation**: 
   - Run `pnpm build` and ensure it completes without errors
   - Check that dist/ folder is generated with proper assets

2. **Production Preview Testing**:
   - Run `pnpm preview` 
   - Navigate to http://localhost:5175/email-assistant/
   - Verify all 22 templates are visible in the left panel
   - Verify bilingual interface (FR/EN buttons work)
   - Verify search functionality works
   - Verify category filtering works

3. **Development Server Testing** (with caveats):
   - Run `pnpm dev`
   - Navigate to http://localhost:5174/email-assistant/
   - Verify templates load correctly
   - **DO NOT** click on templates - this triggers crashes
   - Test only the loading and display of template list

4. **Code Quality Validation**:
   - Run `pnpm lint` and ensure no new errors (6 warnings are expected)
   - Run `pnpm lint:fix` before committing

## Technology Stack and Architecture

- **Frontend**: React 19 with modern hooks
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.7 with custom classes
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Package Manager**: pnpm 10.4.1+ (required)
- **Deployment**: GitHub Pages via GitHub Actions

## Project Structure

```
email-assistant/
├── src/
│   ├── App.jsx                 # Main component (648 lines) - contains all app logic
│   ├── App.css                 # Custom Tailwind styles and CSS variables
│   ├── main.jsx                # React app entry point
│   ├── components/ui/          # Shadcn/ui components (40+ components)
│   ├── assets/                 # Email templates JSON data
│   ├── utils/                  # Utility functions
│   └── lib/                    # Library utilities
├── public/
│   └── complete_email_templates.json  # 22 email templates with French/English content
├── dist/                       # Built assets (generated)
├── .github/workflows/deploy.yml # Auto-deployment to GitHub Pages
├── vite.config.js             # Development configuration
├── vite.config.prod.js        # Production build configuration  
├── eslint.config.js           # ESLint configuration
├── tailwind.config.js         # Tailwind CSS configuration (if present)
└── package.json               # Dependencies and scripts
```

## Key Files and Their Purpose

- **src/App.jsx**: Main application component containing all business logic, template rendering, variable handling, and UI state management (648 lines)
- **complete_email_templates.json**: Database of 22 email templates with bilingual content, variables, and metadata
- **vite.config.prod.js**: Production build configuration with asset versioning and GitHub Pages base path
- **.github/workflows/deploy.yml**: Automated deployment pipeline using pnpm and GitHub Pages

## Common Development Tasks

- **Adding new templates**: Edit `public/complete_email_templates.json` and add template object with French/English content
- **Modifying UI components**: Edit files in `src/components/ui/` - these are shadcn/ui components
- **Changing styles**: Modify `src/App.css` for custom CSS or use Tailwind classes
- **Updating build configuration**: Edit `vite.config.prod.js` for production or `vite.config.js` for development

## Important Notes

- **NEVER CANCEL** long-running commands. All commands complete within 20 seconds.
- The application uses a custom index.html setup - ensure script src points to `/src/main.jsx` for development
- GitHub Pages deployment uses base path `/email-assistant/` - configured in vite configs
- Application supports deep linking with URL parameters for template selection
- All 22 templates are pre-loaded and stored in JSON format with specialized variable types (email, phone, date, time, number, text)

## File Output from Common Commands

### Repository Root Contents
```
.github/          .gitignore        README.md         eslint.config.js  package.json      src/              vite.config.dev.js
CHANGELOG.md      analyze_js.py     assets/           favicon.ico       pnpm-lock.yaml    todo.md           vite.config.js
.DS_Store         components.json   complete_email_templates.json  index.html  public/  vite.config.prod.js
dist/             jsconfig.json     package-lock.json 
```

### src/ Directory Contents  
```
App-simple.jsx  App.css         components/     index.css       main.jsx        utils/
App-test.jsx    App.jsx         hooks/          lib/            
```

### package.json Scripts
```json
{
  "dev": "vite",
  "build": "vite build --config vite.config.prod.js", 
  "build:dev": "vite build",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "preview": "vite preview",
  "preview:prod": "vite preview --config vite.config.prod.js"
}
```