# Contributing to Lumenscope

First off, thank you for considering contributing to Lumenscope! It's people like you who make this project better for everyone.

## Code of Conduct

By participating in this project, you agree to maintain a respectful, welcoming, and professional environment for all contributors.

## How Can I Contribute?

### Reporting Bugs
If you find a bug, please open an issue using the Bug Report template. Include:
- A clear summary of the bug
- Steps to reproduce the behavior
- Expected vs. actual behavior
- Screenshots or console logs if applicable

### Suggesting Enhancements
If you have a feature request or enhancement idea, please open an issue using the Feature Request template.

### Pull Requests
1. Fork the repository and create your branch from `main`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure your code passes all lint and formatting checks:
   ```bash
   npm run lint -w client
   ```
4. Ensure all tests pass:
   ```bash
   npm test
   ```
5. Open a Pull Request referencing the related issue and filling out the PR template.

## Tech Stack
- **Frontend**: React (TypeScript), Vite, TailwindCSS, lucide-react, axe-core
- **Backend**: Express (ES Modules), googleapis (Gmail API OAuth2), cors, express-rate-limit
