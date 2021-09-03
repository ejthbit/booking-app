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
