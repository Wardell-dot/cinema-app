import { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import useFetch from '../hooks/useFetch'
import MovieCard from '../components/MovieCard'
import SkeletonCard from '../components/SkeletonCard'

const API_KEY = import.meta.env.VITE_TMDB_KEY
const BASE = 'https://api.themoviedb.org/3'
const BACKDROP = 'https://image.tmdb.org/t/p/original'

const CATEGORIES = [
  { label: 'Trending', url: `${BASE}/trending/movie/week?api_key=${API_KEY}` },
  { label: 'Now Playing', url: `${BASE}/movie/now_playing?api_key=${API_KEY}` },
  { label: 'Top Rated', url: `${BASE}/movie/top_rated?api_key=${API_KEY}` },
  { label: 'Upcoming', url: `${BASE}/movie/upcoming?api_key=${API_KEY}` },
]

function Home() {
  const [activeCategory, setActiveCategory] = useState(0)
  const { data, loading, error } = useFetch(CATEGORIES[activeCategory].url)
  const movies = data?.results || []
  const featured = movies[0]

  return (
    <div className="home">
      <AnimatePresence mode="wait">
        {featured && featured.backdrop_path && (
          <motion.div
            key={featured.id}
            className="hero-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={`${BACKDROP}${featured.backdrop_path}`}
              alt={featured.title}
              className="hero-backdrop-img"
            />
            <div className="hero-backdrop-overlay" />
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="hero-eyebrow">Featured Film</span>
              <h1 className="hero-title">{featured.title}</h1>
              {featured.overview && (
                <p className="hero-overview">{featured.overview.slice(0, 200)}...</p>
              )}
              <div className="hero-meta">
                {featured.release_date && (
                  <span className="hero-year">{featured.release_date.slice(0, 4)}</span>
                )}
                {featured.vote_average > 0 && (
                  <span className="hero-rating">★ {featured.vote_average.toFixed(1)}</span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="home-main">
        <div className="category-tabs">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.label}
              className={`category-tab ${activeCategory === i ? 'category-tab--active' : ''}`}
              onClick={() => setActiveCategory(i)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {error && <div className="state-error">Failed to load films.</div>}

        <div className="movies-grid">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : movies.slice(0, 18).map((movie, i) => (
                <MovieCard key={movie.id} movie={movie} index={i} />
              ))
          }
        </div>
      </div>
    </div>
  )
}

export default Home