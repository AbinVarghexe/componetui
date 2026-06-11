# Gamin UI Registry Platform

[![CI](https://github.com/AbinVarghexe/componetui/actions/workflows/ci.yml/badge.svg)](https://github.com/AbinVarghexe/componetui/actions/workflows/ci.yml)
[![GitHub stars](https://img.shields.io/github/stars/AbinVarghexe/componetui.svg?style=social)](https://github.com/AbinVarghexe/componetui/stargazers)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://vercel.com)

Source-first UI registry for creative developers. Gamin UI distributes components as editable React source code directly into local workspaces via CLI.


## What’s included

- Registry content under `registry/`
- API routes for listing, fetching, and searching components
- CLI entrypoint: `gamin-ui`
- Local preview page at `/preview`
- Metadata validation and smoke tests

## Quick start

Install dependencies:

```bash
pnpm install
```

Run the app:

```bash
pnpm run dev
```

Open:

- `http://localhost:3000/preview`
- `http://localhost:3000/api/components`
- `http://localhost:3000/api/search?q=hero`

## CLI

Search the registry:

```bash
node ./bin/gamin-ui.js search hero
```

Add a component to a project:

```bash
node ./bin/gamin-ui.js add button --dest ./my-project
```

Add a component and install its declared dependencies:

```bash
node ./bin/gamin-ui.js add hero-modern --dest ./my-project --install
```

Check for updates:

```bash
node ./bin/gamin-ui.js upgrade --check --dest ./my-project
```

Apply updates:

```bash
node ./bin/gamin-ui.js upgrade --dest ./my-project
```

## Registry format

Each component directory contains:

- `metadata.json` with id, name, version, frameworks, dependencies, and file list
- one or more source files such as `.tsx`

Example paths:

- `registry/button/metadata.json`
- `registry/button/button.tsx`

## Testing

Run the smoke test suite:

```bash
pnpm test
```

Run metadata validation only:

```bash
pnpm run validate:metadata
```

Run the combined release check:

```bash
pnpm run release:check
```

- Validate registry metadata.
- Run smoke tests.
- Verify `/preview` renders the registry components.
- Verify `/api/components` and `/api/search` return the expected results.
- Confirm `gamin-ui add`, `search`, and `upgrade` work against a clean temp project.

## Contributing

We welcome contributions from the community! Please read our [Contributing Guide](CONTRIBUTING.md) to learn about our branching model, local development workflows, code standards, and how to submit pull requests.

