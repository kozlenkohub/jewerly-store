import express from 'express';
import {
  createFilter,
  getAllFilters,
  getFilterById,
  updateFilter,
  deleteFilter,
  populateFilters,
} from '../controllers/filterController.js';
import upload from '../middleware/multerMiddleware.js';

const filterRouter = express.Router();

filterRouter.post(
  '/create',
  upload.single([
    { name: 'image', maxCount: 1 },
    { name: 'icon', maxCount: 1 },
  ]),
  createFilter,
);
filterRouter.get('/', getAllFilters);
filterRouter.get('/:id', getFilterById);
filterRouter.put('/:id', updateFilter);
filterRouter.delete('/:id', deleteFilter);
filterRouter.post('/populate', populateFilters);

export default filterRouter;
