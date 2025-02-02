import express from 'express';
import {
  placeOrder,
  placeOrderStripe,
  userOrders,
  getLastOrder,
  getOrders,
} from '../controllers/orderController.js';
import auth from '../middleware/auth.js';

const orderRouter = express.Router();

orderRouter.post('/', auth, placeOrder);
orderRouter.post('/stripe', auth, placeOrderStripe);
orderRouter.get('/myorders', auth, userOrders);
orderRouter.get('/lastorder', auth, getLastOrder);
orderRouter.get('/', getOrders);

export default orderRouter;
