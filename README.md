# SecureVault Dashboard

## 📖 Overview

A secure file vault dashboard built with **React + Tailwind CSS + Vite**, featuring a file explorer with keyboard navigation, starred/recent files, search, file preview, and activity logging.

---

## 🌐 Live Demo


👉 https://secure-vault1.netlify.app/

---

## 🛠️ Tech Stack

* **React 18** — UI framework
* **Tailwind CSS** — Styling (with custom CSS variable design tokens)
* **Vite** — Build tool & dev server
* **Lucide React** — Icons
* **Sonner** — Toast notifications
* **React Router DOM** — Routing
* **TanStack Query** — Data & auth state management


---

## 🚀 Running Locally

### Prerequisites

* Node.js 18+
* npm or yarn

### Steps

#### 1. Clone the repository

```bash id="1a2b3c"
git clone https://github.com/mahoro-belyse/SecureVault.git
cd securevault-dashboard
```

#### 2. Install dependencies

```bash id="4d5e6f"
npm install
```

#### 3. Start the development server

```bash id="7g8h9i"
npm run dev
```

Open in your browser:
👉 http://localhost:5173

---

## 📦 Build for Production

```bash id="j1k2l3"
npm run build
npm run preview
```

---

## 🧩 Project Structure

```id="m4n5o6"
src/
├── pages/
│   └── Dashboard.jsx          # Main page
├── components/
│   ├── vault/                 # Sidebar, TopNav, Properties, Preview, etc.
│   └── FileExplorer/          # File tree explorer
├── hooks/
│   ├── useVaultStore.js       # Global state (localStorage)
│   └── useKeyboardNav.js      # Arrow key navigation
├── data/
│   └── vault.js               # Mock vault file tree data
├── index.css                  # Design tokens (CSS variables)

```

---

## ✨ Key Features

* **Keyboard navigation** — Arrow keys, Enter, Escape, `Ctrl + K` to search
* **File tree** — Expandable folders with sorting and expand/collapse all
* **Search** — Live search with auto-expand and highlighted matches
* **Starred & Recent** — Persisted via `localStorage`
* **File Preview** — Mock previews for PDF, XLSX, images, and code files
* **Context menu** — Right-click any file or folder
* **Settings panel** — Compact view, hidden files toggle, auto-expand
* **Activity log** — Sidebar showing recent actions

---



