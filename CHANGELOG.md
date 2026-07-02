# Changelog

All notable changes to the Lumenscope project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-06-27
### Added
- Gmail API Integration (OAuth2) via `googleapis` for secure contact form mail delivery.
- Strict input validation in the frontend contact form.
- Real-time character counter and 500-character cap on contact message inputs.
- Rate limiting and trust proxy setup on the Express backend server.
- ESLint and Prettier configs for the server workspace.
- GitHub pull request and issue template structures (Bug Report and Feature Request).
- Vercel client SPA routing config (`vercel.json`) to prevent 404 errors on route reloads.

### Fixed
- Fixed cross-frame `axe.run` type validation errors by running axe within the sandboxed iframe window context.
- Sanitized input HTML before auditing by stripping `<script>` tags and inline handlers to avoid `ReferenceError` warnings.
- Added `<base>` tag injection inside iframe dynamically to resolve target URL relative asset paths.
