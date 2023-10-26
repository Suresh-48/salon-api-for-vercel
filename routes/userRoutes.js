import { Router } from "express";
import {
  AddShopId,
  findUserList,
  getAllUser,
  getOneUser,
  Login,
  OTPVerification,
  userCreate,
  userDelete,
  userUpdate,
  getUserShopList,
  createOtpData,
} from "../controllers/userController.js";

const router = Router();

router.route("/").post(userCreate).get(getAllUser);
router.route("/:id").patch(userUpdate).delete(userDelete).get(getOneUser);
router.route("/login").post(Login);
router.route("/otp/verify/:id").patch(OTPVerification);
router.route("/update/shopId/:id").patch(AddShopId);
router.route("/find/get").get(findUserList);
router.route("/get/user/shop/list/:id").get(getUserShopList);
router.route("/otp").post(createOtpData);

export default router;
