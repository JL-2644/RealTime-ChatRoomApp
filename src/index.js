const express = require('express')
const path = require('path')
const http = require('http')
const socketIO = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const port = process.env.PORT || 3000
const publicDirPath = path.join(__dirname, '../public')

app.use(express.static(publicDirPath))

io.on('connection', (socket) => {
    console.log('New websocket connection')

    socket.emit('message', 'Welcome')
    // Send message to all users except this one
    socket.broadcast.emit('message', 'A new user has joined')
    socket.on('submission', (message) => {
        // emits to all connections, use socket for particular connection
        io.emit('message', message)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left')
    })

    socket.on('sendLocation', (obj) => {
        io.emit('message', `https://google.com/maps?q=${obj.latitude},${obj.longitude}`)
    })
})

server.listen(port, () => {
    console.log(`Starting on port ${port}`)
})