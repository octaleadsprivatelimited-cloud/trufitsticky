import { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import Arrow from "../../assets/arrow.svg";
import Loading from "../Loading";
import { useDebouncedResize } from "../../hooks/useDebounce";

const Articles = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const debouncedWidth = useDebouncedResize(150);

  // Update itemsPerPage based on debounced window width
  useEffect(() => {
    if (debouncedWidth >= 2000) {
      setItemsPerPage(4);
    } else if (debouncedWidth >= 1024) {
      setItemsPerPage(3);
    } else if (debouncedWidth >= 768) {
      setItemsPerPage(2);
    } else {
      setItemsPerPage(1);
    }
  }, [debouncedWidth]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/admin_functions/blogs/`);
        const data = await res.json();
        setArticles(data);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Error fetching articles:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const cardsPerPage = itemsPerPage;
  const totalPages = useMemo(() => Math.ceil(articles.length / cardsPerPage), [articles.length, cardsPerPage]);

  const handleNext = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const handlePrev = useCallback(() => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  }, [totalPages]);

  const currentArticle = useMemo(() => {
    return articles.slice(
      currentPage * cardsPerPage,
      currentPage * cardsPerPage + cardsPerPage
    );
  }, [articles, currentPage, cardsPerPage]);

  return (
    <div className="art__section">
      <div className="art__container">
        <div className="art__content">
          {/* Headings */}
          <div className="art__head">
            <motion.h2
              className="art__head-title"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.5 }}
            >
              Coach Notes
            </motion.h2>
            <motion.p
              className="art__head-tag"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.5 }}
            >
              Simple tips. Real advice. No fluff
            </motion.p>
            <motion.p
              className="art__head-text"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.5 }}
            >
              From strength training to recovery, our blog has everything you need
              to level up your fitness game.
            </motion.p>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", margin: "40px 0" }}>
              <Loading />
            </div>
          ) : articles.length === 0 ? (
            <p
              style={{
                color: "#9c27ff",
                textAlign: "center",
                fontFamily: "Open Sans",
                fontSize: "20px",
              }}
            >
              No articles found.
            </p>
          ) : (
            <div className="art__row">
              {currentArticle.map((article, id) => (
                <div className="art__card" key={id}>
                  <div
                    className="art__card-img"
                    style={{
                      backgroundImage: `linear-gradient(
                        0deg,
                        rgba(0, 0, 0, 0.6) 0%,
                        rgba(0, 0, 0, 0.6) 100%
                      ), url(${article.image_url})`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      width: "100%",
                      height: "270px",
                      borderRadius: "18.5px",
                      boxShadow: "0 3.7px 6.167px 0 rgba(0,0,0,0.25)",
                    }}
                  ></div>
                  <div className="art__title-tag">
                    <div className="title-tag-dot"></div>
                    <p>{article.titleTag || "No tag"}</p>
                  </div>
                  <div className="art__title-main">
                    <h3>{article.title}</h3>
                  </div>
                  <div className="art__btn">
                    <p>Read article</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {articles.length > 0 && (
            <div className="test__nav">
              <div className="test__nav-btn" onClick={handlePrev}>
                <img src={Arrow} alt="Prev" className="test-prev" />
              </div>
              <div className="test__nav-btn" onClick={handleNext}>
                <img src={Arrow} alt="Next" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Articles;
