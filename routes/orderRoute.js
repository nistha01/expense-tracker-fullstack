const express = require('express');
const route= express.Router();
const orderController = require('../controller/orderController')


route.post('/create',orderController.createOrder);
route.post('/webhook',orderController.handleWebhook);
route.get('/status/:orderId',orderController.getOrderStatus);
route.get('/status2/:email',orderController.getOrderStatus2);
route.get('/getOrderIDFromEmail/:email',orderController.getOrderIDFromEmail)
module.exports=route;