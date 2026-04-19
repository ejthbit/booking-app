import { body } from 'express-validator'
const isValueEmpty = (value) => value === null || value === undefined || value === ''

export const createVacationValidationSchema = [
    body('start', 'start is required and must be a valid ISO date string').isISO8601(),
    body('end', 'end is required and must be a valid ISO date string').isISO8601(),
    body('workplace', 'workplace is required and must be an integer').isInt(),
    body('note').custom((value) => {
        if (isValueEmpty(value)) return true
        if (typeof value === 'string') return true
        throw new Error('note must be a string')
    }),
]

export const updateVacationValidationSchema = [
    body('start').optional({ values: 'falsy' }).isISO8601().withMessage('start must be a valid ISO date string'),
    body('end').optional({ values: 'falsy' }).isISO8601().withMessage('end must be a valid ISO date string'),
    body('workplace').optional({ values: 'falsy' }).isInt().withMessage('workplace must be an integer'),
    body('note').custom((value) => {
        if (isValueEmpty(value)) return true
        if (typeof value === 'string') return true
        throw new Error('note must be a string')
    }),
]
