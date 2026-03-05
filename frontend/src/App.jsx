import { useState, useEffect } from 'react'
import { appConfig } from './config'

function App() {
  const [files, setFiles] = useState([])

  const fetchFiles = () => {
    fetch(`${appConfig.apiUrl}${appConfig.endpoints.files}`)
      .then(res => res.json())
      .then(data => setFiles(data))
  }

  useEffect(() => { fetchFiles() }, [])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    await fetch(`${appConfig.apiUrl}${appConfig.endpoints.upload}`, {
      method: 'POST',
      body: formData
    })
    fetchFiles()
  }

  const handleDelete = async (id) => {
    await fetch(`${appConfig.apiUrl}/files/${id}`, { method: 'DELETE' })
    fetchFiles()
  }

  const handleDownload = (id, name) => {
    const url = `${appConfig.apiUrl}/files/download/${id}`
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
  }

  return (
    <div>
      <h1>My Cloud</h1>
      <input type="file" onChange={handleUpload} />
      <ul>
        {files.map(f => (
          <li key={f.id}>
            {f.name} ({f.size} bytes)
            <button onClick={() => handleDelete(f.id)}>Delete</button>
            <button onClick={() => handleDownload(f.id, f.name)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App