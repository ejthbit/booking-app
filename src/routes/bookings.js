import express from 'express'
import * as Booking from '../controllers/bookings'

export const ID = '/bookings'
const router = express.Router()

router.post('/booking', Booking.create)
router.get('/getBookings/:from?/:to?', Booking.findAll)
router.get('/booking/:id', Booking.findBookingById)
router.delete('/booking/:id', Booking.deleteBooking)
router.put('/booking/:id', Booking.updateBooking)

export default router
