
import axios from 'axios';

export const createOrder = (orderData) => axios.post('http://localhost:3001/order/create', orderData);
export const fetchStatusFromCashfree=(orderID)=>axios.post('http://localhost:3001/order/webhook',orderID);
export const fetchStatusFromDB = (orderID) =>axios.get(`http://localhost:3001/order/status/${orderID}`);
export const fetchStatusFromDB2 = (email) =>axios.get(`http://localhost:3001/order/status2/${email}`);

  
