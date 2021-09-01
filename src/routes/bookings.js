import express from 'express'
import * as bookingController from '../controllers/bookingsController'
import validate from '../middlewares/validate'
import { bookingValidationSchema } from '../validationSchemas/bookingValidationSchema'
import verifyToken from '../middlewares/checkAuth'

export const ID = '/bookings'
const router = express.Router()

router
    .post('/booking', validate(bookingValidationSchema), bookingController.create)
    .get('/getBookings/:from?/:to?', bookingController.findAll)
    .get('/getBookings/:from?/:to?/:workplace?', bookingController.findAllByCriteria)
    .get('/getAvailableSlots/:beginningOfDay/:endOfDay/:workplace', bookingController.getAvailableTimeSlotsForDay)
    .get('/booking/:id', bookingController.findBookingById)
    .get('/getDoctorServicesForMonth/:month/:workplace?', bookingController.getDoctorServicesForMonth)
    .delete('/booking/:id', verifyToken, bookingController.deleteBooking)
    .put('/booking/:id', verifyToken, bookingController.updateBooking)

export default router
