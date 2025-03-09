const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const cors = require('cors')

const app = express();
app.use(cors()); //fe be communication

const server = http.createServer(app)
const wsServer = new WebSocket.Server({ server })

let doc = ''

wsServer.on('connection', (socket) => {

  //on connection send data to user
  socket.send(JSON.stringify({ type: 'init', data: doc}))

  socket.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message)
      if(parsedMessage.type === 'update') {
        doc = parsedMessage.data
        wsServer.clients.forEach((client) => {
          if(client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'update', data: doc}))
          }
        })
      }
    } catch (error) {
      console.log('error', error)
    }
  })

  socket.on('close', () => {
    console.log('editor disconnected')
  })
})

const PORT = 5000
server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`)
})