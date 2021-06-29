import bookingsRouter, { ID as bookingID } from './bookings'

export default (app) => app.use(bookingID, bookingsRouter)
