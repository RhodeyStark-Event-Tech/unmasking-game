import { useState, useRef, useEffect, useCallback } from 'react'

function loadLetters(totalLetters) {
  try {
    const stored = sessionStorage.getItem('letters')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length === totalLetters) return parsed
    }
  } catch { /* ignore */ }
  return Array(totalLetters).fill('')
}

function Game({ answer, onSubmit }) {
  // Split answer into words for display
  const words = answer.split(' ')
  const totalLetters = answer.replace(/ /g, '').length

  // Flat array of letter inputs
  const [letters, setLetters] = useState(() => loadLetters(totalLetters))
  const inputRefs = useRef([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('letters', JSON.stringify(letters))
  }, [letters])

  const allFilled = letters.every((l) => l !== '')

  const handleChange = useCallback((index, value) => {
    if (!/^[a-zA-Z]?$/.test(value)) return
    const upper = value.toUpperCase()

    setLetters((prev) => {
      const next = [...prev]
      next[index] = upper
      return next
    })

    if (upper && index < totalLetters - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }, [totalLetters])

  const handleKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !letters[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < totalLetters - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }, [letters, totalLetters])

  const handleSubmit = async () => {
    if (!allFilled || submitting) return
    setSubmitting(true)

    // Reconstruct answer with spaces
    let flatIndex = 0
    const guessWords = words.map((word) => {
      let built = ''
      for (let i = 0; i < word.length; i++) {
        built += letters[flatIndex]
        flatIndex++
      }
      return built
    })
    const guess = guessWords.join(' ')
    await onSubmit(guess)
    setSubmitting(false)
  }

  // Build the grid by words
  let flatIndex = 0

  return (
    <section className="card game" aria-labelledby="game-heading">
      <h2 id="game-heading" className="card-title">Solve the Mystery</h2>
      <p className="card-description">
        Who committed this horrible crime? Enter the letters below.
      </p>

      <div
        className="letter-grid"
        role="group"
        aria-label="Answer input — enter one letter per box"
      >
        {words.map((word, wordIdx) => {
          const wordInputs = word.split('').map((_, charIdx) => {
            const currentIndex = flatIndex++
            return (
              <input
                key={currentIndex}
                ref={(el) => (inputRefs.current[currentIndex] = el)}
                className="letter-input"
                type="text"
                maxLength={1}
                value={letters[currentIndex]}
                onChange={(e) => handleChange(currentIndex, e.target.value)}
                onKeyDown={(e) => handleKeyDown(currentIndex, e)}
                aria-label={`Letter ${charIdx + 1} of word ${wordIdx + 1}`}
                autoCapitalize="characters"
                inputMode="text"
              />
            )
          })

          return (
            <div key={wordIdx} className="word-group">
              {wordInputs}
            </div>
          )
        })}
      </div>

      <button
        type="button"
        className={`btn btn-primary ${!allFilled ? 'btn-disabled' : ''}`}
        onClick={handleSubmit}
        disabled={!allFilled || submitting}
        aria-disabled={!allFilled}
      >
        {submitting ? 'Submitting...' : 'Submit Your Answer'}
      </button>

      {allFilled && (
        <p className="hint-text" role="status">
          All letters filled! Ready to submit.
        </p>
      )}
    </section>
  )
}

export default Game
