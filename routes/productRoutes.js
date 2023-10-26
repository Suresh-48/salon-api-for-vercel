import { Router } from 'express';
import {
  getSinleProduct,
  productCategoriesList,
  productCreate,
  productDelete,
  productGetAll,
  productGetOne,
  productTypesUpdate,
  productUpdate,
  updateProductOffer,
} from '../controllers/productController.js';

const router = Router();

router.route('/').post(productCreate).get(productGetAll);
router.route('/:id').patch(productUpdate).get(productGetOne).delete(productDelete);
router.route('/types/:id').get(productCategoriesList);
router.route('/single/product/:id').get(getSinleProduct);
router.route('/update/offer/:id').patch(updateProductOffer)
router.route("/types/update/:id").patch(productTypesUpdate);

export default router;
