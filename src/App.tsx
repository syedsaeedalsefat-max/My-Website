import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from './context/ThemeContext'
import BackgroundFX from './components/BackgroundFX'
import MusicPlayer from './components/MusicPlayer'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Achievements from './components/Achievements'
import Academics from './components/Academics'
import Gallery from './components/Gallery'
import ExtraCurricular from './components/ExtraCurricular'
import Footer from './components/Footer'

export default function App() {
  const { theme } = useTheme()

  return (
    <div className="relative min-h-screen text-fg">
      <BackgroundFX />
      <MusicPlayer />
      <div className="relative z-10">
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.main
            key={theme}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Hero />
            <About />
            <Skills />
            <Achievements />
            <Academics />
            <Gallery />
            <ExtraCurricular />
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
    </div>
  )
}
