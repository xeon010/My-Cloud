import { useState, useEffect } from 'react'
import { appConfig } from './config'

function App() {
  const [health, setHealth] = useState(null)
  const [postgres, setPostgres] = useState(null)
  const [minio, setMinio] = useState(null)

  useEffect(() => {
    fetch(`${appConfig.apiUrl}${appConfig.endpoints.health}`)
      .then(res => res.json())
      .then(data => setHealth(data.status))
      .catch(() => setHealth('error'))
  }, [])

  useEffect(() => {
    fetch(`${appConfig.apiUrl}${appConfig.endpoints.postgres}`)
      .then(res => res.json())
      .then(data => setPostgres(data.status))
      .catch(() => setPostgres('error'))
  }, [])

  useEffect(() => {
    fetch(`${appConfig.apiUrl}${appConfig.endpoints.minio}`)
      .then(res => res.json())
      .then(data => setMinio(data.status))
      .catch(() => setMinio('error'))
  }, [])

  return (
    <div className="App">
      <h1>MyCloud</h1>
      <p>Backend API status: {health ?? 'checking...'}</p>
      <p>PostgreSQL status: {postgres ?? 'checking...'}</p>
      <p>MinIO status: {minio ?? 'checking...'}</p>
    </div>
  )
}

export default App