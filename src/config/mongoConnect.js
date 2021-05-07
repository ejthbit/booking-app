import mongoose from 'mongoose'

const mongoConnect = () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    mongoose.set('useCreateIndex', true)
    mongoose.set('toJSON', {
        virtuals: true,
        versionKey: false,
        transform: (doc, converted) => {
            delete converted._id
        },
    })
}

export default mongoConnect
