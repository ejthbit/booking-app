import express from 'express'
import * as adminstrationController from '../controllers/administrationController'

export const ID = '/administration'
const router = express.Router()

router
    .post('/doctorService', adminstrationController.createDoctorService)
    .delete('/doctorService/:id', adminstrationController.deleteDoctorService)
    .put('/doctorService/:month', adminstrationController.updateDoctorService)

export default router
