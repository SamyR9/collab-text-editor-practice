import React, { useState, useEffect } from 'react'
import './App.css'

const App = () => {
  const [doc, setDoc] = useState('')
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socketConnection = new WebSocket('ws://localhost:5000')
    setSocket(socketConnection)

    socketConnection.onopen = () => {
      console.log('connected')
    }

    socketConnection.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        if(message.type === 'init') {
          setDoc(message.data)
        } else if(message.type === 'update') {
          setDoc(message.data)
        }
      } catch (error) {
        console.log(error)
      }
    }

    socketConnection.onclose = () => {
      console.log('connection closed')
      socketConnection.close()
    }

    socketConnection.onerror = (error) => {
      console.log(error)
    }
    
  }, [])

  const onChange = (e) => {
    const updatedDoc = e.target.value
    setDoc(updatedDoc)
    if(socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'update', data: updatedDoc}))
    }
  }

  return (
    <div className='App'>
      <h1>Document</h1>
      <textarea 
      value={doc}
      onChange={onChange}
      rows='20'
      columns='20'/>
    </div>
  )
}

export default App