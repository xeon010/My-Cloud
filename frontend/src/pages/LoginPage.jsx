import { useState } from 'react'
import { appConfig } from '../config'

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData()
    form.append('username', username)
    form.append('password', password)

    const res = await fetch(`${appConfig.apiUrl}/auth/login`, {
      method: 'POST',
      body: form
    })

    if (res.ok) {
      const data = await res.json()
      onLogin(data.access_token)
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div>
      <h1>My Cloud</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  )
}

export default LoginPage