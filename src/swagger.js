import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const getOptions = () => ({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Booking App API',
            version: '2.0.0',
            description: 'API for managing bookings, appointments, and doctor services for private ambulances',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Appointment: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        created_at: { type: 'string', format: 'date-time' },
                        name: { type: 'string' },
                        birthdate: { type: 'string' },
                        contact: { type: 'object' },
                        start: { type: 'string', format: 'date-time' },
                        end: { type: 'string', format: 'date-time' },
                        workplace: { type: 'integer' },
                        category: { type: 'integer' },
                        completed: { type: 'boolean' },
                        note: { type: 'string' },
                    },
                },
                BookingInput: {
                    type: 'object',
                    required: ['name', 'birthDate', 'workplace', 'start', 'end', 'category'],
                    properties: {
                        name: { type: 'string' },
                        birthDate: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        phone: { type: 'integer' },
                        contact: { type: 'object' },
                        workplace: { type: 'integer' },
                        start: { type: 'string', format: 'date-time' },
                        end: { type: 'string', format: 'date-time' },
                        category: { type: 'integer' },
                        note: { type: 'string' },
                    },
                },
                DoctorService: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        created_at: { type: 'string', format: 'date-time' },
                        month: { type: 'string' },
                        days: { type: 'object' },
                        workplace: { type: 'integer' },
                    },
                },
                Workplace: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        created_at: { type: 'string', format: 'date-time' },
                        name: { type: 'string' },
                        full_name: { type: 'string' },
                        address: { type: 'string' },
                        workplace_id: { type: 'integer' },
                        contact: { type: 'object' },
                    },
                },
                Doctor: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        created_at: { type: 'string', format: 'date-time' },
                        doctor_id: { type: 'integer' },
                        name: { type: 'string' },
                        workplace_id: { type: 'array', items: { type: 'string' } },
                        preferred_service_start: { type: 'string' },
                        categories: { type: 'array', items: { type: 'string' } },
                    },
                },
                Category: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        created_at: { type: 'string', format: 'date-time' },
                        name: { type: 'string' },
                        category_id: { type: 'integer' },
                    },
                },
                TimeSlot: {
                    type: 'object',
                    properties: {
                        timeSlotStart: { type: 'string', format: 'date-time' },
                        timeSlotEnd: { type: 'string', format: 'date-time' },
                    },
                },
                Sonography: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        created_at: { type: 'string', format: 'date-time' },
                        date: { type: 'string' },
                        from: { type: 'string' },
                        to: { type: 'string' },
                    },
                },
                Announcement: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        created_at: { type: 'string', format: 'date-time' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        author: { type: 'string' },
                        enabled: { type: 'boolean' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.js'],
})

export const setupSwagger = (app) => {
    const swaggerSpec = swaggerJsdoc(getOptions())
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
