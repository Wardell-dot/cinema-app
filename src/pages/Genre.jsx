import { useParams } from 'react-router-dom'
import { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import useFetch from '../hooks/useFetch'
import MovieCard from '../components/MovieCard'
import SkeletonCard from '../components/SkeletonCard'

const API_KEY = import.meta.env.VITE_TMDB_KEY
const BASE = 'https://api.themoviedb.org/3'
const BACKDROP = 'https://image.tmdb.org/t/p/original'

const GENRE_THEMES = {
  '27': { accent: '#e50914', label: 'Horror' },
  '18': { accent: '#4a90d9', label: 'Drama' },
  '53': { accent: '#00c896', label: 'Thriller' },
}

const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'popularity.desc' },
  { label: 'Top Rated', value: 'vote_average.desc' },
  { label: 'Newest', value: 'release_date.desc' },
]

function Genre() {
  const { id, name } = useParams()
  const [sort, setSort] = useState('popularity.desc')
  const theme = GENRE_THEMES[id] || { accent: '#f5a623', label: name }

  const url = `${BASE}/discover/movie?api_key=${API_KEY}&with_genres=${id}&sort_by=${sort}&vote_count.gte=100&language=en-US`

  const { data, loading, error } = useFetch(url)
  const movies = data?.results || []
  const featured = movies[0]

  return (
    <div className="genre-page">
      {featured && featured.backdrop_path && (
        <motion.div
          className="hero-backdrop genre-hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={`${BACKDROP}${featured.backdrop_path}`}
            alt={featured.title}
            className="hero-backdrop-img"
          />
          <div className="hero-backdrop-overlay" />
          <div className="genre-hero-tint" style={{ background: `linear-gradient(to top, ${theme.accent}33 0%, transparent 60%)` }} />
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="hero-eyebrow" style={{ color: theme.accent }}>{name} — Featured</span>
            <h1 className="hero-title">{featured.title}</h1>
            {featured.overview && (
              <p className="hero-overview">{featured.overview.slice(0, 180)}...</p>
            )}
            <div className="hero-meta">
              {featured.release_date && (
                <span className="hero-year">{featured.release_date.slice(0, 4)}</span>
              )}
              {featured.vote_average > 0 && (
                <span className="hero-rating" style={{ color: theme.accent }}>
                  ★ {featured.vote_average.toFixed(1)}
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="genre-main">
        <div className="genre-header">
          <div>
            <span className="genre-eyebrow-label" style={{ color: theme.accent }}>Browse Collection</span>
            <h2 className="genre-title">{name} Films</h2>
          </div>
          <div className="genre-sort">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`sort-btn ${sort === opt.value ? 'sort-btn--active' : ''}`}
                onClick={() => setSort(opt.value)}
                style={sort === opt.value ? { background: theme.accent, borderColor: theme.accent } : {}}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="state-error">Failed to load films.</div>}

        <div className="movies-grid">
          {loading
            ? Array.from({ length: 18 }).map((_, i) => <SkeletonCard key={i} />)
            : movies.slice(1).map((movie, i) => (
                <MovieCard key={movie.id} movie={movie} index={i} />
              ))
          }
        </div>
      </div>
    </div>
  )
}

export default Genre