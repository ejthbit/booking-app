import Booking from '../models/Booking'

export const create = async (req, res, next) => {
    try {
        const booking = new Booking({ contact: req.body.contact, name: req.body.name, timeOfBooking: req.body.timeOfBooking })
        const newBooking = await booking.save()
        res.json(newBooking)
    } catch (err) {
        next(err)
    }
}

export const findAll = async (req, res, next) => {
    try {
        const { from, to } = req.params
        const bookings = await Booking.find(
            from && to
                ? {
                      timeOfBooking: { $gte: new Date(from).toISOString(), $lte: new Date(to).toISOString() },
                  }
                : {}
        ).sort({ timeOfBooking: 1 })
        res.json(bookings)
    } catch (err) {
        next(err)
    }
}

export const findBookingById = async (req, res, next) => {
    try {
        const { id } = req.params
        const foundBooking = await Booking.findById(id)
        res.json(foundBooking)
    } catch (err) {
        next(err)
    }
}

export const updateBooking = async (req, res, next) => {
    try {
        const { id } = req.params
        await Booking.findOneAndUpdate(id, req.body)
        res.json({
            ...req.body,
            status: 200,
        })
    } catch (err) {
        next(err)
    }
}

export const deleteBooking = async (req, res, next) => {
    try {
        const { id } = req.params
        await Booking.findOneAndDelete({ _id: id })
        return res.sendStatus(200)
    } catch (err) {
        next(err)
    }
}
