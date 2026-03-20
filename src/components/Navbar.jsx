import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { label: 'Trending', to: '/' },
  { label: 'Horror', to: '/genre/27/Horror' },
  { label: 'Drama', to: '/genre/18/Drama' },
  { label: 'Thriller', to: '/genre/53/Thriller' },
  { label: 'Watchlist', to: '/watchlist' },
]

function Navbar() {
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

 useEffect(() => {
  const onScroll = () => {
    setScrolled(window.scrollY > 20)
  }
  window.addEventListener('scroll', onScroll)
  return () => window.removeEventListener('scroll', onScroll)
}, [])

useEffect(() => {
  const closeMenu = () => setMenuOpen(false)
  closeMenu()
}, [location.pathname])

useEffect(() => {
  const handleClickOutside = (e) => {
    if (menuOpen && !e.target.closest('.mobile-nav') && !e.target.closest('.mobile-menu-btn')) {
      setMenuOpen(false)
    }
  }
  
  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [menuOpen])
    
  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    setQuery('')
  }

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to.split('?')[0])
  }

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">◆</span>
          Cinema
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search films..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit" className="navbar-search-btn">Search</button>
        </form>

        <nav className="navbar-nav">
          {NAV_LINKS.map(link => (
            <Link
              key={link.label}
              to={link.to}
              className={`navbar-link ${isActive(link.to) ? 'navbar-link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${menuOpen ? 'hamburger--open' : ''}`} />
        </button>
      </div>

      <div className={`mobile-nav ${menuOpen ? 'mobile-nav--open' : ''}`}>
        <form className="mobile-nav-search" onSubmit={handleSearch}>
          <input
            type="text"
            className="mobile-nav-search-input"
            placeholder="Search films..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit" className="mobile-nav-search-btn">Search</button>
        </form>
        
        <button
          className="mobile-nav-close"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>
        
        {NAV_LINKS.map(link => (
          <Link
            key={link.label}
            to={link.to}
            className={`mobile-nav-link ${isActive(link.to) ? 'mobile-nav-link--active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  )
}

export default Navbar