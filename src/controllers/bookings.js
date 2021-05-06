import Booking from '../models/Booking'

exports.create = async (req, res, next) => {
    try {
        const booking = new Booking({ contact: req.body.contact, name: req.body.name, timeOfBooking: req.body.timeOfBooking })
        const newBooking = await booking.save()
        res.json(newBooking)
    } catch (err) {
        next(err)
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const bookings = await Booking.find({})
        res.json(bookings)
    } catch (err) {
        next(err)
    }
}

exports.findOne = (req, res, next) => {}

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params
        const update = Booking.findOneAndUpdate({ _id: id }, req.body)
        res.json(update)
    } catch (err) {
        next(err)
    }
}

exports.delete = async (req, res, next) => {
    try {
        const { id } = req.params
        await Booking.findOneAndDelete({ _id: id })
        return res.sendStatus(200)
    } catch (err) {
        next(err)
    }
}
