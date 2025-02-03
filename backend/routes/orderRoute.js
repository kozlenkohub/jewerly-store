import express from 'express';
import { placeOrder, userOrders, getLastOrder, getOrders, updateOrderPayment } from '../controllers/orderController.js';
import auth from '../middleware/auth.js';
import optionalAuth from '../middleware/optionalAuth.js';

const orderRouter = express.Router();

orderRouter.post('/', optionalAuth, placeOrder);
orderRouter.post('/payment', updateOrderPayment); // Добавляем новый роут для обработки платежа
orderRouter.get('/myorders', auth, userOrders);
orderRouter.get('/lastorder', auth, getLastOrder);
orderRouter.get('/', getOrders);

export default orderRouter;
