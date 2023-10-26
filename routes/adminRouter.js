import {Router} from 'express';
import { createAdmin, deleteAdminDetails, getAdminDetails, getAllAdmin, updateAdminDetails,getAdminShopDetails } from '../controllers/adminController.js';
const router = Router();

router.route('/').post(createAdmin);
router.route('/:id').put(updateAdminDetails).get(getAdminDetails).delete(deleteAdminDetails);
router.route('/shop/details/:id').get(getAdminShopDetails);
router.route("/get/all").get(getAllAdmin);

export default router;
