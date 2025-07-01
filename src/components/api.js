
import axios from 'axios';

export const createOrder = (orderData) => axios.post('http://13.51.205.97:3001/order/create', orderData);
export const fetchStatusFromCashfree=(orderID)=>axios.post('http://13.51.205.97:3001/order/webhook',orderID);
export const fetchStatusFromDB = (orderID) =>axios.get(`http://13.51.205.97/:3001/order/status/${orderID}`);
export const fetchStatusFromDB2 = (email) =>axios.get(`http://13.51.205.97:3001/order/status2/${email}`);

  
