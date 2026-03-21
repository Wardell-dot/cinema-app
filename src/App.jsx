import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Search from './pages/Search'
import MovieDetail from './pages/MovieDetail'
import Genre from './pages/Genre'
import Watchlist from './pages/Watchlist'

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/search" element={<PageWrapper><Search /></PageWrapper>} />
        <Route path="/movie/:id" element={<PageWrapper><MovieDetail /></PageWrapper>} />
        <Route path="/genre/:id/:name" element={<PageWrapper><Genre /></PageWrapper>} />
        <Route path="/watchlist" element={<PageWrapper><Watchlist /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter basename="/cinema-app/">
      <Navbar />
      <main className="main-content">
        <AnimatedRoutes />
      </main>
    </BrowserRouter>
  )
}

export default App