import { PrismaClient } from '@prisma/client'
import { parseISO } from 'date-fns'

const prisma = new PrismaClient()

export const createBooking = async ({ contact, name, birthDate: birthdate, start, end, workplace, category }) => {
    try {
        const bookingData = {
            contact,
            name,
            birthdate,
            start,
            end,
            workplace,
            category,
        }
        const newBooking = await prisma.appointments.create({
            data: bookingData,
        })
        return newBooking
    } catch (err) {
        throw Error('Error while creating booking')
    }
}

export const getBookings = async ({ start, end, workplace }) => {
    try {
        const filterByStartEndTimes = !!start && !!end
        const bookings = await prisma.appointments.findMany({
            where: {
                ...(filterByStartEndTimes && {
                    start: {
                        gte: parseISO(start),
                        lte: parseISO(end),
                    },
                }),
                ...(workplace && { workplace: Number(workplace) }),
            },
            orderBy: { start: 'desc' },
        })
        return bookings
    } catch (err) {
        throw Error('Error while listing bookings')
    }
}
