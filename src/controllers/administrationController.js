import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const createDoctorService = async (req, res, next) => {
    try {
        const { month, days } = req.body
        const existingBooking = await prisma.doctorServices.findFirst({ where: { month } })
        if (existingBooking) {
            res.status(409).send({
                error: 409,
                message: 'Service already exists',
            })
        } else {
            const newServiceRecord = await prisma.doctorServices.create({
                data: {
                    month,
                    days,
                },
            })
            res.status(200).send({ ...newServiceRecord, status: 200 })
        }
    } catch (err) {
        next(err)
    }
}

export const deleteDoctorService = async (req, res, next) => {
    try {
        const { id } = req.params
        await prisma.doctorServices.delete({
            where: {
                id: Number(id),
            },
        })
        return res.sendStatus(200)
    } catch (err) {
        next(err)
    }
}

export const updateDoctorService = async (req, res, next) => {
    try {
        const { month } = req.params
        const existingService = await prisma.doctorServices.findFirst({ where: { month } })

        const updatedDoctorService =
            existingService &&
            (await prisma.doctorServices.updateMany({
                where: {
                    month,
                },
                data: {
                    ...req.body,
                },
            }))
        existingService
            ? res.json({
                  ...updatedDoctorService,
                  status: 200,
              })
            : res.status(404).json({ message: 'Service for given id not found!', status: 404 })
    } catch (err) {
        next(err)
    }
}
