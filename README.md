# IDEA Website — Frontend

React + Vite frontend extracted from the original full-stack project.

## Setup

1. Open PowerShell in this folder.
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Create the environment file:
   ```powershell
   Copy-Item .env.example .env
   ```
4. Confirm the backend URL in `.env` (default example points to localhost).
5. Start the frontend:
   ```powershell
   npm run dev
   ```

## Production build

```powershell
npm run build
```

Generated folders such as `node_modules` and `dist` are intentionally not included.
