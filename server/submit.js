const ANSWER = 'THE BUTLER DID IT'

// In-memory store of bus winners: { [busNumber]: { firstName, email, timestamp } }
const busWinners = {}

export async function submitAnswer(req, res) {
  const { firstName, email, busNumber, answer } = req.body

  if (!firstName || !email || !busNumber || !answer) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if (answer.toUpperCase() !== ANSWER) {
    return res.status(200).json({ correct: false, message: 'Incorrect answer. Try again!' })
  }

  // Check if this bus already has a winner
  if (busWinners[busNumber]) {
    return res.status(200).json({
      correct: true,
      winner: false,
      message: 'Correct answer! But someone from your bus already claimed the golden ticket.',
    })
  }

  // First correct answer for this bus — they win!
  busWinners[busNumber] = { firstName, email, timestamp: Date.now() }

  console.log(`🎭 WINNER! Bus ${busNumber}: ${firstName} (${email})`)

  return res.status(200).json({
    correct: true,
    winner: true,
    message: 'Congratulations! You are the first from your bus!',
  })
}
