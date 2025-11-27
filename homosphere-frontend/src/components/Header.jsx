import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
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
          <Link to="/subscription" className="nav-link">Subscription</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <Link to="/profile" className="profile-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Profile
              </Link>
              <button onClick={handleSignOut} className="signout-btn">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="logout-btn" onClick={handleSignOut}>Log out</Link>
              <Link to="/profile" className="profile-btn">Profile</Link>
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
