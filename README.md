<p align="center">
  <img src="assets/banner.svg" alt="Gamin UI - Source-First Component Registry Platform" width="100%" />
</p>

<p align="center">
  <strong>Source-First UI Registry and Developer CLI Distributing Animated React 19 & Tailwind CSS v4 Components</strong>
</p>

<p align="center">
  <a href="https://github.com/AbinVarghexe/componetui/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" /></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16.2-black.svg?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.2-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-CSS%20v4-38BDF8.svg?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" /></a>
  <a href="https://www.framer.com/motion/"><img src="https://img.shields.io/badge/Motion-Framer%20Motion%2012-FF0055.svg?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" /></a>
  <a href="https://github.com/sponsors/AbinVarghexe"><img src="https://img.shields.io/badge/Sponsor-GitHub%20Sponsors-EA4AAA.svg?style=for-the-badge&logo=github-sponsors&logoColor=white" alt="Sponsor" /></a>
</p>

---

## Overview

**Gamin UI** (`componetui`) is a source-first component registry and developer CLI for creative engineers. Instead of installing monolithic npm packages that lock you into rigid abstraction layers, Gamin UI distributes components as editable React source files directly into your local workspace.

```
       +---------------------------------------------+
       |   Gamin UI Cloud Registry (Next.js 16)      |
       |   - Metadata Validation (JSON Schema)       |
       |   - Dynamic Search & Component Feed API     |
       +----------------------+----------------------+
                              |
                              v
       +---------------------------------------------+
       |   Developer CLI: gamin-ui (bin/gamin-ui.js) |
       |   - gamin-ui search <query>                 |
       |   - gamin-ui add <component> --dest ./src   |
       |   - gamin-ui upgrade --check                |
       +----------------------+----------------------+
                              |
                              v
       +---------------------------------------------+
       |   Target Project Workspace Source Tree      |
       |   - components/ui/button.tsx                |
       |   - components/ui/hero-modern.tsx           |
       +---------------------------------------------+
```

---

## What’s Included

- **Registry Source Core**: Handcrafted modular components under `registry/`.
- **Search & Distribution REST API**: Next.js route handlers for querying and fetching component sources.
- **Interactive Component Playground**: Visual test harness at `/preview`.
- **Automated Verification**: Strict metadata JSON schema validation (`ajv`) and smoke test suites.
- **Standalone CLI**: Native Node.js CLI binary with dependency resolution.

---

## Quick Start

### 1. Installation & Local Development

```bash
# Clone the repository
git clone https://github.com/AbinVarghexe/componetui.git
cd componetui

# Install dependencies
pnpm install

# Start the registry server & preview workbench
pnpm dev
```

Visit:
- `http://localhost:3000/preview` - Interactive Component Catalog
- `http://localhost:3000/api/components` - Registry JSON Feed
- `http://localhost:3000/api/search?q=hero` - Live Component Search

---

## CLI Usage

### Search Components
```bash
node ./bin/gamin-ui.js search hero
```

### Install Component into Project
```bash
node ./bin/gamin-ui.js add button --dest ./my-project
```

### Install with Auto-Dependency Resolution
```bash
node ./bin/gamin-ui.js add hero-modern --dest ./my-project --install
```

### Check & Apply Upgrades
```bash
# Check if local components are outdated
node ./bin/gamin-ui.js upgrade --check --dest ./my-project

# Synchronize latest version
node ./bin/gamin-ui.js upgrade --dest ./my-project
```

---

## Testing & Quality Assurance

```bash
# Run metadata schema validation
pnpm run validate:metadata

# Run end-to-end registry smoke tests
pnpm test

# Full CI release verification check
pnpm run release:check
```

---

## Contributing & Sponsorship

We welcome contributions from the community! Please read our [Contributing Guide](CONTRIBUTING.md) to learn about our code standards and pull request workflows.

- **GitHub Sponsors**: [Sponsor @AbinVarghexe](https://github.com/sponsors/AbinVarghexe)
- Star this repository to support the project!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
