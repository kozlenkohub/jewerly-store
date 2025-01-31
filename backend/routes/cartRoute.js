import express from 'express';

import {
  addToCart,
  getCartItems,
  removeCartItem,
  updateQuantity,
  syncCart,
} from '../controllers/cartController.js';
import auth from '../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.post('/add', auth, addToCart);
cartRouter.get('/get', auth, getCartItems);
cartRouter.delete('/remove/:id', auth, removeCartItem);
cartRouter.post('/updateQuantity', auth, updateQuantity);
cartRouter.post('/sync', auth, syncCart);

export default cartRouter;
