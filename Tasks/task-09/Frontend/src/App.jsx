import { useState } from 'react';
import { ToastProvider } from './context/ToastContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import Books from './pages/Books';
import Members from './pages/Members';
import Issues from './pages/IssueReturn';
import Search from './pages/Search';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'books':     return <Books />;
      case 'members':   return <Members />;
      case 'issues':    return <Issues />;
      case 'search':    return <Search />;
      default:          return <Dashboard />;
    }
  };

  return (
    <ToastProvider>
      <div className="App bg-main-bg min-h-screen selection:bg-[#00d2ff] selection:text-black">
        {!isAuthenticated ? (
          <Login onLogin={() => setIsAuthenticated(true)} />
        ) : (
          <div style={{ display: 'flex', position: 'relative', minHeight: '100vh' }}>
            <Sidebar
              page={currentPage}
              setPage={setCurrentPage}
              onLogout={() => setIsAuthenticated(false)}
            />

            {/* Main content */}
            <main style={{
              flex: 1, marginLeft: '260px', minHeight: '100vh',
              padding: '40px 40px 40px 40px',
              position: 'relative',
            }}>
              {/* Ambient glows */}
              <div style={{
                position: 'fixed', bottom: '-80px', right: '-80px',
                width: '400px', height: '400px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,210,255,0.06) 0%, transparent 70%)',
                pointerEvents: 'none', zIndex: 0,
              }} />
              <div style={{
                position: 'fixed', top: '20%', right: '10%',
                width: '300px', height: '300px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(120,0,255,0.04) 0%, transparent 70%)',
                pointerEvents: 'none', zIndex: 0,
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                {renderPage()}
              </div>
            </main>
          </div>
        )}
      </div>
    </ToastProvider>
  );
}
