function Premise({ firstName, onBegin }) {
  return (
    <section className="card premise" aria-labelledby="premise-heading">
      <h2 id="premise-heading" className="card-title">
        Welcome, {firstName}!
      </h2>

      <div className="premise-text">
        <p>
          Welcome to <strong>The Unmasking!</strong>
        </p>
        <p>
          Before we begin our epic journey, we need your help to solve a murder.
        </p>
        <p>
          Listen to the playlist during the trip to decipher clues. The first
          letter of the title of each song spells out who did this horrible
          crime.
        </p>
        <p className="highlight-text">
          The first person from every bus to guess the right answer will be
          presented a <strong>golden ticket</strong>. Show this to the shuttle volunteer for
          something special.
        </p>
        <p className="closing-text">Good Luck and God Speed!</p>
      </div>

      <button
        type="button"
        className="btn btn-primary"
        onClick={onBegin}
        aria-label="Begin solving the mystery"
      >
        Begin the Investigation
      </button>
    </section>
  )
}

export default Premise
