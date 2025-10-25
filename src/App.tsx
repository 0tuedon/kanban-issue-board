import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import "./App.css"
import 'react-toastify/dist/ReactToastify.css';

const BoardPage = lazy(() => import('./pages/BoardPage').then(module => ({ default: module.BoardPage })));
const IssueDetailPage = lazy(() => import('./pages/IssueDetailPage').then(module => ({ default: module.IssueDetailPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })));


const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    fontSize: '18px',
    color: '#6b7280'
  }}>
    Loading...
  </div>
);

export const App = () => {

  return (
      <Router>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navigation />
        <main id="main-content">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/board" element={<BoardPage />} />
              <Route path="/issue/:id" element={<IssueDetailPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/board" />} />
            </Routes>
          </Suspense>
        </main>
      </Router>
  );
}