import express from 'express'
import * as adminstrationController from '../controllers/administrationController'
import verifyToken from '../middlewares/checkAuth'
import requireAdmin from '../middlewares/requireAdmin'
import validate from '../middlewares/validate'
import { createDoctorValidationSchema, updateDoctorValidationSchema } from '../validationSchemas/doctorValidationSchema'
import rateLimit from 'express-rate-limit'

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many attempts, please try again later', status: 429 },
})

export const ID = '/administration'
const router = express.Router()

/**
 * @swagger
 * /administration/doctorService:
 *   post:
 *     summary: Create a doctor service record
 *     tags: [Administration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [month, days, workplace]
 *             properties:
 *               month:
 *                 type: string
 *               days:
 *                 type: object
 *               workplace:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Doctor service created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoctorService'
 *       409:
 *         description: Service already exists
 */

/**
 * @swagger
 * /administration/doctorService/{id}:
 *   delete:
 *     summary: Delete a doctor service record
 *     tags: [Administration]
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
 *         description: Doctor service deleted
 *       404:
 *         description: Service not found
 */

/**
 * @swagger
 * /administration/doctorService/{month}/{workplace}:
 *   put:
 *     summary: Update doctor service days for a given month and workplace
 *     tags: [Administration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: workplace
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               days:
 *                 type: object
 *     responses:
 *       200:
 *         description: Doctor service updated
 *       404:
 *         description: Service not found
 */

/**
 * @swagger
 * /administration/signUp:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               default_workplace:
 *                 type: integer
 *                 description: Optional workplace ID to assign as default
 *     responses:
 *       200:
 *         description: User created
 *       409:
 *         description: User with given email already exists
 *       429:
 *         description: Too many attempts
 */

/**
 * @swagger
 * /administration/signIn:
 *   post:
 *     summary: Sign in and receive a JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 exp:
 *                   type: integer
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     default_workplace:
 *                       type: integer
 *       401:
 *         description: Auth failed
 *       404:
 *         description: User not found
 *       429:
 *         description: Too many attempts
 */

/**
 * @swagger
 * /administration/announcements/announcement:
 *   post:
 *     summary: Create a new announcement
 *     tags: [Administration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               author:
 *                 type: string
 *               enabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Announcement created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Announcement'
 *   put:
 *     summary: Update an announcement
 *     tags: [Administration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               author:
 *                 type: string
 *               enabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Announcement updated
 */

/**
 * @swagger
 * /administration/announcements/announcement/{id}:
 *   delete:
 *     summary: Delete an announcement
 *     tags: [Administration]
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
 *         description: Announcement deleted
 *       404:
 *         description: Announcement not found
 */

/**
 * @swagger
 * /administration/user/{id}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     tags: [Administration]
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
 *         description: User deleted
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 *   put:
 *     summary: Update a user (admin can update any, regular user can update only self)
 *     tags: [Administration]
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
 *               email:
 *                 type: string
 *                 format: email
 *               default_workplace:
 *                 type: integer
 *               role:
 *                 type: string
 *                 description: Only changeable by admin
 *     responses:
 *       200:
 *         description: User updated
 *       403:
 *         description: Cannot update another user's data
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /administration/users:
 *   get:
 *     summary: List all users (admin only)
 *     tags: [Administration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Results per page (max 100)
 *     responses:
 *       200:
 *         description: List of users (passwords omitted)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /administration/doctor:
 *   post:
 *     summary: Create a new doctor (admin only)
 *     tags: [Administration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               workplace_id:
 *                 type: array
 *                 items:
 *                   type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               preferred_service_start:
 *                 type: string
 *                 example: '08:00'
 *     responses:
 *       201:
 *         description: Doctor created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Doctor'
 *       400:
 *         description: Validation error
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /administration/doctor/{id}:
 *   put:
 *     summary: Update a doctor (admin only)
 *     tags: [Administration]
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
 *               workplace_id:
 *                 type: array
 *                 items:
 *                   type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               preferred_service_start:
 *                 type: string
 *                 example: '08:00'
 *     responses:
 *       200:
 *         description: Doctor updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Doctor'
 *       400:
 *         description: Validation error or no fields to update
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Doctor not found
 *   delete:
 *     summary: Delete a doctor (admin only)
 *     tags: [Administration]
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
 *         description: Doctor deleted
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Doctor not found
 */

router
    .post('/doctorService', verifyToken, adminstrationController.createDoctorService)
    .delete('/doctorService/:id', verifyToken, adminstrationController.deleteDoctorService)
    .put('/doctorService/:month/:workplace', verifyToken, adminstrationController.updateDoctorService)
    .post('/signUp', authLimiter, verifyToken, requireAdmin, adminstrationController.signUp)
    .post('/signIn', authLimiter, adminstrationController.signIn)
    .post('/announcements/announcement', verifyToken, adminstrationController.createAnnouncement)
    .delete('/announcements/announcement/:id', verifyToken, adminstrationController.deleteAnnouncement)
    .put('/announcements/announcement', verifyToken, adminstrationController.updatedAnnouncement)
    .get('/users', verifyToken, requireAdmin, adminstrationController.getUsers)
    .delete('/user/:id', verifyToken, requireAdmin, adminstrationController.deleteUser)
    .put('/user/:id', verifyToken, adminstrationController.updateUser)
    .post('/doctor', verifyToken, requireAdmin, validate(createDoctorValidationSchema), adminstrationController.createDoctor)
    .put('/doctor/:id', verifyToken, requireAdmin, validate(updateDoctorValidationSchema), adminstrationController.updateDoctor)
    .delete('/doctor/:id', verifyToken, requireAdmin, adminstrationController.deleteDoctor)
    .get('/vacations/:from/:to/:workplace', verifyToken, adminstrationController.getVacations)
    .post('/vacation', verifyToken, adminstrationController.createVacation)
    .put('/vacation/:id', verifyToken, adminstrationController.updateVacation)
    .delete('/vacation/:id', verifyToken, adminstrationController.deleteVacation)

export default router
