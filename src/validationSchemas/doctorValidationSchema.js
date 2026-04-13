import { body } from 'express-validator'

export const createDoctorValidationSchema = [
    body('name', 'Name is required').exists({ checkFalsy: true }).isString(),
    body('workplace_id', 'workplace_id must be an array of strings')
        .optional()
        .isArray()
        .custom((arr) => arr.every((v) => typeof v === 'string'))
        .withMessage('workplace_id must be an array of strings'),
    body('categories', 'categories must be an array').optional().isArray(),
    body('preferred_service_start', 'preferred_service_start must be a string in HH:MM format')
        .optional()
        .isString()
        .matches(/^\d{2}:\d{2}$/),
]

export const updateDoctorValidationSchema = [
    body('name', 'name must be a non-empty string').optional().isString().notEmpty(),
    body('workplace_id', 'workplace_id must be an array of strings')
        .optional()
        .isArray()
        .custom((arr) => arr.every((v) => typeof v === 'string'))
        .withMessage('workplace_id must be an array of strings'),
    body('categories', 'categories must be an array').optional().isArray(),
    body('preferred_service_start', 'preferred_service_start must be a string in HH:MM format')
        .optional()
        .isString()
        .matches(/^\d{2}:\d{2}$/),
]
