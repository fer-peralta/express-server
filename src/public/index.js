// * Socket Client up
const socketClient = io()

// * constant/variables
const sendButton = document.querySelector("#sendButton")
const inputTitle = document.querySelector("#title")
const inputPrice = document.querySelector("#price")
const inputThumbnail = document.querySelector("#thumbnail")
const tableBody = document.querySelector("#tableBody")
const messageInput = document.querySelector('#messageInput')
const historicalChat = document.querySelector('#historicalChat')
const sendMessage = document.querySelector('#sendMessage')
let user 

// * Connected
socketClient.on("messageFromServer",(data)=>{
    console.log(data)
})

// * Sending the products to the server
sendButton.addEventListener("click", () => {
    socketClient.emit("newProduct",{
        title: title.value,
        price: price.value,
        thumbnail: thumbnail.value
    })
})

// * Receiving the list of products and showing them in the screen
socketClient.on("sendProductList", data =>{
    let list = ""
    data.forEach(e => {
        list += 
            `<tr>
                <td>${e.title}</td>
                <td>${e.price}</td>
                <td>${e.thumbnail}</td>
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
}).then(res=>{
    user=res.value
})

// * Sending a new message
sendMessage.addEventListener('click', ()=>{
    socketClient.emit('newMessage',{
        userEmail: user,
        message: messageInput.value,
        hour: new Date()
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
                        <strong class='text-danger'>${e.hour}</strong>: ${e.message}
                    </p>
                    `
    });
    historicalChat.innerHTML = element
})
