import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <Link to="/" className="app-brand">
            <span className="app-brand-icon" aria-hidden>🛡️</span>
            <span>
              <span className="app-brand-title">Инциденты</span>
              <span className="app-brand-sub">массовые мероприятия</span>
            </span>
          </Link>
          <nav className="app-nav" aria-label="Основная навигация">
            <Link to="/" className={`nav-link${isHome ? ' nav-link--active' : ''}`}>
              Список
            </Link>
            <Link
              to="/add"
              className={`nav-link nav-link--cta${pathname === '/add' ? ' nav-link--active' : ''}`}
            >
              + Новый инцидент
            </Link>
          </nav>
        </div>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        Учёт инцидентов · локальный JSON Server
      </footer>
    </div>
  );
};

export default Layout;
