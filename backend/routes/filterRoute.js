import express from 'express';
import {
  createFilter,
  getAllFilters,
  getFilterById,
  updateFilter,
  deleteFilter,
} from '../controllers/filterController.js';

const filterRouter = express.Router();

filterRouter.post('/create', createFilter);
filterRouter.get('/', getAllFilters);
filterRouter.get('/:id', getFilterById);
filterRouter.put('/:id', updateFilter);
filterRouter.delete('/:id', deleteFilter);

export default filterRouter;
