import { Link } from 'react-router-dom'
import { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

const IMG_BASE = 'https://image.tmdb.org/t/p/w500'

function MovieCard({ movie, index = 0 }) {
  const [imgError, setImgError] = useState(false)
  const year = movie.release_date ? movie.release_date.slice(0, 4) : ''
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : ''
  const posterUrl = movie.poster_path && !imgError ? `${IMG_BASE}${movie.poster_path}` : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
    >
      <Link to={`/movie/${movie.id}`} className="movie-card">
        <div className="movie-card-poster">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="movie-card-img"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="movie-card-no-poster"><span>{movie.title}</span></div>
          )}
          {rating && (
            <div className="movie-card-rating">★ {rating}</div>
          )}
          <div className="movie-card-overlay">
            <span className="movie-card-view">View Film</span>
          </div>
        </div>
        <div className="movie-card-info">
          <h3 className="movie-card-title">{movie.title}</h3>
          {year && <span className="movie-card-year">{year}</span>}
        </div>
      </Link>
    </motion.div>
  )
}

export default MovieCard