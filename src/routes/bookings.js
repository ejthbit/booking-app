import express from 'express'
import * as Booking from '../controllers/bookings'
export const ID = '/bookings'
const router = express.Router()

router.get('/', (_req, res) => {
    res.json({ message: 'Welcome to booking endpoint' })
})
router.post('/booking', Booking.create)

/**
 * @openapi
 * /bookings/getBookings:
 *   get:
 *     description: Retrieve a list of existing bookings
 *     responses:
 *       200:
 *         description: Returns array of bookings
 *         content:
 *            application/json:
 *              schema:
 *                type:object:
 *                 properties:
 *                      id:
 *                          type:string
 *                      contact:
 *                          type:string
 *                      name:
 *                          type:string
 */
router.get('/getBookings', Booking.findAll)
router.delete('/booking/:id', Booking.delete)
router.put('/booking/:id', Booking.update)

export default router
