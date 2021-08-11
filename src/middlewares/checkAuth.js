import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.status(403).send('A token is required for authentication')

    try {
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).send('Invalid Token')
    }
}
export default verifyToken
