import express from 'express'
import rateLimit from 'express-rate-limit'
import * as configurationController from '../controllers/configurationController'

const contactFormLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many messages, please try again later' },
})

export const ID = '/configuration'
const router = express.Router()

/**
 * @swagger
 * /configuration/getAmbulances:
 *   get:
 *     summary: Get all ambulances (workplaces)
 *     tags: [Configuration]
 *     responses:
 *       200:
 *         description: List of ambulances
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Workplace'
 *                 status:
 *                   type: integer
 */

/**
 * @swagger
 * /configuration/getDoctors/{workplaceId}:
 *   get:
 *     summary: Get doctors for a specific workplace
 *     tags: [Configuration]
 *     parameters:
 *       - in: path
 *         name: workplaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Workplace ID
 *     responses:
 *       200:
 *         description: List of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Doctor'
 *                 status:
 *                   type: integer
 */

/**
 * @swagger
 * /configuration/getBookingCategories/{selectedDoctorId}:
 *   get:
 *     summary: Get booking categories, optionally filtered by doctor
 *     tags: [Configuration]
 *     parameters:
 *       - in: path
 *         name: selectedDoctorId
 *         required: false
 *         schema:
 *           type: integer
 *         description: Doctor ID to filter categories
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                 status:
 *                   type: integer
 */

/**
 * @swagger
 * /configuration/contactForm/sendMessage:
 *   post:
 *     summary: Send a message via the contact form
 *     tags: [Configuration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [from, name, text]
 *             properties:
 *               from:
 *                 type: string
 *                 format: email
 *                 description: Sender email address
 *               name:
 *                 type: string
 *               text:
 *                 type: string
 *               subject:
 *                 type: string
 *               ambulance:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent successfully
 */

/**
 * @swagger
 * /configuration/getAnnouncements:
 *   get:
 *     summary: Get all announcements
 *     tags: [Configuration]
 *     responses:
 *       200:
 *         description: List of announcements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Announcement'
 *                 status:
 *                   type: integer
 */

router
    .post('/contactForm/sendMessage', contactFormLimiter, configurationController.sendMessage)
    .get('/getAmbulances', configurationController.getAmbulances)
    .get('/getDoctors/:workplaceId', configurationController.getDoctors)
    .get('/getBookingCategories/:selectedDoctorId?', configurationController.getBookingCategories)
    .get('/getAnnouncements', configurationController.getAnnouncements)

export default router
