// import express from "express";
// import {ContenedorDaoProductos, ContenedorDaoCarritos} from "../daos/index.js"
// import { logger } from "../database/logs/loggers.js";
// import { checkLogin } from "../middlewares/checkLogin.js"
// import { transporterEmail, emailAdmin } from "../messages/email.js"
// import {twilioClient, adminPhone, twilioWhatsapp, adminWhatsapp} from "../messages/sms.js"
// import {UserModel} from "../models/user.models.js"


// const cartsRouter = express.Router()

// const productosApi = ContenedorDaoProductos
// const carritosApi = ContenedorDaoCarritos

// cartsRouter.get('/', checkLogin, async (req, res) => {
//     logger.info(req)
//     const response = await carritosApi.getAll();
//     res.status(200).json(response);
// })

// cartsRouter.post('/', checkLogin, async (req, res) => {
//     const response = await carritosApi.save({ products: [], timestamp: new Date().toLocaleDateString() });
//     const userId = req.user.id
//     req.user.cart = response
//     const update = {cart: response}
//     const opts = { new: true }
//     logger.info(update, userId)
//     const userUpdate = await UserModel.findOneAndUpdate( {_id: userId}, {$set: update}, opts)
//     logger.info(`Se ha creado un carrito de compras al usuario ${userId}`)
//     res.status(200).json({cart:response, message: `Se ha añadido el carrito de compras al usuario ${userId}`});
// })

// cartsRouter.delete('/:id', checkLogin, async (req, res) => {
//     const cartId = req.params.id
//     logger.info("Se ha borrado un carrito de compras")
//     res.status(200).json({response: await carritosApi.deleteById(cartId), message: "Se ha borrado el carrito de compras seleccionado"});
// })

// cartsRouter.get('/:id/products', checkLogin, async (req, res) => {
//     const cartId = req.params.id
//     const carritoResponse = await carritosApi.getById(cartId);
//     if(carritoResponse.error){
//         res.json(carritoResponse);
//     } else{
//         const getData = async()=>{
//             const products = await Promise.all(carritoResponse.products.map(async(element) => {
//                 const productResponse = await productosApi.getById(element);
//                 return productResponse
//             }));
//             res.status(200).json({cart: cartId,products: products});
//         }
//         getData();
//     }
// })

// cartsRouter.post('/:id/products/:productid', checkLogin, async (req, res) => {
//     const cartId = req.params.id
//     const productId = req.params.productid
//     const userId = req.user.id
//     const opts = { new: true }
//     const carritoResponse = await carritosApi.getById(cartId);
//     const update = {cart: carritoResponse}
//     if(carritoResponse.error){
//         res.json({message:`El carrito con id: ${cartId} no fue encontrado`});
//     } else{
//         const productoResponse = await productosApi.getById(productId);
//         if(productoResponse.error){
//             res.json(productoResponse);
//         } else{
//             carritoResponse.products.push(productoResponse);
//             const response = await carritosApi.putById(cartId, carritoResponse);
//             const userUpdate = await UserModel.findOneAndUpdate( {_id: userId}, {$set: update}, opts)
//             res.status(200).json({product:productoResponse, cart: cartId, message:`Se agregó el producto ${productId} en el carrito de compras ${cartId}, correspondiente al usuario ${userId}`});
//         }
//     }
// })

// cartsRouter.delete('/:id/products/:productid', checkLogin, async (req, res) => {
//     const {id, id_prod} = req.params
//     const existe = await carritosApi.getById(id)

//     if(!existe){
//         return res.status(404).send({ message: 'Error el carrito no existe' })
//     }else{
//         const carrito = await carritosApi.deleteOneProd(id, id_prod)
//         res.send(carrito)
//     }
// })

// cartsRouter.post("/checkout",checkLogin,async (req,res)=>{
//     // * To the server
//     const userOrder = req.user.cart
//     twilioClient.messages.create({
//         body:`Nuevo pedido de ${req.user.name, req.user.username}`,
//         from:`whatsapp:${twilioWhatsapp}`,
//         to: `whatsapp:${adminWhatsapp}`,
//         },(error)=>{
//             if(error){
//                 logger.error(`Hubo un error al enviar el whatsapp al admin: ${error}`)
//             } else {
//                 logger.info("Se ha enviado un whatsapp al admin")
//             }
//         }
//     )
//     transporterEmail.sendMail({
//         from:"Server node",
//         to:emailAdmin,
//         subject:`Nuevo pedido de ${req.user.name, req.user.username}`,
//         text:`${JSON.stringify(userOrder)}`
//         },(error)=>{
//             if(error) {
//                 logger.error(`Hubo un error al enviar el mensaje al admin: ${error}`)
//             }else {
//                 logger.info("Se ha realizado un pedido")
//             }
//         }
//     )
//     // * To the buyer
//     twilioClient.messages.create({
//         body:"Tu pedido ha sido recibido y se encuentra en proceso",
//         from:adminPhone,
//         // to:"+541122854280"
//         to:req.user.telephone
//         },(error)=>{
//             if(error){
//                 logger.error(`Hubo un error al enviar el mensaje al cliente: ${error}`)
//             } else {
//                 logger.info("Se ha enviado un mensaje al cliente por su pedido")
//             }
//         }
//     )
//     res.status(400).json({message:`Se ha hecho un pedido del usuario ${req.user.username}`})
// })

// export {cartsRouter}