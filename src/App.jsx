import { useState, useCallback } from 'react'
import Registration from './components/Registration'
import Premise from './components/Premise'
import Game from './components/Game'
import ThankYou from './components/ThankYou'
import './App.css'

const ANSWER = 'THE BUTLER DID IT'

function App() {
  const [screen, setScreen] = useState('registration')
  const [user, setUser] = useState({ firstName: '', email: '', busNumber: '' })
  const [winner, setWinner] = useState(null)

  const handleRegister = useCallback((userData) => {
    setUser(userData)
    setScreen('premise')
  }, [])

  const handleBeginGame = useCallback(() => {
    setScreen('game')
  }, [])

  const handleSubmit = useCallback(async (guess) => {
    if (guess.toUpperCase() === ANSWER) {
      try {
        const res = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: user.firstName,
            email: user.email,
            busNumber: user.busNumber,
            answer: guess,
          }),
        })
        const data = await res.json()
        setWinner(data.winner ?? null)
      } catch {
        // Backend not configured yet — winner status unknown
        setWinner(null)
      }
      setScreen('thankyou')
    }
  }, [user])

  return (
    <div className="app">
      <div className="mask-bg" aria-hidden="true" />
      <header className="app-header">
        <img className="mask-icon" src="/assets/cloakedmystery.png" alt="" aria-hidden="true" width="120" height="102" />
        <h1 className="app-title">The Unmasking</h1>
        <p className="app-subtitle">A Masquerade Mystery</p>
      </header>

      <main className="app-content" role="main" aria-live="polite">
        {screen === 'registration' && (
          <Registration onSubmit={handleRegister} />
        )}
        {screen === 'premise' && (
          <Premise firstName={user.firstName} onBegin={handleBeginGame} />
        )}
        {screen === 'game' && (
          <Game answer={ANSWER} onSubmit={handleSubmit} />
        )}
        {screen === 'thankyou' && (
          <ThankYou firstName={user.firstName} winner={winner} />
        )}
      </main>

      <footer className="app-footer" role="contentinfo">
        <p>&copy; ILEA Star Awards 2026: The Unmasking</p>
      </footer>
    </div>
  )
}

export default App
