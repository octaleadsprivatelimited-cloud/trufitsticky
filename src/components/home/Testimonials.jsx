import { useState, useEffect, useMemo, useCallback } from "react";
import Arrow from "../../assets/arrow.svg";
import Loading from "../Loading";
import { useDebouncedResize } from "../../hooks/useDebounce";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const debouncedWidth = useDebouncedResize(150);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/admin_functions/testimonials/`
        );
        const data = await res.json();
        setTestimonials(data);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("Error fetching testimonials:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Update itemsPerPage based on debounced window width
  useEffect(() => {
    if (debouncedWidth >= 1440) setItemsPerPage(4);
    else if (debouncedWidth >= 1024) setItemsPerPage(3);
    else if (debouncedWidth >= 768) setItemsPerPage(2);
    else setItemsPerPage(1);
  }, [debouncedWidth]);

  const handleNext = useCallback(() => {
    if (currentIndex + itemsPerPage < testimonials.length) {
      setCurrentIndex((prev) => prev + itemsPerPage);
    }
  }, [currentIndex, itemsPerPage, testimonials.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex - itemsPerPage >= 0) {
      setCurrentIndex((prev) => prev - itemsPerPage);
    }
  }, [currentIndex, itemsPerPage]);

  const visibleTestimonials = useMemo(() => {
    return testimonials.slice(
      currentIndex,
      currentIndex + itemsPerPage
    );
  }, [testimonials, currentIndex, itemsPerPage]);

  return (
    <div className="test__section">
      <div className="test__container">
        {/* <div className="test__content">
          <div className="test__head">
            <p>Real Wins.</p>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <Loading />
            </div>
          ) : testimonials.length === 0 ? (
            <p
              style={{
                color: "#9c27ff",
                textAlign: "center",
                fontFamily: "Open Sans",
                fontSize: "20px",
              }}
            >
              No testimonials found
            </p>
          ) : (
            <>
              <div className="test__grid">
                {visibleTestimonials.map((t) => (
                  <div className="test__card" key={t.id}>
                    <div className="test__img">
                      <img src={t.image_url} alt={t.client_name} />
                    </div>
                    <p className="test__title">{t.client_name}</p>
                    <p className="test__text">{t.body}</p>
                    <div className="test__tag-sec">
                      <div className="test__tag tag-one">
                        <p>{t.age}</p>
                      </div>
                      <div className="test__tag tag-two">
                        <p>{t.tags}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="test__nav">
                <div
                  className="test__nav-btn"
                  onClick={handlePrev}
                  style={{
                    opacity: currentIndex === 0 ? 0.5 : 1,
                    pointerEvents: currentIndex === 0 ? "none" : "auto",
                  }}
                >
                  <img src={Arrow} alt="Prev" className="test-prev" />
                </div>
                <div
                  className="test__nav-btn"
                  onClick={handleNext}
                  style={{
                    opacity:
                      currentIndex + itemsPerPage >= testimonials.length
                        ? 0.5
                        : 1,
                    pointerEvents:
                      currentIndex + itemsPerPage >= testimonials.length
                        ? "none"
                        : "auto",
                  }}
                >
                  <img src={Arrow} alt="Next" />
                </div>
              </div>
            </>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default Testimonials;
