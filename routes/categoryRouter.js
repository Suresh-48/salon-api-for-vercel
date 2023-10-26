import { Router } from 'express';
import {
  categoryCreate,
  categoryDelete,
  categoryGetAll,
  categoryGetOne,
  categoryUpdate,
} from '../controllers/categoryController.js';
const router = Router();

router.route('/').post(categoryCreate).get(categoryGetAll);
router.route('/:id').patch(categoryUpdate).delete(categoryDelete).get(categoryGetOne);

export default router;
