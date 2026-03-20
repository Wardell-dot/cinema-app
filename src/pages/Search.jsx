import { useSearchParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import MovieCard from '../components/MovieCard'
import SkeletonCard from '../components/SkeletonCard'

const API_KEY = import.meta.env.VITE_TMDB_KEY
const BASE = 'https://api.themoviedb.org/3'

function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const url = query
    ? `${BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
    : null

  const { data, loading, error } = useFetch(url)
  const movies = data?.results || []

  return (
    <div className="search-page">
      <div className="search-header">
        <h1 className="search-title">
          {query ? <>Results for <em>{query}</em></> : 'Search'}
        </h1>
        {!loading && query && (
          <span className="search-count">{movies.length} films</span>
        )}
      </div>

      {error && <div className="state-error">Search failed.</div>}

      {!loading && !error && movies.length === 0 && query && (
        <div className="state-empty">No results for <em>{query}</em></div>
      )}

      <div className="movies-grid">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : movies.map((movie, i) => <MovieCard key={movie.id} movie={movie} index={i} />)
        }
      </div>
    </div>
  )
}

export default Search