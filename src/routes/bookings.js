import express from 'express'
import rateLimit from 'express-rate-limit'
import * as bookingController from '../controllers/bookingsController'
import validate from '../middlewares/validate'
import { bookingValidationSchema } from '../validationSchemas/bookingValidationSchema'
import verifyToken from '../middlewares/checkAuth'

const bookingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { error: 'Too many booking attempts, please try again later' },
})

export const ID = '/bookings'
const router = express.Router()

/**
 * @swagger
 * /bookings/booking:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingInput'
 *     responses:
 *       200:
 *         description: Booking created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       409:
 *         description: Booking slot already taken
 */

/**
 * @swagger
 * /bookings/getBookings/{from}/{to}/{workplace}:
 *   get:
 *     summary: Get bookings filtered by date range and workplace
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date filter
 *       - in: path
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date filter
 *       - in: path
 *         name: workplace
 *         required: true
 *         schema:
 *           type: integer
 *         description: Workplace ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *           maximum: 500
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Invalid token
 *       403:
 *         description: Token required
 */

/**
 * @swagger
 * /bookings/getAvailableSlots/{beginningOfDay}/{endOfDay}/{timeSlotDuration}/{workplace}:
 *   get:
 *     summary: Get available time slots for a specific day and workplace
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: beginningOfDay
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start of day (ISO8601)
 *       - in: path
 *         name: endOfDay
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End of day (ISO8601)
 *       - in: path
 *         name: timeSlotDuration
 *         required: false
 *         schema:
 *           type: integer
 *           default: 15
 *         description: Duration of each time slot in minutes
 *       - in: path
 *         name: workplace
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of available time slots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TimeSlot'
 */

/**
 * @swagger
 * /bookings/booking/{id}:
 *   put:
 *     summary: Update a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               start:
 *                 type: string
 *                 format: date-time
 *               end:
 *                 type: string
 *                 format: date-time
 *               birthdate:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               category:
 *                 type: integer
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Invalid token
 *       403:
 *         description: Token required
 *   delete:
 *     summary: Delete a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking deleted
 *       401:
 *         description: Invalid token
 *       403:
 *         description: Token required
 */

/**
 * @swagger
 * /bookings/getDoctorServicesForMonth/{month}/{workplace}:
 *   get:
 *     summary: Get doctor services for a specific month and workplace
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *         description: Month identifier
 *       - in: path
 *         name: workplace
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Doctor service found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoctorService'
 *       404:
 *         description: Service not found for given month
 */

/**
 * @swagger
 * /bookings/getDoctorServicesByRange/{start}/{end}/{workplace}:
 *   get:
 *     summary: Get doctor services filtered by date range and workplace
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: start
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: path
 *         name: end
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *       - in: path
 *         name: workplace
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of doctors for the date range
 *       404:
 *         description: No services found
 */

router
    .get('/getDoctorServicesForMonth/:month/:workplace?', bookingController.getDoctorServicesForMonth)
    .get('/getAvailableSlots/:beginningOfDay/:endOfDay/:timeSlotDuration/:workplace', bookingController.getAvailableTimeSlotsForDay)
    .post('/booking', bookingLimiter, validate(bookingValidationSchema), bookingController.create)
    .get('/getBookings/:from/:to/:workplace', verifyToken, bookingController.findAllByCriteria)
    .put('/booking/:id', verifyToken, bookingController.updateBooking)
    .get('/getDoctorServicesByRange/:start/:end/:workplace', bookingController.getDoctorServicesByRange)
    .delete('/booking/:id', verifyToken, bookingController.deleteBooking)

export default router
