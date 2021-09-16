import { getSlots } from '../utils/getSlotsObject'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const create = async (req, res, next) => {
    try {
        const { contact, name, birthDate, start, end, workplace } = req.body
        const existingBooking = await prisma.bookings.findFirst({ where: { start, workplace: Number(workplace) } })
        if (existingBooking) {
            res.status(409).send({
                error: 409,
                message: 'Na daný termín již existuje objednávka.', // english
            })
        } else {
            const newBooking = await prisma.bookings.create({
                data: {
                    contact,
                    name,
                    birthdate: birthDate,
                    start,
                    end,
                    workplace,
                },
            })
            res.status(200).send({ ...newBooking, status: 200 })
        }
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
        const bookings = await prisma.bookings.findMany(
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
        const foundBooking = await prisma.bookings.findUnique({
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
        const { name, start } = req.body
        const updatedBooking = await prisma.bookings.update({
            where: {
                id: Number(id),
            },
            data: {
                name,
                start,
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
        const { beginningOfDay, endOfDay, workplace } = req.params
        const existingBookings = await prisma.bookings.findMany({
            where: {
                start: {
                    gte: new Date(beginningOfDay).toISOString(),
                    lte: new Date(endOfDay).toISOString(),
                },
                workplace: Number(workplace),
            },
            orderBy: { start: 'desc' },
        })
        const bookedAppointments = existingBookings.map(({ start }) => start)
        const slotsForDay = getSlots(beginningOfDay, endOfDay, 15, bookedAppointments)
        return res.json(slotsForDay)
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
