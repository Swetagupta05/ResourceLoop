# ResourceLoop React Dashboard

A React + Vite dashboard converted from the supplied standalone HTML/CSS/JavaScript prototype. It uses React Router for page navigation. Demo data is local to the browser session and is not connected to a backend/database.

## Requirements
- Node.js LTS (includes npm)
- VS Code (recommended)

## Run on Windows
1. Extract this ZIP to a folder such as `C:\Users\hp\Downloads\ResourceLoop-react`.
2. Open that folder in VS Code: **File → Open Folder**.
3. Open **Terminal → New Terminal**. Confirm the terminal is in the folder containing `package.json`.
4. Run:
   ```powershell
   npm install
   npm run dev
   ```
5. Open the local URL Vite prints, usually `http://localhost:5173/`. The root path redirects to `/dashboard`.

## Routes
- `/dashboard`
- `/products`
- `/maintenance`
- `/repairs`
- `/resale`
- `/recycling`
- `/analytics`
- `/community`
- `/settings`

## Notes
- `src/App.jsx` contains the layout, pages, sample data, and interactions.
- `src/styles.css` contains the original dashboard styles and responsive layouts.
- `src/main.jsx` mounts React and wraps the app in `BrowserRouter`.
- Use `npm run build` to create a production build in `dist/`.
