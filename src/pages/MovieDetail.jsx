import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import useFetch from '../hooks/useFetch'
import MovieCard from '../components/MovieCard'
import SkeletonCard from '../components/SkeletonCard'

const API_KEY = import.meta.env.VITE_TMDB_KEY
const BASE = 'https://api.themoviedb.org/3'
const IMG = 'https://image.tmdb.org/t/p/w500'
const BACKDROP = 'https://image.tmdb.org/t/p/original'

function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [inWatchlist, setInWatchlist] = useState(false)
  const [showTrailer, setShowTrailer] = useState(false)

  const { data: movie, loading, error } = useFetch(
    `${BASE}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos,similar`
  )

  useEffect(() => {
    const checkWatchlist = () => {
      const saved = JSON.parse(localStorage.getItem('cinema-watchlist') || '[]')
      setInWatchlist(saved.some(m => m.id === parseInt(id)))
    }
    checkWatchlist()
  }, [id])

  const toggleWatchlist = () => {
    const saved = JSON.parse(localStorage.getItem('cinema-watchlist') || '[]')
    if (inWatchlist) {
      const updated = saved.filter(m => m.id !== parseInt(id))
      localStorage.setItem('cinema-watchlist', JSON.stringify(updated))
      setInWatchlist(false)
    } else {
      const entry = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
      }
      localStorage.setItem('cinema-watchlist', JSON.stringify([...saved, entry]))
      setInWatchlist(true)
    }
  }

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="detail-skeleton-backdrop" />
        <div className="detail-skeleton-content">
          <div className="skeleton-line long" />
          <div className="skeleton-line short" />
          <div className="skeleton-line long" />
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return <div className="state-error" style={{ padding: '6rem 2rem' }}>Failed to load film.</div>
  }

  const director = movie.credits?.crew?.find(c => c.job === 'Director')
  const cast = movie.credits?.cast?.slice(0, 6) || []
  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')
  const similar = movie.similar?.results?.slice(0, 6) || []
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null

  return (
    <motion.div
      className="detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {movie.backdrop_path && (
        <div className="detail-backdrop">
          <img
            src={`${BACKDROP}${movie.backdrop_path}`}
            alt={movie.title}
            className="detail-backdrop-img"
          />
          <div className="detail-backdrop-overlay" />
        </div>
      )}

      <div className="detail-content">
        <button className="detail-back" onClick={() => navigate(-1)}>← Back</button>

        <div className="detail-main">
          <motion.div
            className="detail-poster-wrap"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {movie.poster_path ? (
              <img src={`${IMG}${movie.poster_path}`} alt={movie.title} className="detail-poster" />
            ) : (
              <div className="detail-no-poster">{movie.title}</div>
            )}
          </motion.div>

          <motion.div
            className="detail-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="detail-genres">
              {movie.genres?.map(g => (
                <span key={g.id} className="detail-genre">{g.name}</span>
              ))}
            </div>

            <h1 className="detail-title">{movie.title}</h1>

            {movie.tagline && <p className="detail-tagline">{movie.tagline}</p>}

            <div className="detail-meta">
              {movie.release_date && (
                <span className="detail-meta-item">{movie.release_date.slice(0, 4)}</span>
              )}
              {runtime && <span className="detail-meta-item">{runtime}</span>}
              {movie.vote_average > 0 && (
                <span className="detail-meta-item detail-rating">★ {movie.vote_average.toFixed(1)}</span>
              )}
            </div>

            {movie.overview && <p className="detail-overview">{movie.overview}</p>}

            <div className="detail-credits">
              {director && (
                <div className="detail-credit">
                  <span className="credit-label">Director</span>
                  <span className="credit-value">{director.name}</span>
                </div>
              )}
              {cast.length > 0 && (
                <div className="detail-credit">
                  <span className="credit-label">Cast</span>
                  <span className="credit-value">{cast.map(c => c.name).join(', ')}</span>
                </div>
              )}
              {movie.production_countries?.length > 0 && (
                <div className="detail-credit">
                  <span className="credit-label">Country</span>
                  <span className="credit-value">
                    {movie.production_countries.map(c => c.name).join(', ')}
                  </span>
                </div>
              )}
            </div>

            <div className="detail-actions">
              {trailer && (
                <button className="detail-trailer-btn" onClick={() => setShowTrailer(true)}>
                  ▶ Watch Trailer
                </button>
              )}
              <button
                className={`detail-watchlist-btn ${inWatchlist ? 'detail-watchlist-btn--added' : ''}`}
                onClick={toggleWatchlist}
              >
                {inWatchlist ? '✓ In Watchlist' : '+ Watchlist'}
              </button>
            </div>
          </motion.div>
        </div>

        {similar.length > 0 && (
          <div className="similar-section">
            <h2 className="similar-title">More Like This</h2>
            <div className="movies-grid">
              {similar.map((m, i) => (
                <MovieCard key={m.id} movie={m} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      {showTrailer && trailer && (
        <motion.div
          className="trailer-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowTrailer(false)}
        >
          <motion.div
            className="trailer-modal-inner"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <button className="trailer-close" onClick={() => setShowTrailer(false)}>×</button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="Trailer"
              allowFullScreen
              className="trailer-iframe"
            />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default MovieDetail