import './App.css'
import Navbar from './components/layout/navbar'
import Hero from './components/layout/hero'
import Features from './components/layout/features'
import Solutions from './components/layout/solutions'
import Results from './components/layout/results'
import UseCases from './components/layout/useCases'

function App() {
  return (
    <>
      <div>
        <Navbar />
        <Hero />
        <Features />
        <Solutions />
        <Results />
        <UseCases />
      </div>
    </>
  )
}

export default App
