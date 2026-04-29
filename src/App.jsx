// src/App.jsx
// ------------------------------------------------------------------
// Root of the application. Sets up React Router v7 routes:
//   /                  → redirects to /dashboard
//   /invite/:slug      → guest-facing invitation page
//   /dashboard         → host dashboard
// ------------------------------------------------------------------
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import InvitePage from './pages/InvitePage';
import Dashboard  from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Guest-facing invitation */}
        <Route path="/invite/:slug" element={<InvitePage />} />

        {/* Host dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
