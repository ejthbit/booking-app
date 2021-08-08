import bookingsRouter, { ID as bookingID } from './bookings'
import administrationRouter, { ID as administrationId } from './administration'

export default (app) => {
    app.use(bookingID, bookingsRouter)
    app.use(administrationId, administrationRouter)
}
