import express from 'express'
import * as bookingController from '../controllers/bookingsController'
import validate from '../middlewares/validate'
import { bookingValidationSchema } from '../validationSchemas/bookingValidationSchema'

export const ID = '/bookings'
const router = express.Router()

router
    .post('/booking', validate(bookingValidationSchema), bookingController.create)
    .get('/getBookings/:from?/:to?', bookingController.findAll)
    .get('/getAvailableSlots/:beginningOfDay/:endOfDay', bookingController.getAvailableTimeSlotsForDay)
    .get('/booking/:id', bookingController.findBookingById)
    .delete('/booking/:id', bookingController.deleteBooking)
    .put('/booking/:id', bookingController.updateBooking)

export default router
