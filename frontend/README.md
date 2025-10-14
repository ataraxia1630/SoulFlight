# Frontend Documentation

This document outlines the frontend structure, setup instructions, development guidelines, and usage for the project. The frontend is built using **ReactJS** with **Vite** as the build tool. The project is organized to support three user roles: **Admin**, **Business**, and **Traveler**, with modular and reusable code.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Tech Stack](#tech-stack)
3. [Setup Instructions](#setup-instructions)
4. [Development Guidelines](#development-guidelines)
   - [Where to Write Code](#where-to-write-code)
   - [Notes and Best Practices](#notes-and-best-practices)
5. [Available Scripts](#available-scripts)

---

## Project Structure

The frontend follows a modular structure, organized by features and roles to ensure scalability and maintainability:

```
frontend/
├── public/                     # Static files (favicon, robots.txt, index.html, etc.)
├── src/
│   ├── app/                    # App-wide configurations
│   │   ├── router/             # Route definitions for Admin, Business, Traveler
│   │   ├── store/              # Zustand store for state management
│   │   ├── providers/          # Context providers (Auth, Theme, etc.)
│   │   └── App.jsx             # Root component with layout and router
│   ├── assets/                 # Images, icons, fonts
│   ├── features/               # Feature-based modules by role
│   │   ├── admin/              # Admin-specific functionality
│   │   │   ├── pages/          # Pages: UserManagement, ServiceManagement, etc.
│   │   │   ├── components/     # Components: TableUser, ModalService, etc.
│   │   │   └── services/       # API calls for admin
│   │   ├── business/           # Business-specific functionality
│   │   │   ├── pages/          # Pages: Dashboard, Services, Vouchers, etc.
│   │   │   ├── components/     # Components: FormService, ChartRevenue, etc.
│   │   │   └── services/       # API calls for business
│   │   ├── traveler/           # Traveler-specific functionality
│   │   │   ├── pages/          # Pages: Home, Search, Cart, Payment, etc.
│   │   │   ├── components/     # Components: ServiceCard, TripTimeline, etc.
│   │   │   └── services/       # API calls for traveler
│   ├── shared/                 # Shared utilities and components
│   │   ├── components/         # Reusable components: Button, Input, Modal, etc.
│   │   ├── hooks/              # Custom hooks: useAuth, useFetch, etc.
│   │   ├── utils/              # Utility functions: formatDate, currencyFormat, etc.
│   │   ├── services/           # Shared API services (axios instance, auth)
│   ├── layouts/                # Layout components: MainLayout, AuthLayout, etc.
│   ├── styles/                 # Global styles
│   │   ├── global.css          # CSS reset and global styles
│   │   ├── App.css             # Styles specific to App.jsx
│   ├── main.jsx                # Entry point for rendering the app
│   └── index.css               # Global CSS reset
├── package.json                # Project dependencies and scripts
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

---

## Tech Stack

- **Framework**: ReactJS (v18.x)
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **API Calls**: Axios
- **Icons**: React Icons, custom SVGs
- **Charts**: Chart.js (for analytics)
- **Authentication**: JWT-based or OAuth for Google/Facebook/X
- **Environment**: Node.js (v18.x)

---

## Setup Instructions

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install Dependencies**:
   Ensure Node.js (v18.x) is installed. Then run:

   ```bash
   npm install
   ```

3. **Run the Development Server**:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

4. **Build for Production**:

   ```bash
   npm run build
   ```

   The output will be in the `dist/` folder.

5. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## Development Guidelines

### Where to Write Code

- **Routing** (`src/app/router/`):

  - Define routes for Admin, Business, and Traveler in separate files (e.g., `adminRoutes.jsx`, `businessRoutes.jsx`, `travelerRoutes.jsx`).
  - Combine routes in `src/app/router/index.jsx` using `react-router-dom`.
  - Example: Protected routes for Admin require `isAdmin` check in `AuthProvider`.

- **API Calls** (`src/features/*/services/`):

  - Create Axios instances in `src/shared/services/api.js`.
  - Role-specific API calls go in `src/features/<role>/services/` (e.g., `adminService.js` for user management).
  - Use `src/shared/services/authService.js` for login/register.

- **Components**:

  - Role-specific components: `src/features/<role>/components/` (e.g., `ServiceCard` in `traveler/components/`).
  - Shared components: `src/shared/components/` (e.g., `Button`, `Modal`).
  - Keep components reusable and props-driven.

- **Pages** (`src/features/*/pages/`):

  - Each page corresponds to a route (e.g., `Home.jsx` in `traveler/pages/`).
  - Pages compose role-specific and shared components.

- **Layouts** (`src/layouts/`):

  - Define layouts like `MainLayout.jsx` (for general UI), `AuthLayout.jsx` (for login/register), and `AdminLayout.jsx` (for admin dashboard).
  - Include `Navbar`, `Sidebar`, or `Footer` as needed.

- **Styles** (`src/styles/`):

  - Add global styles in `src/styles/global.css`.
  - Use `src/styles/App.css` for app-specific styles.

- **Utilities and Hooks** (`src/shared/`):

  - Utility functions (e.g., `formatDate`) go in `src/shared/utils/`.
  - Custom hooks (e.g., `useAuth`) go in `src/shared/hooks/`.

- **Assets** (`src/assets/`):

  - Store images, icons, and fonts here. Import in components as needed.

- **FormInput Component** :

  - Located at: `src/shared/components/FormInput.jsx`
  - A wrapper providing a unified UI for multiple input types:
    - `text` → `TextInput`
    - `select` → `SelectInput`
    - `date` → `DateInput` (uses `@mui/x-date-pickers` + `AdapterDateFns`)

### Notes and Best Practices

- **Modularity**: Keep features isolated by role (`admin`, `business`, `traveler`) to avoid cross-contamination.
- **Reusability**: Use shared components and hooks to reduce duplication.
- **API Error Handling**: Implement global error handling in Axios interceptors (`src/shared/services/api.js`).
- **Authentication**: Use `AuthProvider` to manage JWT tokens and role-based access. Store tokens in `localStorage`, `sessionStorage` or Zustand.

---

## Available Scripts

In the `frontend/` directory, you can run:

- `npm run dev`: Start the development server.
- `npm run build`: Build the app for production.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run Biome to check code quality.
- `npm run fix`: Automatically fix issues with Biome.
- `npm run format`: Format code using Biome.
