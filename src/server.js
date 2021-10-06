import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler } from './middlewares/errorHandler'
import allRoutes from './routes/index'
import helmet from 'helmet'
import corsOptions from './middlewares/corsOptions'
import morgan from 'morgan'
import fs from 'fs'
import path from 'path'

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
        cors(corsOptions),
        morgan('combined', { stream: accessLogStream })
    )
    app.disable('x-powered-by')
    allRoutes(app)
    app.listen(port, () => {
        console.log(`🚀🌑 server is running on port ${port}.`)
    })
}
startServer()
