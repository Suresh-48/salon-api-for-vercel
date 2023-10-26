import { Router } from 'express';

import {createOffers, updateOffers, getAllOffers, getOffers,deleteOffers,getProductOffersList} from "../controllers/offersController.js";

const router = Router();

router.route('/').post(createOffers).get(getAllOffers);
router.route(':/id').patch(updateOffers).get(getOffers).delete(deleteOffers);
router.route('/product/list').get(getProductOffersList);

export default router;