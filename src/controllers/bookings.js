import { getSlots } from '../utils/getSlotsObject'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const create = async (req, res, next) => {
    try {
        const newBooking = await prisma.bookings.create({
            data: {
                contact: req.body.contact,
                name: req.body.name,
                timeofbooking: req.body.timeofbooking,
            },
        })
        res.json(newBooking)
    } catch (err) {
        next(err)
    }
}

export const findAll = async (req, res, next) => {
    try {
        const { from, to } = req.params
        const bookings = await prisma.bookings.findMany(
            from && to
                ? {
                      where: {
                          timeofbooking: {
                              gte: new Date(from).toISOString(),
                              lte: new Date(to).toISOString(),
                          },
                      },
                      orderBy: { timeofbooking: 'desc' },
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
        const foundBooking = await prisma.bookings.findUnique({
            where: {
                id: Number(id),
            },
        })
        res.json(foundBooking)
    } catch (err) {
        next(err)
    }
}

export const updateBooking = async (req, res, next) => {
    try {
        const { id } = req.params
        const updatedBooking = await prisma.bookings.update({
            where: {
                id: Number(id),
            },
            data: {
                ...req.body,
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
        await prisma.bookings.delete({
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
        const { beginningOfDay, endOfDay } = req.params
        const existingBookings = await prisma.bookings.findMany({
            where: {
                timeofbooking: {
                    gte: new Date(beginningOfDay).toISOString(),
                    lte: new Date(endOfDay).toISOString(),
                },
            },
            orderBy: { timeofbooking: 'desc' },
        })
        const bookedAppointments = existingBookings.map(({ timeofbooking }) => timeofbooking)
        const slotsForDay = getSlots(beginningOfDay, endOfDay, 15, bookedAppointments)
        return res.json(slotsForDay)
    } catch (err) {
        next(err)
    }
}
