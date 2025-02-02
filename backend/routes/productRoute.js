import express from 'express';
import {
  addProduct,
  getProducts,
  insertProducts,
  getProductById,
  createReview,
} from '../controllers/productController.js';
import auth from '../middleware/auth.js';

const productRouter = express.Router();

productRouter.post('/add', addProduct);
productRouter.get('/', getProducts);
productRouter.get('/:category', getProducts);
productRouter.post('/insert', insertProducts); // Route to insert products
productRouter.get('/get/:id', getProductById); // Route to get product by ID
productRouter.post('/review', auth, createReview);

export default productRouter;
