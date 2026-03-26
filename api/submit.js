import { Redis } from '@upstash/redis'

const ANSWER = 'THE BUTLER DID IT'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { firstName, email, busNumber, answer } = req.body

  if (!firstName || !email || !busNumber || !answer) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if (answer.toUpperCase() !== ANSWER) {
    return res.status(200).json({ correct: false, message: 'Incorrect answer. Try again!' })
  }

  // Atomically set the winner only if no one has claimed it yet
  const wasSet = await redis.setnx(`bus-winner:${busNumber}`, JSON.stringify({
    firstName,
    email,
    timestamp: Date.now(),
  }))

  if (!wasSet) {
    return res.status(200).json({
      correct: true,
      winner: false,
      message: 'Correct answer! But someone from your bus already claimed the golden ticket.',
    })
  }

  console.log(`WINNER! Bus ${busNumber}: ${firstName} (${email})`)

  return res.status(200).json({
    correct: true,
    winner: true,
    message: 'Congratulations! You are the first from your bus!',
  })
}
