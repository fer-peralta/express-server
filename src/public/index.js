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
    title: '¡Hola nuevo usuario!',
    html: `
        <input type="email" id="email" class="swal2-input" placeholder="email">
        <input type="text" id="firstName" class="swal2-input" placeholder="Nombre">
        <input type="text" id="lastName" class="swal2-input" placeholder="Apellido">
        <input type="number" id="age" class="swal2-input" placeholder="Edad">
        <input type="text" id="alias" class="swal2-input" placeholder="Alias">
        <input type="text" id="avatar" class="swal2-input" placeholder="Avatar">
    `,
    confirmButtonText: 'Iniciar sesión',
    focusConfirm: false,
    allowOutsideClick: false,
    preConfirm: () => {
      const email = Swal.getPopup().querySelector('#email').value
      const firstName = Swal.getPopup().querySelector('#firstName').value
      const lastName = Swal.getPopup().querySelector('#lastName').value
      const age = Swal.getPopup().querySelector('#age').value
      const alias = Swal.getPopup().querySelector('#alias').value
      const avatar = Swal.getPopup().querySelector('#avatar').value
      if (!email || !firstName || !lastName || !age || !alias) {
        Swal.showValidationMessage(`Por favor, llena todos los campos`)
      }
      return { email, firstName, lastName, age, alias, avatar }
    }
  }).then((result) => {
    Swal.fire(`
    Bienvenid@ ${result.value.firstName}
    `.trim())
    console.log(result.value)
    user = result.value
  })

// * Sending a new message
sendMessage.addEventListener('click', ()=>{
    socketClient.emit('newMessage',{
        author: user,
        text: messageInput.value,
        timestamp: new Date().toLocaleString()
    })
    messageInput.value=''
})

const authorSchema = new normalizr.schema.Entity("authors", {}, {idAttribute: "email"})
const messageSchema = new normalizr.schema.Entity("messages", {author:authorSchema})
const chatSchema = new normalizr.schema.Entity("chat", {messages:[messageSchema]}, {idAttribute:"id"})


// * Receiving the messages and showing them in the screen
socketClient.on('chat', async(dataMsg)=>{
    const normalData = normalizr.denormalize(dataMsg.result, chatSchema, dataMsg.entities)
    let messageElements = ""
    normalData.messages.forEach(msg => {
        messageElements += `
                    <p class='text-success'>
                        <strong class='text-primary'>${msg.author.alias}</strong> 
                        <strong class='text-danger'>${msg.timestamp}</strong>: ${msg.text}
                    </p>
                    `
    })
    historicalChat.innerHTML = messageElements
})

socketClient.on("compressPercent", porcentajeCompresion=>{
    console.log(`El porcentaje de compresión actual es ${porcentajeCompresion}`)
})
