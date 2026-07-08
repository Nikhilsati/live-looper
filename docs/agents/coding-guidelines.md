# Coding Guidelines

This document outlines the coding guidelines and standards for this repository. All contributors and agent skills must refer to and follow these guidelines when creating or modifying code.

## General Guidelines

- **Types and Interfaces**: Use TypeScript strictly. Avoid using `any` and define robust, clean types/interfaces.
- **Maintain Comments**: Maintain documentation integrity. Keep comments and docstrings up to date. Do not delete existing comments unless they are outdated or specifically requested to be changed.
- **File Structure**: Group related code cleanly in the workspace components.
- **Follow Existing Patterns**: Ensure any new implementation aligns with the architectural design defined in `DESIGN.md` and `DECISIONS.md`.

## Performance

### Lazy Loading and App Optimization

- **Required Check**: Whenever creating a new Component or Feature, ask yourself: *"Is this feature/component required all the time?"*
- **Lazy Load**: If the feature/component is not required all the time (e.g., dynamic modals, tab panels, optional tools, specific track settings, or heavy UI extensions), optimize the application loading times by splitting the code and making it lazy-loaded.
- **Route and Component splitting**: Use dynamic imports (e.g., React `React.lazy()` or equivalent framework-specific dynamic imports) to keep bundle sizes lean.
