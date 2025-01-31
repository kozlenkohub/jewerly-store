import express from 'express';

import {
  addToCart,
  getCartItems,
  removeCartItem,
  updateQuantity,
} from '../controllers/cartController.js';
import auth from '../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.post('/add', auth, addToCart);
cartRouter.get('/get', auth, getCartItems);
cartRouter.delete('/remove/:id', auth, removeCartItem);
cartRouter.post('/updateQuantity', auth, updateQuantity);

export default cartRouter;
