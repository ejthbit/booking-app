import { PrismaClient } from '@prisma/client'
import { sendMail } from '../helpers/mailer'
import { contactFormTemplate } from '../utils/mailerTemplates'

const prisma = new PrismaClient()

export const getAmbulances = async (req, res, next) => {
    try {
        const existingAmbulances = await prisma.workplaces.findMany()
        res.status(200).send({ data: existingAmbulances, status: 200 })
    } catch (err) {
        next(err)
    }
}
export const getDoctors = async (req, res, next) => {
    const { workplaceId } = req.params
    try {
        const selectedAmbulanceDoctors = await prisma.doctors.findMany({ where: { workplace_id: { hasSome: [workplaceId] } } })
        res.status(200).send({ data: selectedAmbulanceDoctors, status: 200 })
    } catch (err) {
        next(err)
    }
}

export const sendMessage = async (req, res, next) => {
    const { workplaceId } = req.body
    try {
        const ambulance = await prisma.workplaces.findMany({ where: { workplace_id: Number(workplaceId) } })
        if (ambulance) sendMail(contactFormTemplate(req.body, ambulance[0].contact.email), res)
    } catch (err) {
        next(err)
    }
}

export const getBookingCategories = async (_, res, next) => {
    try {
        const bookingCategories = await prisma.categories.findMany()
        res.status(200).send({ data: bookingCategories, status: 200 })
    } catch (err) {
        next(err)
    }
}
