import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NavBar = ({ isMenuOpen, setIsMenuOpen }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const navItems = [
    { id: "home", label: "Головна", path: "/" },
    { id: "tours", label: "Тури", path: "/tours" },
    { id: "destinations", label: "Напрямки", path: "/destinations" },
    { id: "about", label: "Про нас", path: "/about" },
    { id: "contacts", label: "Контакти", path: "/contacts" }
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMenuOpen]);

  // Заборона скролу при відкритому меню
  useEffect(() => {
    if (isMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isMobile]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    // Відновлюємо скрол після закриття меню
    document.body.style.overflow = 'unset';
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <header style={styles.header}>
        <Link to="/" style={styles.logo} onClick={closeMenu}>
          <span style={styles.logoIcon}>🏔️</span>
          <span style={styles.logoText}>GreenTravel</span>
        </Link>

        {/* Навігація для десктопу */}
        <div style={{ ...styles.navWrapper, ...(isMobile && { display: 'none' }) }}>
          <nav style={styles.nav}>
            {navItems.map((item) => (
              <Link 
                key={item.id}
                to={item.path}
                style={{
                  ...styles.navLink,
                  ...(isActive(item.path) && styles.active)
                }}
                onClick={closeMenu}
              >
                <span style={styles.navIcon}>
                  {item.id === "home" && "🏠"}
                  {item.id === "tours" && "✈️"}
                  {item.id === "destinations" && "🌍"}
                  {item.id === "about" && "📖"}
                  {item.id === "contacts" && "📞"}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div style={styles.headerRight}>
          <button 
            style={styles.loginBtn} 
            onClick={() => {
              window.location.href = '/auth';
              closeMenu();
            }}
          >
            Вхід
          </button>
          {isMobile && (
            <button 
              style={styles.menuBtn} 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Меню"
            >
              <span style={{ 
                display: 'inline-block',
                transition: 'transform 0.3s'
              }}>
                {isMenuOpen ? '✕' : '☰'}
              </span>
            </button>
          )}
        </div>
      </header>

      {/* Мобільне меню */}
      {isMobile && (
        <div 
          style={{ 
            ...styles.mobileMenu, 
            ...(isMenuOpen && styles.mobileMenuOpen),
            visibility: isMenuOpen ? 'visible' : 'hidden',
            pointerEvents: isMenuOpen ? 'auto' : 'none'
          }}
        >
          <div style={styles.mobileMenuHeader}>
            <span style={styles.mobileMenuLogo}>🏔️ GreenTravel</span>
            <button style={styles.mobileMenuClose} onClick={closeMenu}>✕</button>
          </div>
          <div style={styles.mobileMenuItems}>
            {navItems.map((item) => (
              <Link 
                key={item.id}
                to={item.path}
                style={{
                  ...styles.mobileNavLink,
                  ...(isActive(item.path) && styles.mobileActive)
                }}
                onClick={closeMenu}
              >
                <span style={styles.mobileNavIcon}>
                  {item.id === "home" && "🏠"}
                  {item.id === "tours" && "✈️"}
                  {item.id === "destinations" && "🌍"}
                  {item.id === "about" && "📖"}
                  {item.id === "contacts" && "📞"}
                </span>
                {item.label}
              </Link>
            ))}
          </div>
          <div style={styles.mobileMenuFooter}>
            <button 
              style={styles.mobileLangBtn}
              onClick={() => {
                console.log("Мова змінена");
                closeMenu();
              }}
            >
              🌐 Українська
            </button>
          </div>
        </div>
      )}

      {/* Overlay для затемнення фону при відкритому меню */}
      {isMenuOpen && isMobile && (
        <div style={styles.overlay} onClick={closeMenu}></div>
      )}
    </>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "60px",
    padding: "16px 30px",
    background: "white",
    borderRadius: "20px",
    boxShadow: "0 2px 15px rgba(0,0,0,0.05)",
    position: "relative",
    zIndex: 1001,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "24px",
    fontWeight: "700",
    cursor: "pointer",
    textDecoration: "none",
    zIndex: 1002,
  },
  logoIcon: {
    fontSize: "32px",
  },
  logoText: {
    background: "linear-gradient(135deg, #2c5f8a 0%, #4a90c4 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  navWrapper: {
    display: "block",
  },
  nav: {
    display: "flex",
    gap: "32px",
    alignItems: "center",
  },
  navLink: {
    textDecoration: "none",
    color: "#4a5a6a",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "10px",
  },
  navIcon: {
    fontSize: "18px",
  },
  active: {
    color: "#2c5f8a",
    fontWeight: "600",
    background: "#e8f0fe",
  },
  headerRight: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    zIndex: 1002,
  },
  langBtn: {
    background: "transparent",
    border: "1px solid #ddd",
    padding: "8px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  loginBtn: {
    background: "#2c5f8a",
    color: "white",
    border: "none",
    padding: "8px 18px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  menuBtn: {
    fontSize: "28px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0 10px",
    zIndex: 1002,
    transition: "all 0.3s",
  },
  mobileMenu: {
    position: "fixed",
    top: 0,
    right: 0,
    width: "280px",
    height: "100%",
    background: "white",
    zIndex: 2000,
    transform: "translateX(100%)",
    transition: "transform 0.3s ease",
    display: "flex",
    flexDirection: "column",
    boxShadow: "-5px 0 30px rgba(0,0,0,0.1)",
  },
  mobileMenuOpen: {
    transform: "translateX(0)",
  },
  mobileMenuHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid #e0e8f0",
  },
  mobileMenuLogo: {
    fontSize: "18px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #2c5f8a 0%, #4a90c4 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  mobileMenuClose: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#2c5f8a",
  },
  mobileMenuItems: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    gap: "15px",
    overflowY: "auto",
  },
  mobileNavLink: {
    textDecoration: "none",
    color: "#4a5a6a",
    fontWeight: "500",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "12px",
    transition: "all 0.3s",
  },
  mobileNavIcon: {
    fontSize: "20px",
  },
  mobileActive: {
    color: "#2c5f8a",
    fontWeight: "600",
    background: "#e8f0fe",
  },
  mobileMenuFooter: {
    padding: "20px",
    borderTop: "1px solid #e0e8f0",
  },
  mobileLangBtn: {
    width: "100%",
    background: "transparent",
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "10px",
    fontSize: "14px",
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 1999,
    animation: "fadeIn 0.3s ease",
  },
};

// Додаємо CSS анімації
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    .navWrapper {
      display: none !important;
    }
    .loginBtn {
      padding: 6px 12px;
      font-size: 12px;
    }
  }
  
  @media (min-width: 769px) {
    .menuBtn {
      display: none !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default NavBar;