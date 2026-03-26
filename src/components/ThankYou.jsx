function ThankYou({ firstName }) {
  return (
    <section className="card thankyou" aria-labelledby="thanks-heading">
      <div className="confetti" aria-hidden="true">
        <span>🎭</span>
        <span>✨</span>
        <span>🎉</span>
        <span>🥂</span>
        <span>🎭</span>
      </div>

      <h2 id="thanks-heading" className="card-title">
        Thank You, {firstName}!
      </h2>

      <div className="thankyou-content">
        <p>
          Your answer has been submitted successfully. The mystery is one step
          closer to being solved!
        </p>
        <p className="highlight-text">
          <strong>Stand by!</strong> If you are the first from your bus to
          submit the correct answer, you will receive a{' '}
          <strong>golden ticket</strong> via email.
        </p>
        <p>
          Present your golden ticket at the bar for something special.
        </p>
      </div>

      <div className="golden-ticket-preview" aria-hidden="true">
        <div className="ticket">
          <span className="ticket-text">GOLDEN TICKET</span>
          <span className="ticket-star">★</span>
        </div>
      </div>
    </section>
  )
}

export default ThankYou
