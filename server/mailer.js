import nodemailer from 'nodemailer'

// Configure your SMTP transport via environment variables:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
//
// Example for Gmail:
//   SMTP_HOST=smtp.gmail.com  SMTP_PORT=587
//   SMTP_USER=you@gmail.com   SMTP_PASS=your-app-password
//   SMTP_FROM="The Unmasking <you@gmail.com>"
//
// For local dev/testing without real email, set SMTP_HOST=ethereal
// and it will use Ethereal (fake SMTP that lets you preview emails).

let transporterPromise = null

async function getTransporter() {
  if (transporterPromise) return transporterPromise

  transporterPromise = (async () => {
    const host = process.env.SMTP_HOST
    const port = parseInt(process.env.SMTP_PORT || '587', 10)
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS

    if (!host || host === 'ethereal') {
      // Create an Ethereal test account for dev
      const testAccount = await nodemailer.createTestAccount()
      console.log('📧 Using Ethereal test email account')
      console.log(`   Preview URL base: https://ethereal.email`)
      return nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass },
      })
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })
  })()

  return transporterPromise
}

export async function sendTicketEmail(to, firstName, ticketImageBuffer) {
  const transporter = await getTransporter()
  const from = process.env.SMTP_FROM || '"The Unmasking" <noreply@theunmasking.com>'

  const info = await transporter.sendMail({
    from,
    to,
    subject: `🎭 Your Golden Ticket, ${firstName}!`,
    html: `
      <div style="font-family: Georgia, serif; text-align: center; background: #1a0a0a; color: #f5e6d3; padding: 40px 20px;">
        <h1 style="color: #FFD700; font-size: 28px;">Congratulations, ${firstName}!</h1>
        <p style="font-size: 18px; color: #c4a882;">You were the first from your bus to solve the mystery.</p>
        <p style="font-size: 18px;">Your <strong style="color: #FFD700;">Golden Ticket</strong> is attached below.</p>
        <p style="font-size: 16px; color: #C41E3A; margin-top: 24px;">
          Present this at the bar for something special!
        </p>
        <img src="cid:golden-ticket" alt="Your Golden Ticket" style="max-width: 100%; margin-top: 24px; border-radius: 12px;" />
        <p style="font-size: 14px; color: #c4a882; margin-top: 32px;">— The Unmasking 🎭 —</p>
      </div>
    `,
    attachments: [
      {
        filename: 'golden-ticket.png',
        content: ticketImageBuffer,
        cid: 'golden-ticket',
      },
    ],
  })

  // Log Ethereal preview URL if using test account
  const previewUrl = nodemailer.getTestMessageUrl(info)
  if (previewUrl) {
    console.log(`📧 Preview golden ticket email: ${previewUrl}`)
  }
}
