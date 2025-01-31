import express from 'express';
import { placeOrder, placeOrderStripe, userOrders } from '../controllers/orderController.js';
import auth from '../middleware/auth.js';

const orderRouter = express.Router();

orderRouter.post('/', auth, placeOrder);
orderRouter.post('/stripe', auth, placeOrderStripe);
orderRouter.get('/myorders', auth, userOrders);

export default orderRouter;
