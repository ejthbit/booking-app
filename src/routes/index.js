import bookingsRouter, { ID as bookingID } from './bookings'
import administrationRouter, { ID as administrationId } from './administration'
import configurationRouter, { ID as configurationId } from './configuration'

export default (app) => {
    app.use(bookingID, bookingsRouter)
    app.use(administrationId, administrationRouter)
    app.use(configurationId, configurationRouter)
}
