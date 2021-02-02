const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $location = document.querySelector('#location')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on('locationMessage', (location) => {
    console.log(location)
    const html = Mustache.render(locationTemplate, {
        location: location.url,
        createdAt: moment(location.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})
socket.on('message', (msg) => {
    console.log(msg)
    const html = Mustache.render(messageTemplate, {
        message: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)

})

$messageForm.addEventListener('submit', (e)=> {
    // prevent refresh
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error) {
            return console.log(error)
        }
        console.log('The message was delivered')
    })
})

$location.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser')
    }

    $location.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation',
        {
            longitude: position.coords.longitude, 
            latitude: position.coords.latitude
        }, () => { 
            $location.removeAttribute('disabled')
            console.log("Location delivered")
        })
    })
})