import { PrismaClient } from '@prisma/client'
import { endOfMonth, parseISO, startOfMonth } from 'date-fns'
import { sendMail } from '../helpers/mailer'
import * as BookingsService from '../services/bookingsServices'
import * as ConfigurationService from '../services/configurationServices'
import { getSlots } from '../utils/getSlotsObject'
import { confirmationTemplate } from '../utils/mailerTemplates'

const prisma = new PrismaClient()

export const create = async (req, res, next) => {
    try {
        const { contact, start, workplace } = req.body
        const existingBooking = await prisma.appointments.findFirst({ where: { start, workplace: Number(workplace) } })
        const selectedAmbulance = await prisma.workplaces.findFirst({ where: { workplace_id: workplace } })
        if (existingBooking) {
            res.status(409).send({
                error: 409,
                message: 'This booking slot is already taken.', // english
            })
        } else {
            const newBooking = await BookingsService.createBooking(req.body)
            if (newBooking && contact.email) sendMail(confirmationTemplate(selectedAmbulance, newBooking), res)
            res.status(200).send({ ...newBooking, status: 200 })
        }
    } catch (err) {
        next(err)
    }
}

export const findAll = async (req, res, next) => {
    try {
        const { from, to } = req.params
        const bookings = await prisma.appointments.findMany(
            from && to
                ? {
                      where: {
                          start: {
                              gte: new Date(from).toISOString(),
                              lte: new Date(to).toISOString(),
                          },
                      },
                      orderBy: { start: 'desc' },
                  }
                : {}
        )
        res.json(bookings)
    } catch (err) {
        next(err)
    }
}

export const findAllByCriteria = async (req, res, next) => {
    try {
        const { from, to, workplace } = req.params
        const bookings = await prisma.appointments.findMany(
            from && to
                ? {
                      where: {
                          ...(workplace && { workplace: Number(workplace) }),
                          start: {
                              gte: new Date(from).toISOString(),
                              lte: new Date(to).toISOString(),
                          },
                      },
                      orderBy: { start: 'desc' },
                  }
                : {}
        )
        res.json(bookings)
    } catch (err) {
        next(err)
    }
}

export const findBookingById = async (req, res, next) => {
    try {
        const { id } = req.params
        const foundBooking = await prisma.appointments.findUnique({
            where: {
                id: Number(id),
            },
        })
        foundBooking
            ? res.status(200).json(foundBooking)
            : res.status(404).json({ message: 'Entry for given id not found!', status: 404 })
    } catch (err) {
        next(err)
    }
}

export const updateBooking = async (req, res, next) => {
    try {
        const { id } = req.params
        const { name, start, end, birthdate, completed, phone, category } = req.body
        const updatedBooking = await prisma.appointments.update({
            where: {
                id: Number(id),
            },
            data: {
                name,
                start,
                end,
                birthdate,
                completed,
                category,
            },
        })
        res.json({
            ...updatedBooking,
            status: 200,
        })
    } catch (err) {
        next(err)
    }
}

export const deleteBooking = async (req, res, next) => {
    try {
        const { id } = req.params
        await prisma.appointments.delete({
            where: {
                id: Number(id),
            },
        })
        return res.sendStatus(200)
    } catch (err) {
        next(err)
    }
}

export const getAvailableTimeSlotsForDay = async (req, res, next) => {
    try {
        const { beginningOfDay, endOfDay, workplace } = req.params
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
        const availableTimeSlots = getSlots(beginningOfDay, endOfDay, 15, bookedAppointments, lunchBreakTimes)
        return res.json(availableTimeSlots)
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
        foundService
            ? res.status(200).json(foundService)
            : res.status(404).json({ message: 'Entry for given month not found!', status: 404 })
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
        foundDates
            ? res.status(200).json(foundDates)
            : res.status(404).json({ message: 'Entry for given month not found!', status: 404 })
    } catch (err) {
        next(err)
    }
}
