import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler } from './middlewares/errorHandler'
import allRoutes from './routes/index'
import helmet from 'helmet'

const startServer = () => {
    dotenv.config()
    const port = process.env.PORT || 5000
    const app = express()
    app.use(
        helmet(),
        express.json(),
        errorHandler,
        express.urlencoded({ extended: true }),
        cors({ origin: process.env.ORIGIN.split(','), credentials: true })
    )
    app.disable('x-powered-by')
    allRoutes(app)
    app.listen(port, () => {
        console.log(`🚀🌑 server is running on port ${port}.`)
    })
}
startServer()
