import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
    {
        contact: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        timeOfBooking: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
)

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking
