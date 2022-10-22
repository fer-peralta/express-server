const socketClient = io()

const sendButton = document.querySelector("#sendButton")
const inputTitle = document.querySelector("#title")
const inputPrice = document.querySelector("#price")
const inputThumbnail = document.querySelector("#thumbnail")
const tableBody = document.querySelector("#tableBody")

let jsonContent = []



socketClient.on("messageFromServer",(data)=>{
    console.log(data)
})

socketClient.on("sendHistorical", (data) =>{
    console.warn(data)
    fetch("../../file.txt")
    .then(response => response.json())
        .then(data =>{
            jsonContent = data
            console.log(tableBody)
            jsonContent.forEach(content =>{
                let tr = document.createElement('tr')
                tr.innerHTML = 
                    `        
                        <td>${content.id}</td>
                        <td>${content.title}</td>
                        <td>${content.price}</td>
                        <td>${content.thumbnail}</td>
                    `
                    tableBody.appendChild(tr)
            })
        })
})

sendButton.addEventListener("click", () => {
    
    socketClient.emit("addProduct")
})



// socketClient.emit("message", "Hola Server")