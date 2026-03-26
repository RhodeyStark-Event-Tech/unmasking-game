import { useState } from 'react'

function Registration({ onSubmit }) {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [busNumber, setBusNumber] = useState('')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!firstName.trim()) newErrors.firstName = 'First name is required'
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!busNumber.trim()) newErrors.busNumber = 'Bus number is required'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSubmit({ firstName: firstName.trim(), email: email.trim(), busNumber: busNumber.trim() })
  }

  return (
    <section className="card registration" aria-labelledby="reg-heading">
      <h2 id="reg-heading" className="card-title">Enter the Masquerade</h2>
      <p className="card-description">Before the mystery begins, we need to know who you are...</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            aria-required="true"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            placeholder="Your first name"
            autoComplete="given-name"
          />
          {errors.firstName && (
            <span id="firstName-error" className="error" role="alert">
              {errors.firstName}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            placeholder="your@email.com"
            autoComplete="email"
          />
          {errors.email && (
            <span id="email-error" className="error" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="busNumber">Bus Number</label>
          <input
            id="busNumber"
            type="text"
            value={busNumber}
            onChange={(e) => setBusNumber(e.target.value)}
            aria-required="true"
            aria-invalid={!!errors.busNumber}
            aria-describedby={errors.busNumber ? 'busNumber-error' : undefined}
            placeholder="e.g. 42"
            autoComplete="off"
          />
          {errors.busNumber && (
            <span id="busNumber-error" className="error" role="alert">
              {errors.busNumber}
            </span>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Unmask the Mystery
        </button>
      </form>
    </section>
  )
}

export default Registration
