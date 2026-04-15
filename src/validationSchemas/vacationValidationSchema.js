import { body } from 'express-validator'

export const createVacationValidationSchema = [
    body('start', 'start is required and must be a valid ISO date string')
        .exists({ checkFalsy: true })
        .isISO8601(),
    body('end', 'end is required and must be a valid ISO date string')
        .exists({ checkFalsy: true })
        .isISO8601(),
    body('workplace', 'workplace is required and must be an integer')
        .exists()
        .isInt(),
    body('note', 'note must be a string').optional().isString(),
]

export const updateVacationValidationSchema = [
    body('start', 'start must be a valid ISO date string').optional().isISO8601(),
    body('end', 'end must be a valid ISO date string').optional().isISO8601(),
    body('workplace', 'workplace must be an integer').optional().isInt(),
    body('note', 'note must be a string').optional().isString(),
]
