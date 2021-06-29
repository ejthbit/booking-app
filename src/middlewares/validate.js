import { validationResult } from 'express-validator'

const validate = (schemas) => {
    return async (req, res, next) => {
        await Promise.all(schemas.map((schema) => schema.run(req)))
        const errorFormatter = ({ msg, param, nestedErrors }) => {
            return { type: req.url, method: req.method, error: param, message: msg, nestedErrors }
        }
        const result = validationResult(req).formatWith(errorFormatter)
        if (result.isEmpty()) return next()

        const errors = result.array()
        return res.status(400).json({ status: 400, errors })
    }
}

export default validate
