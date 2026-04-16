export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) return next(err)
    console.error(err)
    res.status(err.statusCode || 500).json({
        error: err.message || 'Internal server error',
        // Don't expose stack trace in production
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    })
}
