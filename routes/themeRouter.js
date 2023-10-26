import { Router } from 'express';
import { themeCreate, themeGet, themeUpdate } from '../controllers/themeController.js';
const router = Router();
router.route('/').post(themeCreate);
router.route('/:id').patch(themeUpdate).get(themeGet);

export default router;
