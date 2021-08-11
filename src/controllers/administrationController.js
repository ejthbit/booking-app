import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
        const existingService = await prisma.doctorServices.findUnique({ where: { id: Number(id) } })
        !existingService && res.sendStatus(404).json({ message: 'Service for given id not found!', status: 404 })
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
export const signUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        const existingUser = await prisma.users.findFirst({ where: { email } })
        if (existingUser) res.status(409).json({ message: 'User with given email already exists!', status: 409 })
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err,
                })
            } else {
                const newUser =
                    !existingUser &&
                    (await prisma.users.create({
                        data: {
                            name,
                            email,
                            password: hash,
                        },
                    }))
                newUser
                    ? res.json({
                          ...newUser,
                          status: 200,
                      })
                    : res.status(500).json({
                          error: err,
                      })
            }
        })
    } catch (err) {
        next(err)
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await prisma.users.findFirst({ where: { email } })
        !user && res.status(404).json({ message: 'User with given email not found!', status: 404 })
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) return res.status(401).json({ message: 'Auth Failed', status: 401 })
            if (result) {
                const token = jwt.sign(
                    {
                        email: user.email,
                        userId: user.id,
                    },
                    `${process.env.JWT_SECRET_KEY}`,
                    {
                        expiresIn: '1h',
                    }
                )
                return res.status(200).json({ success: true, message: 'Authentication successful!', token, status: 200 })
            }
            res.status(401).json({ message: 'Auth Failed', status: 401 })
        })
    } catch (err) {
        next(err)
    }
}
