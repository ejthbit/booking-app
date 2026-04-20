import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import corsOptions from './middlewares/corsOptions'
import { errorHandler } from './middlewares/errorHandler'
import allRoutes from './routes/index'
import { setupSwagger } from './swagger'

const scanBlocker = (req, res, next) => {
    const blocked = /\.(php|asp|aspx|jsp|cgi|env|git|DS_Store)($|\?)/i.test(req.path) ||
        /\/(wp-admin|wp-content|wp-includes|xmlrpc|phpmyadmin|\.git|\.env)/i.test(req.path)
    if (blocked) return res.status(404).end()
    next()
}

const startServer = () => {
    const port = process.env.PORT || 5000
    const app = express()
    app.set('trust proxy', 1)
    app.use(helmet(), express.json(), express.urlencoded({ extended: true }), cors(corsOptions), morgan('dev'))
    app.disable('x-powered-by')
    app.use(scanBlocker)

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
