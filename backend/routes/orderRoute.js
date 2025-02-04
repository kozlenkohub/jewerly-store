import express from 'express';
import {
  placeOrder,
  userOrders,
  getLastOrder,
  getOrders,
  updateOrderPayment,
  paymentCallback,
} from '../controllers/orderController.js';
import auth from '../middleware/auth.js';
import optionalAuth from '../middleware/optionalAuth.js';

const orderRouter = express.Router();

orderRouter.post('/', optionalAuth, placeOrder);
orderRouter.post('/payment', optionalAuth, updateOrderPayment);
orderRouter.post('/payment-callback', paymentCallback);

orderRouter.get('/myorders', auth, userOrders);
orderRouter.get('/lastorder', auth, getLastOrder);
orderRouter.get('/', getOrders);

export default orderRouter;
