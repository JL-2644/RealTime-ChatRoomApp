const express = require('express')
const path = require('path')
const http = require('http')
const socketIO = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const port = process.env.PORT || 3000
const publicDirPath = path.join(__dirname, '../public')

app.use(express.static(publicDirPath))

io.on('connection', (socket) => {
    console.log('New websocket connection')

    socket.emit('message', generateMessage('Welcome!'))
    // Send message to all users except this one
    socket.broadcast.emit('message', generateMessage('A new user has joined'))
    socket.on('sendMessage', (message, callback) => {

        const filter = new Filter()

        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        // emits to all connections, use socket for particular connection
        io.emit('message', generateMessage(message))
        // Acknolegment
        callback()
    })

    socket.on('sendLocation', (obj, callback) => {
        io.emit('locationMessage', 
                generateLocationMessage(`https://google.com/maps?q=${obj.latitude},${obj.longitude}`))
        
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left'))
    })
})

server.listen(port, () => {
    console.log(`Starting on port ${port}`)
})