


const Order = require('../models/order');
const cashfree = require('../config/cashfreeConfig');
const User= require('../models/UserModel')

const createOrder = async (req, res) => {
    const { orderAmount, userId, email, customer_phone } = req.body;

    try {
        const orderId = 'order_' + new Date().getTime();
        const request = {
            "order_amount": orderAmount,
            "order_currency": "INR",
            "order_id": orderId,
            "customer_details": {
                "customer_id": String(userId),
                "customer_email": email,
                "customer_phone": customer_phone
            },
            "order_meta": {
                "return_url": "https://www.cashfree.com/devstudio/preview/pg/web/inlineCheckout?order_id={order_id}"
            },
            "order_note": "Sample Order Note"
        };
        const response = await cashfree.PGCreateOrder(request);
        const paymentSessionId = response.data.payment_session_id;
        

        const newOrder = await Order.create({
            orderId,
            orderAmount,
            email: email,
            status: 'PENDING',
            paymentSessionId
        });
      //  const updatedStatus = await updateOrderStatus(orderId);
        res.json({
            success: true,
            orderId: newOrder.orderId,
            paymentSessionId: paymentSessionId,
            redirectUrl: `https://sandbox.cashfree.com/pgapp/v1/session/${paymentSessionId}`
        });

    } catch (error) {
        res.status(500).json({ message: 'Order creation failed', error: error.response?.data || error.message });
    }
};


const handleWebhook = async (req, res) => {
    const event = req.body;
    const keys = Object.keys(event);
    if (keys.length === 0) {
        return res.status(400).json({ message: "Invalid webhook format" });
    }
    const orderId = event.orderID;
    console.log(orderId);
    try {
        const paymentResponse = await cashfree.PGOrderFetchPayments(orderId);
        const paymentTransactions = paymentResponse.data;
        if (!Array.isArray(paymentTransactions)) {
            return res.status(500).json({ message: 'Invalid payment transactions format' });
        }
        let finalStatus = 'FAILED';
        if (paymentTransactions.some(tx => tx.payment_status === "SUCCESS")) {
            finalStatus = 'SUCCESS';
        } else if (paymentTransactions.some(tx => tx.payment_status === "PENDING")) {
            finalStatus = 'PENDING';
        }
        const orderToUpdate = await Order.findOne({ where: { orderId } });
        if (!orderToUpdate) {
            return res.status(404).json({ message: 'Order not found' });
        }
        orderToUpdate.status = finalStatus;
        console.log("the final status is "+finalStatus)
        await orderToUpdate.save();
       // res.status(200).json({ message: 'Webhook processed successfully' });
        res.status(200).json(finalStatus);
    } catch (error) {
        res.status(500).json({ message: 'Error processing webhook', error: error.message });
    }
    
};

  


const getOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await Order.findOne({ where: { orderId } });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ 
            orderId: order.orderId, 
            paymentStatus: order.status 
        });
    } catch (error) {
        //console.error('Error fetching order status:', error);
        res.status(500).json({ message: 'Error fetching status', error });
    }
};

const getOrderStatus2= async (req,res)=>{
    const {email}= req.params;
    try{
        const order = await Order.findOne({where:{email}});
        //console.log(order);
        if (!order) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(order.status==='SUCCESS'){
            res.status(200).json({ message: 'true'});
        }
        else{
            res.status(200).json({ message: 'false' });
        }
    }catch(e){
        res.status(500).json({ message: 'Error fetching status', error });

    }

}
const getOrderIDFromEmail= async (req,res)=>{
    const {email}= req.params;
    try{
        const order = await Order.findOne({where:{email}});
        console.log("this is order"+order);
        if (!order) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(order.orderId);
      
    }catch(e){
        res.status(500).json({ message: 'Error fetching status', error });

    }

}


module.exports = { createOrder, getOrderStatus, handleWebhook,getOrderStatus2,getOrderIDFromEmail };