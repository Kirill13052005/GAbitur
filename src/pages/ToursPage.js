import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const ToursPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = ["Всі", "Гірські", "Морські", "Екстремальні", "Екскурсійні", "Сімейні"];

  const tours = [
    {
      id: 1,
      title: "Гірська пригода в Карпатах",
      category: "Гірські",
      duration: "7 днів / 6 ночей",
      price: 850,
      oldPrice: 1200,
      location: "Україна, Карпати",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      description: "Неймовірні краєвиди, походи в гори, вечори біля багаття та знайомство з гуцульською культурою.",
      date: "26.05.2023",
      views: 125,
      includes: ["Проживання", "Харчування", "Гід", "Страховка"],
      hot: true
    },
    {
      id: 2,
      title: "Мальдівська романтика",
      category: "Морські",
      duration: "10 днів / 9 ночей",
      price: 2100,
      oldPrice: null,
      location: "Мальдіви",
      image: "https://images.unsplash.com/photo-1528127269322-539801943592",
      description: "Білосніжні пляжі, блакитна вода, заходи сонця та дайвінг серед коралових рифів.",
      date: "26.05.2023",
      views: 125,
      includes: ["Авіаквитки", "Вілла на воді", "Сніданки", "Трансфер"],
      hot: false
    },
    {
      id: 3,
      title: "Екологічні інновації в туризмі",
      category: "Екскурсійні",
      duration: "5 днів / 4 ночі",
      price: 650,
      oldPrice: 890,
      location: "Німеччина, Берлін",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
      description: "Відвідування екологічних виробництв, сучасних центрів переробки та лекції про сталий розвиток.",
      date: "26.05.2023",
      views: 125,
      includes: ["Проживання", "Екскурсії", "Трансфер", "Гід"],
      hot: true
    },
    {
      id: 4,
      title: "Боротьба із забрудненням повітря",
      category: "Екскурсійні",
      duration: "4 дні / 3 ночі",
      price: 480,
      oldPrice: null,
      location: "Польща, Краків",
      image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
      description: "Освітній тур про сучасні методи очищення повітря та екологічні технології в містах.",
      date: "26.05.2023",
      views: 125,
      includes: ["Проживання", "Харчування", "Лекції", "Матеріали"],
      hot: false
    },
    {
      id: 5,
      title: "Водні ресурси планети",
      category: "Морські",
      duration: "8 днів / 7 ночей",
      price: 1450,
      oldPrice: 1800,
      location: "Хорватія, Спліт",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      description: "Вивчення водних екосистем, дайвінг та участь в екологічних проектах захисту моря.",
      date: "26.05.2023",
      views: 125,
      includes: ["Авіаквитки", "Готель", "Спорядження", "Інструктор"],
      hot: true
    },
    {
      id: 6,
      title: "Трекінг Гімалаями",
      category: "Екстремальні",
      duration: "14 днів / 13 ночей",
      price: 3200,
      oldPrice: null,
      location: "Непал",
      image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8",
      description: "Екстремальний похід до базового табору Евересту з досвідченими шерпами.",
      date: "26.05.2023",
      views: 125,
      includes: ["Переліт", "Спорядження", "Харчування", "Гіди"],
      hot: false
    },
    {
      id: 7,
      title: "Скандинавська казка",
      category: "Сімейні",
      duration: "6 днів / 5 ночей",
      price: 950,
      oldPrice: null,
      location: "Норвегія",
      image: "https://images.unsplash.com/photo-1552083375-1447ce886485",
      description: "Фіорди, водоспади, північне сяйво та активності для всієї родини.",
      date: "26.05.2023",
      views: 125,
      includes: ["Проживання", "Трансфер", "Екскурсії", "Сніданки"],
      hot: false
    },
    {
      id: 8,
      title: "Середземноморський рай",
      category: "Морські",
      duration: "9 днів / 8 ночей",
      price: 1680,
      oldPrice: 2100,
      location: "Греція, Санторіні",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077",
      description: "Білі будиночки, блакитні куполи, незабутні заходи сонця та грецька кухня.",
      date: "26.05.2023",
      views: 125,
      includes: ["Авіаквитки", "Готель", "Сніданки", "Страховка"],
      hot: true
    }
  ];

  const filteredTours = tours.filter(tour => {
    const matchesCategory = selectedCategory === "all" || selectedCategory === "Всі" || tour.category === selectedCategory;
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tour.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={styles.app}>
      <div style={isMobile ? { ...styles.container, ...styles.containerMobile } : styles.container}>
        <NavBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

        {/* Hero Section */}
        <section style={isMobile ? { ...styles.hero, ...styles.heroMobile } : styles.hero}>
          <div style={styles.heroContent}>
            <h1 style={isMobile ? { ...styles.heroTitle, ...styles.heroTitleMobile } : styles.heroTitle}>
              Наші <span style={styles.gradientText}>тури</span>
            </h1>
            <p style={isMobile ? { ...styles.heroSubtitle, ...styles.heroSubtitleMobile } : styles.heroSubtitle}>
              Відкрийте для себе унікальні подорожі, що поєднують відпочинок, 
              пізнання природи та яскраві враження
            </p>
            <div style={isMobile ? { ...styles.searchBar, ...styles.searchBarMobile } : styles.searchBar}>
              <input 
                type="text" 
                placeholder="Пошук турів..." 
                style={isMobile ? { ...styles.searchInput, ...styles.searchInputMobile } : styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button style={isMobile ? { ...styles.searchBtn, ...styles.searchBtnMobile } : styles.searchBtn}>
                🔍 Знайти
              </button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <div style={isMobile ? { ...styles.categories, ...styles.categoriesMobile } : styles.categories}>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              style={{
                ...styles.categoryBtn,
                ...(isMobile && styles.categoryBtnMobile),
                ...(selectedCategory === cat || (selectedCategory === "all" && cat === "Всі") 
                  ? styles.categoryBtnActive : {})
              }}
              onClick={() => setSelectedCategory(cat === "Всі" ? "all" : cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tours Grid */}
        <section style={isMobile ? { ...styles.toursSection, ...styles.toursSectionMobile } : styles.toursSection}>
          <div style={isMobile ? { ...styles.sectionHeader, ...styles.sectionHeaderMobile } : styles.sectionHeader}>
            <h2 style={isMobile ? { ...styles.sectionTitle, ...styles.sectionTitleMobile } : styles.sectionTitle}>
              Доступні тури
            </h2>
            <p style={isMobile ? { ...styles.sectionSubtitle, ...styles.sectionSubtitleMobile } : styles.sectionSubtitle}>
              Знайдено {filteredTours.length} турів
            </p>
          </div>

          <div style={isMobile ? { ...styles.toursGrid, ...styles.toursGridMobile } : styles.toursGrid}>
            {filteredTours.map((tour) => (
              <div key={tour.id} style={isMobile ? { ...styles.tourCard, ...styles.tourCardMobile } : styles.tourCard}>
                <div style={isMobile ? { ...styles.cardImageWrapper, ...styles.cardImageWrapperMobile } : styles.cardImageWrapper}>
                  <img src={tour.image} style={styles.cardImage} alt={tour.title} />
                  {tour.hot && <span style={isMobile ? { ...styles.hotBadge, ...styles.hotBadgeMobile } : styles.hotBadge}>HOT</span>}
                  <div style={isMobile ? { ...styles.priceTag, ...styles.priceTagMobile } : styles.priceTag}>
                    {tour.oldPrice && <span style={isMobile ? { ...styles.priceOld, ...styles.priceOldMobile } : styles.priceOld}>{tour.oldPrice}$</span>}
                    <span style={isMobile ? { ...styles.priceCurrent, ...styles.priceCurrentMobile } : styles.priceCurrent}>{tour.price}$</span>
                  </div>
                </div>
                <div style={isMobile ? { ...styles.cardContent, ...styles.cardContentMobile } : styles.cardContent}>
                  <div style={isMobile ? { ...styles.cardMeta, ...styles.cardMetaMobile } : styles.cardMeta}>
                    <span style={styles.metaItem}>📅 {tour.date}</span>
                    <span style={styles.metaItem}>👁️ {tour.views}</span>
                    <span style={isMobile ? { ...styles.categoryTag, ...styles.categoryTagMobile } : styles.categoryTag}>
                      {tour.category}
                    </span>
                  </div>
                  <h3 style={isMobile ? { ...styles.cardTitle, ...styles.cardTitleMobile } : styles.cardTitle}>
                    {tour.title}
                  </h3>
                  <p style={isMobile ? { ...styles.cardLocation, ...styles.cardLocationMobile } : styles.cardLocation}>
                    📍 {tour.location}
                  </p>
                  <p style={isMobile ? { ...styles.cardDescription, ...styles.cardDescriptionMobile } : styles.cardDescription}>
                    {tour.description}
                  </p>
                  <div style={isMobile ? { ...styles.duration, ...styles.durationMobile } : styles.duration}>
                    <span>⏱️ {tour.duration}</span>
                  </div>
                  <div style={isMobile ? { ...styles.includes, ...styles.includesMobile } : styles.includes}>
                    {tour.includes.slice(0, isMobile ? 2 : 3).map((item, idx) => (
                      <span key={idx} style={isMobile ? { ...styles.includeTag, ...styles.includeTagMobile } : styles.includeTag}>
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                  <button style={isMobile ? { ...styles.detailsBtn, ...styles.detailsBtnMobile } : styles.detailsBtn}>
                    Детальніше →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTours.length === 0 && (
            <div style={isMobile ? { ...styles.noResults, ...styles.noResultsMobile } : styles.noResults}>
              <p>😢 Нічого не знайдено</p>
              <p>Спробуйте змінити критерії пошуку</p>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
};

const styles = {
  app: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background: "linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)",
    minHeight: "100vh",
  },
  container: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "20px 40px",
  },
  containerMobile: {
    padding: "10px 16px",
  },
  hero: {
    background: "linear-gradient(135deg, #e8f0fe 0%, #d4e4f5 100%)",
    borderRadius: "30px",
    padding: "60px 40px",
    marginBottom: "40px",
    textAlign: "center",
  },
  heroMobile: {
    padding: "30px 20px",
    marginBottom: "30px",
    borderRadius: "20px",
  },
  heroContent: {
    maxWidth: "700px",
    margin: "0 auto",
  },
  heroTitle: {
    fontSize: "48px",
    marginBottom: "20px",
  },
  heroTitleMobile: {
    fontSize: "28px",
    marginBottom: "15px",
  },
  gradientText: {
    background: "linear-gradient(135deg, #2c5f8a 0%, #4a90c4 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubtitle: {
    fontSize: "18px",
    color: "#5a6b7a",
    marginBottom: "30px",
    lineHeight: "1.6",
  },
  heroSubtitleMobile: {
    fontSize: "14px",
    marginBottom: "20px",
  },
  searchBar: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  searchBarMobile: {
    flexDirection: "column",
    gap: "10px",
  },
  searchInput: {
    width: "350px",
    padding: "14px 20px",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  searchInputMobile: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "14px",
  },
  searchBtn: {
    background: "#2c5f8a",
    color: "white",
    border: "none",
    padding: "14px 28px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  searchBtnMobile: {
    padding: "12px 20px",
    fontSize: "14px",
    width: "100%",
  },
  categories: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "50px",
    justifyContent: "center",
  },
  categoriesMobile: {
    gap: "8px",
    marginBottom: "30px",
  },
  categoryBtn: {
    padding: "10px 24px",
    borderRadius: "30px",
    border: "1px solid #ddd",
    background: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s",
  },
  categoryBtnMobile: {
    padding: "6px 14px",
    fontSize: "12px",
  },
  categoryBtnActive: {
    background: "#2c5f8a",
    color: "white",
    borderColor: "#2c5f8a",
  },
  toursSection: {
    marginBottom: "80px",
  },
  toursSectionMobile: {
    marginBottom: "40px",
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: "40px",
  },
  sectionHeaderMobile: {
    marginBottom: "25px",
  },
  sectionTitle: {
    fontSize: "32px",
    marginBottom: "10px",
  },
  sectionTitleMobile: {
    fontSize: "24px",
  },
  sectionSubtitle: {
    color: "#7a8a9a",
  },
  sectionSubtitleMobile: {
    fontSize: "14px",
  },
  toursGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
    gap: "30px",
  },
  toursGridMobile: {
    gridTemplateColumns: "1fr",
    gap: "20px",
  },
  tourCard: {
    background: "white",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  },
  tourCardMobile: {
    borderRadius: "15px",
  },
  cardImageWrapper: {
    position: "relative",
    height: "220px",
  },
  cardImageWrapperMobile: {
    height: "180px",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  hotBadge: {
    position: "absolute",
    top: "15px",
    left: "15px",
    background: "#ff4757",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  hotBadgeMobile: {
    top: "10px",
    left: "10px",
    padding: "3px 10px",
    fontSize: "10px",
  },
  priceTag: {
    position: "absolute",
    bottom: "15px",
    right: "15px",
    background: "rgba(0,0,0,0.75)",
    padding: "6px 12px",
    borderRadius: "10px",
    color: "white",
  },
  priceTagMobile: {
    bottom: "10px",
    right: "10px",
    padding: "4px 10px",
  },
  priceOld: {
    fontSize: "12px",
    textDecoration: "line-through",
    marginRight: "8px",
    opacity: 0.7,
  },
  priceOldMobile: {
    fontSize: "10px",
    marginRight: "5px",
  },
  priceCurrent: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#ffd700",
  },
  priceCurrentMobile: {
    fontSize: "14px",
  },
  cardContent: {
    padding: "20px",
  },
  cardContentMobile: {
    padding: "15px",
  },
  cardMeta: {
    display: "flex",
    gap: "15px",
    marginBottom: "12px",
    fontSize: "12px",
    color: "#8a9aaa",
    flexWrap: "wrap",
  },
  cardMetaMobile: {
    gap: "10px",
    fontSize: "10px",
    marginBottom: "10px",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  categoryTag: {
    background: "#e8f0fe",
    padding: "2px 8px",
    borderRadius: "12px",
    color: "#2c5f8a",
    fontSize: "11px",
  },
  categoryTagMobile: {
    fontSize: "9px",
    padding: "2px 6px",
  },
  cardTitle: {
    fontSize: "18px",
    marginBottom: "8px",
    fontWeight: "600",
  },
  cardTitleMobile: {
    fontSize: "16px",
    marginBottom: "6px",
  },
  cardLocation: {
    fontSize: "13px",
    color: "#7a8a9a",
    marginBottom: "12px",
  },
  cardLocationMobile: {
    fontSize: "11px",
    marginBottom: "10px",
  },
  cardDescription: {
    fontSize: "13px",
    color: "#5a6b7a",
    lineHeight: "1.5",
    marginBottom: "12px",
  },
  cardDescriptionMobile: {
    fontSize: "12px",
    marginBottom: "10px",
  },
  duration: {
    fontSize: "13px",
    color: "#2c5f8a",
    marginBottom: "12px",
  },
  durationMobile: {
    fontSize: "11px",
    marginBottom: "10px",
  },
  includes: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "15px",
  },
  includesMobile: {
    gap: "6px",
    marginBottom: "12px",
  },
  includeTag: {
    fontSize: "11px",
    background: "#f0f4ed",
    padding: "4px 10px",
    borderRadius: "15px",
    color: "#2c5f8a",
  },
  includeTagMobile: {
    fontSize: "9px",
    padding: "3px 8px",
  },
  detailsBtn: {
    width: "100%",
    background: "#2c5f8a",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
  },
  detailsBtnMobile: {
    padding: "8px",
    fontSize: "13px",
  },
  noResults: {
    textAlign: "center",
    padding: "60px",
    color: "#8a9aaa",
  },
  noResultsMobile: {
    padding: "40px",
    fontSize: "14px",
  },
};

export default ToursPage;