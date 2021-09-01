import { body } from 'express-validator'

export const bookingValidationSchema = [
    body('name', 'Name field cannot be empty!').exists({
        checkFalsy: true,
    }),
    body('email', 'Invalid email').optional().isEmail(),
    body('phone', 'Invalid phone').optional().isInt(),
    body('birthDate', 'Birth date field cannot be empty!').exists({
        checkNull: true,
    }),
    body('workplace', 'Workplace cannot be empty!').exists({
        checkNull: true,
    }),
]
