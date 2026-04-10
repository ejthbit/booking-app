import prisma from '../prismaClient'
import { endOfMonth, parseISO, startOfMonth } from 'date-fns'
import { sendMail } from '../helpers/mailer'
import * as BookingsService from '../services/bookingsServices'
import * as ConfigurationService from '../services/configurationServices'
import { getSlots } from '../utils/getSlotsObject'
import { confirmationTemplate, deleteTemplate, updateTemplate } from '../utils/mailerTemplates'

export const create = async (req, res, next) => {
    try {
        const { contact, start, workplace } = req.body
        const selectedAmbulance = await prisma.workplaces.findFirst({ where: { workplace_id: workplace } })

        const newBooking = await prisma.$transaction(async (tx) => {
            const existingBooking = await tx.appointments.findFirst({ where: { start, workplace: Number(workplace) } })
            if (existingBooking) return null
            return BookingsService.createBooking(req.body, tx)
        })

        if (!newBooking) {
            return res.status(409).json({ error: 409, message: 'This booking slot is already taken.' })
        }
        if (contact.email) sendMail(confirmationTemplate(selectedAmbulance, newBooking))
        res.status(200).json(newBooking)
    } catch (err) {
        next(err)
    }
}

export const findAllByCriteria = async (req, res, next) => {
    try {
        const { from, to, workplace } = req.params
        const fromDate = parseISO(from)
        const toDate = parseISO(to)
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date range' })
        }
        const take = Math.min(Number(req.query.limit) || 100, 500)
        const skip = Number(req.query.offset) || 0
        const bookings = await prisma.appointments.findMany({
            where: {
                workplace: Number(workplace),
                start: {
                    gte: fromDate,
                    lte: toDate,
                },
            },
            orderBy: { start: 'desc' },
            take,
            skip,
        })
        res.status(200).json(bookings)
    } catch (err) {
        next(err)
    }
}

export const findBookingById = async (req, res, next) => {
    try {
        const { id } = req.params
        const foundBooking = await prisma.appointments.findUnique({
            where: { id: Number(id) },
        })
        if (!foundBooking) {
            return res.status(404).json({ message: 'Entry for given id not found!' })
        }
        res.status(200).json(foundBooking)
    } catch (err) {
        next(err)
    }
}

export const updateBooking = async (req, res, next) => {
    try {
        const { id } = req.params
        const { name, start, end, birthdate, completed, category, note = null } = req.body
        const foundBooking = await prisma.appointments.findUnique({
            where: { id: Number(id) },
        })
        if (!foundBooking) {
            return res.status(404).json({ message: 'Booking not found' })
        }

        const updatedBooking = await prisma.appointments.update({
            where: { id: Number(id) },
            data: { name, start, end, birthdate, completed, category, note },
        })

        const timeChanged = foundBooking.start?.toISOString() !== new Date(start).toISOString()
        if (updatedBooking.contact?.email && timeChanged) {
            sendMail(updateTemplate(updatedBooking))
        }
        res.status(200).json(updatedBooking)
    } catch (err) {
        next(err)
    }
}

export const deleteBooking = async (req, res, next) => {
    try {
        const { id } = req.params
        const existingBooking = await prisma.appointments.findUnique({ where: { id: Number(id) } })
        if (!existingBooking) return res.status(404).json({ message: 'Booking not found' })

        await prisma.appointments.delete({ where: { id: Number(id) } })
        if (existingBooking.contact?.email) sendMail(deleteTemplate(existingBooking))

        return res.status(200).json({ message: 'Deleted' })
    } catch (err) {
        next(err)
    }
}

export const getAvailableTimeSlotsForDay = async (req, res, next) => {
    try {
        const { beginningOfDay, endOfDay, workplace, timeSlotDuration = 15 } = req.params
        const existingBookings = await prisma.appointments.findMany({
            where: {
                start: {
                    gte: parseISO(beginningOfDay),
                    lte: parseISO(endOfDay),
                },
                workplace: Number(workplace),
            },
            orderBy: { start: 'desc' },
        })

        const bookedAppointments = existingBookings.map(({ start }) => start.toISOString())
        const lunchBreakTimes = await ConfigurationService.getLunchBreakTimes(workplace, beginningOfDay)
        const availableTimeSlots = getSlots(beginningOfDay, endOfDay, timeSlotDuration, bookedAppointments, lunchBreakTimes)
        return res.status(200).json(availableTimeSlots)
    } catch (err) {
        next(err)
    }
}

export const getDoctorServicesForMonth = async (req, res, next) => {
    try {
        const { month, workplace } = req.params
        const foundService = await prisma.doctorServices.findFirst({
            where: {
                month,
                workplace: Number(workplace),
            },
        })
        if (!foundService) {
            return res.status(404).json({ message: 'Entry for given month not found!' })
        }
        res.status(200).json(foundService)
    } catch (err) {
        next(err)
    }
}

export const getDoctorServicesByRange = async (req, res, next) => {
    try {
        const { start, end, workplace } = req.params
        const startMonth = start.slice(0, 7)
        const endMonth = end.slice(0, 7)
        const startDate = new Date(start)
        const endDate = new Date(end)
        const days = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24))
        const dateArray = [...Array(days + 1).keys()].map((day) => {
            const date = new Date(startDate)
            date.setDate(startDate.getDate() + day)
            return date.toISOString().slice(0, 10)
        })

        let service
        if (startMonth === endMonth) {
            const result = await prisma.doctorServices.findFirst({
                where: {
                    month: startMonth,
                    workplace: Number(workplace),
                },
            })
            service = result?.days?.filter(({ date }) => dateArray.includes(date)) ?? []
        } else {
            const serviceStart =
                (await prisma.doctorServices.findFirst({
                    where: {
                        month: startMonth,
                        workplace: Number(workplace),
                    },
                })) ?? {}
            const serviceEnd =
                (await prisma.doctorServices.findFirst({
                    where: {
                        month: endMonth,
                        workplace: Number(workplace),
                    },
                })) ?? {}
            const result = [...(serviceStart?.days ?? []), ...(serviceEnd?.days ?? [])]
            service = result.filter(({ date }) => dateArray.includes(date))
        }

        const filteredArr = service.filter((entry) =>
            entry.doctors.some((doctor) => doctor.doctorId !== '')
        )
        const newDoctorsArr = filteredArr.flatMap((entry) => entry.doctors)

        if (newDoctorsArr.length === 0) {
            return res.status(404).json({ message: 'Entry for given month not found!' })
        }
        res.status(200).json(newDoctorsArr)
    } catch (err) {
        next(err)
    }
}

export const getSonographyDates = async (req, res, next) => {
    try {
        const { month } = req.params
        const foundDates = await prisma.sonography.findMany({
            where: {
                date: {
                    gte: startOfMonth(new Date(month)).toISOString().slice(0, 10),
                    lte: endOfMonth(new Date(month)).toISOString().slice(0, 10),
                },
            },
        })
        if (foundDates.length === 0) {
            return res.status(404).json({ message: 'Entry for given month not found!' })
        }
        res.status(200).json(foundDates)
    } catch (err) {
        next(err)
    }
}
