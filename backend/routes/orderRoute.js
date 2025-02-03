import express from 'express';
import {
  placeOrder,
  placeOrderStripe,
  userOrders,
  getLastOrder,
  getOrders,
} from '../controllers/orderController.js';
import auth from '../middleware/auth.js';
import optionalAuth from '../middleware/optionalAuth.js'; // Create this middleware

const orderRouter = express.Router();

orderRouter.post('/', optionalAuth, placeOrder); // Optional auth
orderRouter.post('/stripe', optionalAuth, placeOrderStripe); // Optional auth
orderRouter.get('/myorders', auth, userOrders);
orderRouter.get('/lastorder', auth, getLastOrder);
orderRouter.get('/', getOrders);

export default orderRouter;
