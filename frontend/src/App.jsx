import { useState, useEffect } from 'react'
import { appConfig } from './config'
import LoginPage from './pages/LoginPage'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [files, setFiles] = useState([])

  const headers = { Authorization: `Bearer ${token}` }

  const fetchFiles = () => {
    fetch(`${appConfig.apiUrl}${appConfig.endpoints.files}`, { headers })
      .then(res => res.json())
      .then(data => setFiles(data))
  }

  useEffect(() => { if (token) fetchFiles() }, [token])

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    await fetch(`${appConfig.apiUrl}${appConfig.endpoints.upload}`, {
      method: 'POST',
      headers,
      body: formData
    })
    fetchFiles()
  }

  const handleDelete = async (id) => {
    await fetch(`${appConfig.apiUrl}/files/${id}`, { method: 'DELETE', headers })
    fetchFiles()
  }

  const handleDownload = (id, name) => {
    const url = `${appConfig.apiUrl}/files/download/${id}?token=${token}`
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
  }

  if (!token) return <LoginPage onLogin={handleLogin} />

  return (
    <div>
      <h1>My Cloud</h1>
      <button onClick={handleLogout}>Logout</button>
      <input type="file" onChange={handleUpload} />
      <ul>
        {files.map(f => (
          <li key={f.id}>
            {f.name} ({f.size} bytes)
            <button onClick={() => handleDownload(f.id, f.name)}>Download</button>
            <button onClick={() => handleDelete(f.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App