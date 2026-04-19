import { body } from 'express-validator'
const isValueEmpty = (value) => value === null || value === undefined || value === ''
/**
 * Configuration to allow 'null' or 'undefined' to pass through
 * the .optional() check without triggering validation errors.
 */

export const createDoctorValidationSchema = [
    body('name', 'Name is required').exists({ checkFalsy: true }).isString(),
    body('workplace_id')
        .optional({ values: 'null' })
        .isArray()
        .withMessage('workplace_id must be an array')
        .custom((arr) => arr.every((v) => typeof v === 'string'))
        .withMessage('workplace_id must be an array of strings'),
    body('categories', 'categories must be an array').optional({ values: 'null' }).isArray(),
    body('preferred_service_start').custom((value) => {
        if (isValueEmpty(value)) return true
        if (/^\d{2}:\d{2}$/.test(value)) return true
        throw new Error('preferred_service_start must be a string in HH:MM format')
    }),
]

export const updateDoctorValidationSchema = [
    body('name').optional({ values: 'falsy' }).isString().notEmpty().withMessage('name must be a non-empty string'),
    body('workplace_id')
        .optional({ values: 'null' })
        .isArray()
        .withMessage('workplace_id must be an array')
        .custom((arr) => arr.every((v) => typeof v === 'string'))
        .withMessage('workplace_id must be an array of strings'),
    body('categories', 'categories must be an array').optional({ values: 'null' }).isArray(),
    body('preferred_service_start').custom((value) => {
        if (isValueEmpty(value)) return true
        if (/^\d{2}:\d{2}$/.test(value)) return true
        throw new Error('preferred_service_start must be a string in HH:MM format')
    }),
]
