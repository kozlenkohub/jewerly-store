import express from 'express';
import { addProduct, getProducts } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/add', addProduct);
productRouter.get('/', getProducts);

productRouter.get('/:category', getProducts);

export default productRouter;
