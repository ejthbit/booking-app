const bookingSchema = {
    name: {
        in: ['body'],
        notEmpty: true,
        errorMessage: 'Name field cannot be empty',
    },
    birthDate: {
        in: ['body'],
        notEmpty: true,
        errorMessage: 'Birth date field cannot be empty',
    },
}
export default bookingSchema
