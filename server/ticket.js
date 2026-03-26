import { createCanvas } from 'canvas'

export async function generateTicketImage(firstName, email) {
  const width = 800
  const height = 400
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Background gradient (gold)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height)
  bgGrad.addColorStop(0, '#DAA520')
  bgGrad.addColorStop(0.5, '#FFD700')
  bgGrad.addColorStop(1, '#DAA520')
  ctx.fillStyle = bgGrad
  roundRect(ctx, 0, 0, width, height, 24)
  ctx.fill()

  // Inner border
  ctx.strokeStyle = '#8B6914'
  ctx.lineWidth = 4
  roundRect(ctx, 16, 16, width - 32, height - 32, 16)
  ctx.stroke()

  // Decorative inner border
  ctx.strokeStyle = 'rgba(139, 0, 0, 0.3)'
  ctx.lineWidth = 2
  ctx.setLineDash([8, 4])
  roundRect(ctx, 24, 24, width - 48, height - 48, 12)
  ctx.stroke()
  ctx.setLineDash([])

  // Corner stars
  const starPositions = [
    [50, 50], [width - 50, 50],
    [50, height - 50], [width - 50, height - 50],
  ]
  ctx.fillStyle = '#8B0000'
  ctx.font = '28px serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (const [x, y] of starPositions) {
    ctx.fillText('★', x, y)
  }

  // Mask emoji
  ctx.font = '48px serif'
  ctx.fillText('🎭', width / 2, 70)

  // Title
  ctx.fillStyle = '#8B0000'
  ctx.font = 'bold 48px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('GOLDEN TICKET', width / 2, 140)

  // Subtitle
  ctx.fillStyle = '#5C4033'
  ctx.font = 'italic 22px Georgia, serif'
  ctx.fillText('The Unmasking — A Masquerade Mystery', width / 2, 180)

  // Divider
  ctx.strokeStyle = '#8B6914'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(100, 200)
  ctx.lineTo(width - 100, 200)
  ctx.stroke()

  // Name
  ctx.fillStyle = '#1a0a0a'
  ctx.font = 'bold 36px Georgia, serif'
  ctx.fillText(firstName, width / 2, 248)

  // Email
  ctx.fillStyle = '#5C4033'
  ctx.font = '20px Georgia, serif'
  ctx.fillText(email, width / 2, 285)

  // Footer message
  ctx.fillStyle = '#8B0000'
  ctx.font = 'italic 18px Georgia, serif'
  ctx.fillText('Present this ticket at the bar for something special', width / 2, 340)

  // Bottom flourish
  ctx.fillStyle = '#5C4033'
  ctx.font = '16px Georgia, serif'
  ctx.fillText('— Admit One —', width / 2, 372)

  return canvas.toBuffer('image/png')
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}
