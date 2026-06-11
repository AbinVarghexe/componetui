# Contributing to Gamin UI

Thank you for your interest in contributing to Gamin UI! We are excited to build an open-source, source-first UI registry for React and Next.js, and we welcome contributions of all kinds.

This document outlines the workflow, coding standards, and branch policies we use to keep production stable while moving fast.

---

## Branching Model & PR Workflows

To ensure production stability, we follow a strict branching strategy:

### 1. Production Branch (`production`)
- **Current Production Branch**: Represents the current live production code to get deployed.
- **Direct Commits Blocked**: Direct pushes are strictly prohibited.
- **Rules**: Require a pull request with at least 1 approved review and all CI status checks passing.
- **Deployment Flow**: Merges into `production` are only performed via a release Pull Request from the `main` branch once changes have been fully tested and integrated.

### 2. Main Development & Integration Branch (`main`)
- **Default Branch**: This is the branch for merging everything. All development, feature branch integration, and testing happen here first.
- **Direct Commits Blocked**: Direct pushes are prohibited. All contributions must come via Pull Requests.
- **Rules**: Require a pull request with all CI status checks passing and review approval.
- **Target Branch**: All contributors must submit their pull requests targeting the `main` branch.

### 3. Feature, Bugfix & Sub-branches
- **Creation**: Always branch off the latest `main` branch.
- **Naming Conventions**: Use descriptive prefixes:
  - `feature/your-feature-name` (e.g., `feature/demo-button-update`)
  - `bugfix/issue-description` (e.g., `bugfix/cli-install-path`)
  - `docs/what-changed` (e.g., `docs/typo-fix`)
- **Target Branch**: Submit pull requests targeting the `main` branch.

---

## Local Development Setup

We use **Node.js (v20+)** and **pnpm (v9)** for package management.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AbinVarghexe/componetui.git
   cd componetui
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start the local development server**:
   ```bash
   pnpm run dev
   ```
   Open [http://localhost:3000/preview](http://localhost:3000/preview) to view the registry components in action.

---

## Verification & Testing

Before submitting a Pull Request, you must verify your changes locally:

1. **Validate Registry Metadata**:
   Ensures all `metadata.json` files conform to the registry schema.
   ```bash
   pnpm run validate:metadata
   ```

2. **Run Smoke Tests**:
   Runs the test suite to ensure the CLI and API routes function properly.
   ```bash
   pnpm test
   ```

3. **Build the Application**:
   Verifies Next.js and Tailwind compilation completes successfully.
   ```bash
   pnpm run build
   ```

---

## Code & Design Standards

To maintain visual harmony:
- **Design Tokens**: Do not use hardcoded hex values or raw Tailwind color classes. Always use our standard HSL CSS variables (defined in `app/globals.css`).
- **TypeScript**: All components must be written in TypeScript (`.tsx` or `.ts`) and have clean, descriptive type definitions.
- **Dependencies**: Declare any third-party dependencies in the component's `metadata.json` so the CLI can install them for the user.

---

## Adding Components to the Registry

To contribute a new UI component:

1. **Create the component directory**:
   Create a folder under `registry/` (e.g., `registry/my-component/`).

2. **Add Source Files**:
   Implement your component files in TypeScript (e.g., `registry/my-component/my-component.tsx`).

3. **Create `metadata.json`**:
   Add a metadata manifest in your folder. For example:
   ```json
   {
     "id": "my-component",
     "name": "My Component",
     "version": "1.0.0",
     "frameworks": ["react", "next"],
     "dependencies": ["framer-motion"],
     "files": [
       {
         "name": "my-component.tsx",
         "target": "components/ui/my-component.tsx"
       }
     ]
   }
   ```

4. **Verify Locally**:
   - Confirm it compiles.
   - Verify it displays and functions on the local `/preview` dashboard.
   - Run `pnpm run validate:metadata` to ensure your manifest is correct.
