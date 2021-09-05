import { PrismaClient } from '@prisma/client'
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
