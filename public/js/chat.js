const socket = io()

socket.on('message', (msg) => {
    console.log(msg)
})

document.querySelector('#message-form').addEventListener('submit', (e)=> {
    // prevent refresh
    e.preventDefault()

    const message = e.target.elements.message.value

    socket.emit('submission', message)
})

document.querySelector('#location').addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation',
        {
            longitude: position.coords.longitude, 
            latitude: position.coords.latitude
        })
    })
})