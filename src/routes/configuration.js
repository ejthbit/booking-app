import express from 'express'
import * as configurationController from '../controllers/configurationController'

export const ID = '/configuration'
const router = express.Router()

router.get('/getAmbulances', configurationController.getAmbulances)

export default router
