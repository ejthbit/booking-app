const whitelist = process.env.NODE_ENV === 'production' ? process.env.ORIGIN.split(',') : process.env.ORIGIN_DEV
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
}
export default corsOptions
