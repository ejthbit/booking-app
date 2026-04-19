import { body } from 'express-validator'
const isValueEmpty = (value) => value === null || value === undefined || value === ''

export const bookingValidationSchema = [
    body('name', 'Name field cannot be empty!').exists({ checkFalsy: true }),
    body('email').custom((value) => {
        if (isValueEmpty(value)) return true
        // Simple regex check for email if not empty
        if (/^\S+@\S+\.\S+$/.test(value)) return true
        throw new Error('Invalid email')
    }),
    body('phone').custom((value) => {
        if (isValueEmpty(value)) return true
        if (!isNaN(value) && value !== '') return true
        throw new Error('Invalid phone')
    }),
    body('birthDate', 'Birth date field cannot be empty!').exists({ checkNull: true }),
    body('workplace', 'Workplace cannot be empty!').exists({ checkNull: true }),
    body('start', 'Start time is required and must be a valid ISO8601 date!').isISO8601(),
    body('end', 'End time is required and must be a valid ISO8601 date!').isISO8601(),
    body('category', 'Category is required and must be an integer!').isInt(),
]
