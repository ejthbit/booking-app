import prisma from '../prismaClient'
import { sendMail } from '../helpers/mailer'
import { contactFormTemplate } from '../utils/mailerTemplates'
import isNilOrEmpty from '../utils/isNilOrEmpty'

export const getAmbulances = async (req, res, next) => {
    try {
        const existingAmbulances = await prisma.workplaces.findMany()
        res.status(200).json({ data: existingAmbulances })
    } catch (err) {
        next(err)
    }
}

export const getDoctors = async (req, res, next) => {
    const { workplaceId } = req.params
    try {
        const selectedAmbulanceDoctors = await prisma.doctors.findMany({ where: { workplace_id: { hasSome: [workplaceId] } } })
        res.status(200).json({ data: selectedAmbulanceDoctors })
    } catch (err) {
        next(err)
    }
}

export const sendMessage = async (req, res, next) => {
    try {
        sendMail(contactFormTemplate(req.body, 'info@vanek-gynekologie.cz'))
        res.status(200).json({ message: 'Message sent successfully' })
    } catch (err) {
        next(err)
    }
}

export const getBookingCategories = async (req, res, next) => {
    const { selectedDoctorId } = req.params
    try {
        let bookingCategories
        if (!isNilOrEmpty(selectedDoctorId)) {
            const doctor = await prisma.doctors.findFirst({
                where: {
                    doctor_id: Number(selectedDoctorId),
                },
            })
            if (!doctor) return res.status(404).json({ message: 'Doctor not found' })
            bookingCategories = await prisma.categories.findMany({
                where: {
                    category_id: { in: doctor.categories.map((categoryId) => Number(categoryId)) },
                },
            })
        } else bookingCategories = await prisma.categories.findMany()
        res.status(200).json({ data: bookingCategories })
    } catch (err) {
        next(err)
    }
}

export const getAnnouncements = async (_, res, next) => {
    try {
        const announcements = await prisma.announcements.findMany()
        res.status(200).json({ data: announcements })
    } catch (err) {
        next(err)
    }
}
