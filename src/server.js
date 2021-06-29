import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler } from './middlewares/errorHandler'
import allRoutes from './routes/index'

const startServer = () => {
    dotenv.config()
    const app = express()
    app.use(express.json(), errorHandler, express.urlencoded({ extended: true }), cors({ origin: process.env.ORIGIN }))
    allRoutes(app)
    app.listen(8080, () => {
        console.log(`🚀🌑 server is running on port 8080.`)
    })
}
startServer()
