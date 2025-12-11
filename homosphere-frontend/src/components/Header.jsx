import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const { user, token, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <div className="logo-icon">
              <span className="logo-dot"></span>
            </div>
            <span className="logo-text">HomeShpere</span>
          </Link>
        </div>

        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          {user?.role !== 'ADMIN' && (
            <Link to="/subscription" className="nav-link">Subscription</Link>
          )}
          <Link to="/search" className="nav-link">Search</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/analytics" className="nav-link">Analytics</Link>
        </nav>

        <div className="header-actions">
          {isAuthenticated || token ? (
            <>
              {user.role !== 'ADMIN' && (
                <Link to="/profile" className="profile-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Profile
                </Link>
              )}
              {user.role === 'ADMIN' && (
                <Link to="/admin-portal" className="admin-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6m-6-6h6m6 0h-6"></path>
                  </svg>
                  Admin Portal
                </Link>
              )}
              <button onClick={handleSignOut} className="signout-btn">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="signin-btn">Sign In</Link>
              <Link to="/signup" className="signup-btn">Get Started</Link>
            </>
          )}
        </div>

        <button className="mobile-menu-btn" aria-label="Toggle menu">
          <span className="hamburger"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
