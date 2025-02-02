import express from 'express';
import {
  addProduct,
  getProducts,
  insertProducts,
  getProductById,
  createReview,
  deleteProduct,
} from '../controllers/productController.js';
import upload from '../middleware/multerMiddleware.js';

const productRouter = express.Router();

// Public routes
productRouter.get('/', getProducts);
productRouter.get('/:category', getProducts);
productRouter.get('/get/:id', getProductById);

// Protected routes - require authentication
productRouter.post('/add', upload.array('images', 5), addProduct);
productRouter.delete('/delete/:id', deleteProduct);
productRouter.post('/review', createReview);

// Admin only routes
productRouter.post('/insert', insertProducts);

export default productRouter;
