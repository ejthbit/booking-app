/* eslint-disable no-undef */
const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger.json'
const endpointsFiles = ['src/routes/index.js']

swaggerAutogen(outputFile, endpointsFiles)
