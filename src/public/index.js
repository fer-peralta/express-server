// * Socket Client up
const socketClient = io()

// * constant/variables
const sendButton = document.querySelector("#sendButton")
const inputName = document.querySelector("#name")
const inputPrice = document.querySelector("#price")
const inputUrl = document.querySelector("#url")
const tableBody = document.querySelector("#tableBody")
const messageInput = document.querySelector('#messageInput')
const historicalChat = document.querySelector('#historicalChat')
const sendMessage = document.querySelector('#sendMessage')
const form = document.querySelector("#form")
let user 

// * Connected
socketClient.on("messageFromServer",(data)=>{
    console.log(data)
})

// * Sending the products to the server
sendButton.addEventListener("click", (evt) => {
    evt.preventDefault()
    const newProduct = {
        name: inputName.value,
        price: inputPrice.value,
        url: inputUrl.value
    }
    socketClient.emit("newProduct", newProduct)
    form.reset()
})

// * Receiving the list of products and showing them in the screen
socketClient.on("sendProductList", data =>{
    let list = ""
    data.forEach(e => {
        list += 
            `<tr>
                <td>${e.name}</td>
                <td>${e.price}</td>
                <td>${e.url}</td>
            </tr>`
    });
    tableBody.innerHTML = list
})

// * Creating the user
Swal.fire({
    title: 'Bienvenido/a',
    text:'Ingrese su Email',
    input:'email',
    allowOutsideClick: false,
    allowEscapeKey: false
}).then(res=>{
    user=res.value
})

// * Sending a new message
sendMessage.addEventListener('click', ()=>{
    socketClient.emit('newMessage',{
        userEmail: user,
        timestamp: new Date(),
        message: messageInput.value
    })
    messageInput.value=''
})

// * Receiving the messages and showing them in the screen
socketClient.on('chat',(data)=>{
    let element = ''
    data.forEach(e => {
        element += `
                    <p class='text-success'>
                        <strong class='text-primary'>${e.userEmail}</strong> 
                        <strong class='text-danger'>${e.timestamp}</strong>: ${e.message}
                    </p>
                    `
    });
    historicalChat.innerHTML = element
})
