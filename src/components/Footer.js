import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        <div style={styles.footerLogo}>
          <span style={styles.logoIcon}>🏔️</span>
          <span>GreenTravel</span>
          <p style={styles.footerDesc}>
            Ваш провідник у світі подорожей
          </p>
        </div>
        <div style={styles.footerLinks}>
          <div style={styles.footerColumn}>
            <h4>Інформація</h4>
            <a href="#">Про нас</a>
            <a href="#">Тури</a>
            <a href="#">Напрямки</a>
            <a href="#">Контакти</a>
          </div>
          <div style={styles.footerColumn}>
            <h4>Підтримка</h4>
            <a href="#">FAQ</a>
            <a href="#">Оплата</a>
            <a href="#">Повернення</a>
            <a href="#">Умови</a>
          </div>
          <div style={styles.footerColumn}>
            <h4>Ми в соцмережах</h4>
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">Telegram</a>
            <a href="#">TikTok</a>
          </div>
        </div>
      </div>
      <div style={styles.footerBottom}>
        <p>© 2026 GreenTravel. Всі права захищені.</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: "#1a2a3a",
    color: "white",
    padding: "50px 40px 20px",
  },
  footerContent: {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "40px",
    marginBottom: "40px",
  },
  footerLogo: {
    fontSize: "24px",
    fontWeight: "700",
  },
  logoIcon: {
    marginRight: "10px",
  },
  footerDesc: {
    fontSize: "14px",
    color: "#8a9aaa",
    marginTop: "10px",
  },
  footerLinks: {
    display: "flex",
    gap: "60px",
    flexWrap: "wrap",
  },
  footerColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  footerBottom: {
    textAlign: "center",
    paddingTop: "20px",
    borderTop: "1px solid #2a3a4a",
    color: "#8a9aaa",
    fontSize: "14px",
  },
};

export default Footer;