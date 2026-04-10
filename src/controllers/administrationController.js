import prisma from '../prismaClient'
import bcrypt from 'bcrypt'
import { addHours } from 'date-fns'
import jwt from 'jsonwebtoken'

export const createDoctorService = async (req, res, next) => {
    try {
        const { month, days, workplace } = req.body
        const existingService = await prisma.doctorServices.findFirst({ where: { month, workplace: Number(workplace) } })
        if (existingService) {
            return res.status(409).json({ error: 409, message: 'Service already exists' })
        }
        const newServiceRecord = await prisma.doctorServices.create({
            data: {
                month,
                days,
                workplace: Number(workplace),
            },
        })
        res.status(200).json(newServiceRecord)
    } catch (err) {
        next(err)
    }
}

export const deleteDoctorService = async (req, res, next) => {
    try {
        const { id } = req.params
        await prisma.doctorServices.delete({ where: { id: Number(id) } })
        return res.status(200).json({ message: 'Deleted' })
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: 'Service for given id not found!' })
        }
        next(err)
    }
}

export const updateDoctorService = async (req, res, next) => {
    try {
        const { month, workplace } = req.params
        const existingService = await prisma.doctorServices.findFirst({ where: { month, workplace: Number(workplace) } })
        if (!existingService) {
            return res.status(404).json({ message: 'Service for given month not found!' })
        }

        const updatedDoctorService = await prisma.doctorServices.updateMany({
            where: {
                month,
                workplace: Number(workplace),
            },
            data: {
                days: req.body.days,
            },
        })
        return res.status(200).json(updatedDoctorService)
    } catch (err) {
        next(err)
    }
}

export const signUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        const existingUser = await prisma.users.findFirst({ where: { email } })
        if (existingUser) return res.status(409).json({ message: 'User with given email already exists!' })
        const hash = await bcrypt.hash(password, 10)
        const newUser = await prisma.users.create({
            data: {
                name,
                email,
                password: hash,
            },
        })
        const { password: _, ...safeUser } = newUser
        res.status(200).json(safeUser)
    } catch (err) {
        next(err)
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const JWT_KEY_EXP_TIME = 8
        const user = await prisma.users.findFirst({ where: { email } })
        if (!user) return res.status(404).json({ message: 'User with given email not found!' })
        const result = await bcrypt.compare(password, user.password)
        if (!result) return res.status(401).json({ message: 'Auth Failed' })
        const token = jwt.sign(
            {
                email: user.email,
                userId: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: `${JWT_KEY_EXP_TIME}h`,
            }
        )
        const expires = addHours(new Date(), JWT_KEY_EXP_TIME)
        return res.status(200).json({
            success: true,
            message: 'Authentication successful!',
            token,
            exp: expires.getTime(),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                default_workplace: user.default_workplace,
                role: user.role,
            },
        })
    } catch (err) {
        next(err)
    }
}

export const createAnnouncement = async (req, res, next) => {
    try {
        const { author, description, name, enabled } = req.body
        const newAnnouncement = await prisma.announcements.create({
            data: {
                author,
                description,
                name,
                enabled,
            },
        })
        res.status(200).json(newAnnouncement)
    } catch (err) {
        next(err)
    }
}

export const deleteAnnouncement = async (req, res, next) => {
    try {
        const { id } = req.params
        await prisma.announcements.delete({ where: { id: Number(id) } })
        return res.status(200).json({ message: 'Deleted' })
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: 'Announcement for given id not found!' })
        }
        next(err)
    }
}

export const updatedAnnouncement = async (req, res, next) => {
    try {
        const { author, description, name, enabled, id } = req.body
        const updatedAnnouncement = await prisma.announcements.update({
            where: {
                id: Number(id),
            },
            data: {
                ...(author ? { author } : {}),
                ...(description ? { description } : {}),
                ...(name ? { name } : {}),
                enabled,
            },
        })
        res.status(200).json(updatedAnnouncement)
    } catch (err) {
        next(err)
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params
        await prisma.users.delete({ where: { id: Number(id) } })
        return res.status(200).json({ message: 'Deleted' })
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: 'User not found' })
        }
        next(err)
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const isAdmin = req.user.role === 'admin'
        const isSelf = req.user.userId === Number(id)

        if (!isAdmin && !isSelf) {
            return res.status(403).json({ message: 'You can only update your own data' })
        }

        const existingUser = await prisma.users.findUnique({ where: { id: Number(id) } })
        if (!existingUser) return res.status(404).json({ message: 'User not found' })

        const { name, email, default_workplace } = req.body
        const data = {
            ...(name !== undefined ? { name } : {}),
            ...(email !== undefined ? { email } : {}),
            ...(default_workplace !== undefined ? { default_workplace } : {}),
        }

        if (isAdmin && req.body.role !== undefined) {
            data.role = req.body.role
        }

        const updatedUser = await prisma.users.update({
            where: { id: Number(id) },
            data,
        })
        const { password: _, ...safeUser } = updatedUser
        res.status(200).json(safeUser)
    } catch (err) {
        next(err)
    }
}
