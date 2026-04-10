import express from 'express'
import * as adminstrationController from '../controllers/administrationController'
import verifyToken from '../middlewares/checkAuth'
import requireAdmin from '../middlewares/requireAdmin'
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

router
    .post('/doctorService', verifyToken, adminstrationController.createDoctorService)
    .delete('/doctorService/:id', verifyToken, adminstrationController.deleteDoctorService)
    .put('/doctorService/:month/:workplace', verifyToken, adminstrationController.updateDoctorService)
    .post('/signUp', authLimiter, verifyToken, requireAdmin, adminstrationController.signUp)
    .post('/signIn', authLimiter, adminstrationController.signIn)
    .post('/announcements/announcement', verifyToken, adminstrationController.createAnnouncement)
    .delete('/announcements/announcement/:id', verifyToken, adminstrationController.deleteAnnouncement)
    .put('/announcements/announcement', verifyToken, adminstrationController.updatedAnnouncement)
    .delete('/user/:id', verifyToken, requireAdmin, adminstrationController.deleteUser)
    .put('/user/:id', verifyToken, adminstrationController.updateUser)

export default router
