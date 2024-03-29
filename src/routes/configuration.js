import express from 'express'
import * as configurationController from '../controllers/configurationController'

export const ID = '/configuration'
const router = express.Router()

router
    .get('/getAmbulances', configurationController.getAmbulances)
    .get('/getDoctors/:workplaceId', configurationController.getDoctors)
    .get('/getBookingCategories', configurationController.getBookingCategories)
    .post('/contactForm/sendMessage', configurationController.sendMessage)

export default router
