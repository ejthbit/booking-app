import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler } from './middlewares/errorHandler'
import allRoutes from './routes/index'

const startServer = () => {
    dotenv.config()
    const port = process.env.PORT || 5000
    const app = express()
    app.use(express.json(), errorHandler, express.urlencoded({ extended: true }), cors({ origin: process.env.ORIGIN }))
    allRoutes(app)
    app.listen(port, () => {
        console.log(`🚀🌑 server is running on port port.`)
    })
}
startServer()
