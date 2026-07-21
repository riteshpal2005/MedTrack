# Contributing to MedTrack

First off, thank you for taking the time to contribute! Contributions from the community help make this project better for everyone. Please take a moment to review these guidelines before submitting code or opening issues.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Git Branching Strategy](#git-branching-strategy)
- [Commit Message Conventions](#commit-message-conventions)
- [Coding & Formatting Standards](#coding--formatting-standards)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Pull Request Checklist](#pull-request-checklist)

## Code of Conduct
We are committed to providing a welcoming, safe, and inclusive environment. Please treat all contributors with respect, deliver constructive feedback, and keep discussions professional and collaborative.

## Getting Started

### Prerequisites
Ensure you have the following installed locally before setting up the repository:
- Node.js (v18.x or higher)
- npm or yarn
- JDK 17+ (for Android development)
- Android Studio & Android SDK (with an active emulator or device)
- PostgreSQL (v16+ for local database development)

### Environment Setup
1. **Fork the Repository** on GitHub.
2. **Clone your fork locally**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/MedTrack.git
   cd MedTrack
   ```
3. **Install Dependencies**:
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies (if working in monorepo/backend)
   cd backend && npm install
   ```
4. **Configure Environment Variables**:
   Copy the `.env.example` file to `.env` and fill in your local PostgreSQL credentials and API configurations.
5. **Start the Development Server**:
   ```bash
   npm start
   ```

## Development Workflow
1. Always pull the latest changes from `main` before starting a new task:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Create a new branch off `main` following our [Branching Strategy](#git-branching-strategy).
3. Implement your changes, ensuring code matches our style guidelines and passes local linting and tests.
4. Push your branch to your fork and submit a Pull Request.

## Git Branching Strategy
We use a feature-branch workflow. All work should happen in dedicated branches created off `main`.

### Branch Naming Format
`<type>/<short-description>`

### Allowed Types
- `feat/`: New features or capabilities (e.g., `feat/offline-dosage-sync`)
- `fix/`: Bug fixes (e.g., `fix/auth-token-refresh`)
- `refactor/`: Code restructuring without functional changes (e.g., `refactor/axios-client`)
- `docs/`: Documentation updates (e.g., `docs/update-setup-guide`)
- `test/`: Adding or updating test suites (e.g., `test/sync-service`)
- `chore/`: Build configuration, dependencies, or tool updates (e.g., `chore/upgrade-react-native`)

## Commit Message Conventions
We enforce Conventional Commits. This allows us to automate changelogs and maintain a readable Git history.

### Commit Format
```text
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

### Supported Types
- **feat**: A new feature for the user
- **fix**: A bug fix
- **docs**: Documentation-only changes
- **style**: Formatting, missing semi-colons, whitespace changes (no code behavior change)
- **refactor**: Refactoring production code without changing behavior
- **perf**: Code changes that improve performance
- **test**: Adding missing tests or refactoring existing tests
- **chore**: Maintenance tasks, build system, or dependency updates

### Examples
- `feat(sync): add queue retry logic for offline requests`
- `fix(auth): prevent app crash when JWT token expires`
- `docs(readme): add troubleshooting section for Android SDK`
- `chore(deps): bump axios from 1.6.0 to 1.7.0`

## Coding & Formatting Standards
To ensure consistency across the codebase, please adhere to these rules:

### TypeScript & React Native
- **Strict Mode**: Do not use `any`. Define explicit interfaces or types for all props, states, and API responses.
- **Component Structure**: Use functional components with hooks. Keep logic modular by extracting custom hooks into `src/hooks/`.
- **Styling**: Strictly Use NativeWind for Styling. Avoid inline style objects inside renders.
- **Async Code**: Use `async`/`await` instead of raw `Promise .then()` chains.
- **Error Handling**: Always handle errors gracefully, especially network calls and async storage writes.

### Formatting
Run the linter and code formatter before staging files:
```bash
# Check linting errors
npm run lint

# Automatically fix code formatting
npm run format
```

## Submitting a Pull Request
- **Keep PRs Atomic**: Focus each PR on a single issue or feature. Large PRs will take longer to review and may be rejected.
- **Run Local Tests**: Ensure all tests pass before opening the PR:
  ```bash
  npm test
  ```
- **Write a Clear Title**: Use the Conventional Commit syntax for your PR title (e.g., `feat(api): configure global axios instance`).
- **Complete the PR Template**: Fill out all sections of the PR checklist below in your pull request description.

## Pull Request Checklist
When opening a Pull Request, please copy and fill out the following template into your PR description:

```markdown
## Description
<!-- Provide a brief summary of the changes made and the issue it resolves. -->

## Type of Change
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to change)
- [ ] 🧹 Refactor / Code Cleanup
- [ ] 📚 Documentation update

## Testing Plan
<!-- Describe the tests you ran to verify your changes. Include steps to reproduce or screenshots if relevant. -->
- [ ] Executed local unit/integration tests (`npm test`)
- [ ] Verified manually on Android Emulator / Physical Device
- [ ] Verified manually on iOS Simulator (if applicable)

## Checklist
- [ ] My code follows the project's coding and formatting guidelines.
- [ ] I have performed a self-review of my own code.
- [ ] I have commented my code, particularly in hard-to-understand areas.
- [ ] I have updated relevant documentation / Markdown files.
- [ ] My changes generate no new warnings or console errors.
- [ ] I have added tests that prove my fix is effective or that my feature works.
```
