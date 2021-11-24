import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import fs from 'fs'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { errorHandler } from './middlewares/errorHandler'
import allRoutes from './routes/index'

const startServer = () => {
    dotenv.config()
    const port = process.env.PORT || 5000
    const app = express()
    const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
    app.use(
        helmet(),
        express.json(),
        errorHandler,
        express.urlencoded({ extended: true }),
        cors(),
        morgan('combined', { stream: accessLogStream })
    )
    app.disable('x-powered-by')
    allRoutes(app)
    app.listen(port, () => {
        console.log(`🚀🌑 server is running on port ${port}.`)
    })
}
startServer()
