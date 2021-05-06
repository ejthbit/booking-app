import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler } from './middlewares/errorHandler'
import allRoutes from './routes/index'
import mongoConnect from './config/mongoConnect'
import swaggerUi from 'swagger-ui-express'
import definition from '../swagger.json'
import swaggerJSDoc from 'swagger-jsdoc'

const startServer = () => {
    const options = {
        definition,
        // Paths to files containing OpenAPI definitions
        apis: ['./src/routes/*.js'],
    }

    const swaggerSpec = swaggerJSDoc(options)
    dotenv.config()
    const app = express()
    mongoConnect()
    app.use(express.json(), errorHandler, express.urlencoded({ extended: true }), cors({ origin: 'http://localhost:8081' }))
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    allRoutes(app)
    app.listen(8080, () => {
        console.log(`🚀🌑 server is running on port 8080.`)
    })
}
startServer()
