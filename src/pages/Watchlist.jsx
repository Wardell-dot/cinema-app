import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const loadWatchlist = () => {
      const saved = JSON.parse(
        localStorage.getItem("cinema-watchlist") || "[]",
      );
      setWatchlist(saved);
    };
    loadWatchlist();
  }, []);

  const remove = (id) => {
    const updated = watchlist.filter((m) => m.id !== id);
    localStorage.setItem("cinema-watchlist", JSON.stringify(updated));
    setWatchlist(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="watchlist-page">
        <div className="watchlist-hero">
          <span className="watchlist-eyebrow">Saved Films</span>
          <h1 className="watchlist-title">My Watchlist</h1>
          {watchlist.length > 0 && (
            <span className="watchlist-count">{watchlist.length} films</span>
          )}
        </div>

        {watchlist.length === 0 && (
          <div className="watchlist-empty">
            <p>Your watchlist is empty.</p>
            <Link to="/" className="watchlist-browse-btn">
              Browse Films
            </Link>
          </div>
        )}

        <div className="watchlist-content">
          <div className="movies-grid">
            {watchlist.map((movie) => (
              <motion.div
                key={movie.id}
                className="watchlist-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: watchlist.indexOf(movie) * 0.1,
                }}
              >
                <Link to={`/movie/${movie.id}`} className="movie-card">
                  <div className="movie-poster">
                    {movie.poster_path ? (
                      <img
                        src={`${IMG_BASE}${movie.poster_path}`}
                        alt={movie.title}
                        className="movie-poster-img"
                      />
                    ) : (
                      <div className="movie-no-poster">{movie.title}</div>
                    )}
                    {movie.vote_average > 0 && (
                      <div className="movie-rating">
                        ★ {movie.vote_average.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    {movie.release_date && (
                      <span className="movie-year">
                        {movie.release_date.slice(0, 4)}
                      </span>
                    )}
                  </div>
                </Link>
                <button
                  className="watchlist-remove-btn"
                  onClick={() => remove(movie.id)}
                  aria-label="Remove from watchlist"
                >
                  ✕
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Watchlist;
