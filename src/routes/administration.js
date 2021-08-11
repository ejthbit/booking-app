import express from 'express'
import * as adminstrationController from '../controllers/administrationController'
import verifyToken from '../middlewares/checkAuth'

export const ID = '/administration'
const router = express.Router()

router
    .post('/doctorService', verifyToken, adminstrationController.createDoctorService)
    .delete('/doctorService/:id', verifyToken, adminstrationController.deleteDoctorService)
    .put('/doctorService/:month', verifyToken, adminstrationController.updateDoctorService)
    .post('/signUp', adminstrationController.signUp)
    .post('/signIn', adminstrationController.signIn)

export default router
