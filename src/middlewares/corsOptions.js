const buildWhitelist = () => {
    const baseOrigins =
        process.env.NODE_ENV === 'production'
            ? (process.env.ORIGIN || '').split(',')
            : (process.env.ORIGIN_DEV || '').split(',')
    const extraOrigins = process.env.CORS_EXTRA_ORIGINS ? process.env.CORS_EXTRA_ORIGINS.split(',') : []
    return new Set([...baseOrigins, ...extraOrigins].map((o) => o.trim()).filter(Boolean))
}

const whitelist = buildWhitelist()

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || whitelist.has(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
}
export default corsOptions
