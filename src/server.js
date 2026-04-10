import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import corsOptions from './middlewares/corsOptions'
import { errorHandler } from './middlewares/errorHandler'
import allRoutes from './routes/index'
import { setupSwagger } from './swagger'

const startServer = () => {
    const port = process.env.PORT || 5000
    const app = express()
    app.use(helmet(), express.json(), express.urlencoded({ extended: true }), cors(corsOptions), morgan('dev'))
    app.disable('x-powered-by')

    if (process.env.NODE_ENV !== 'production') {
        setupSwagger(app)
    }
    allRoutes(app)
    app.use(errorHandler)
    app.listen(port, () => {
        console.log(`🚀🌑 server is running on port ${port}.`)
    })
}
startServer()
