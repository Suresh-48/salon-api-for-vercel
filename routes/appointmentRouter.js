import { Router } from 'express';
import {
  DateFilter,
  UserAppointmentList,
  UserBasedDateFilter,
  checkAppointment,
  createAppointment,
  getAdminBooking,
  getMyBooking,
  cancelAppointment,
} from '../controllers/appointmentController.js';
const router = Router();

router.route('/create').post(createAppointment);
router.route('/get/myBooking').get(getMyBooking);
router.route('/get/admin/booking').get(getAdminBooking);
router.route('/check').get(checkAppointment);
router.route('/date/filter').get(DateFilter);
router.route('/userId/:id').get(UserAppointmentList);
router.route('/filter/user/:id').get(UserBasedDateFilter);
router.route('/:id').delete(cancelAppointment);

export default router;
