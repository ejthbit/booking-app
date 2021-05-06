import mongoose from 'mongoose'

const mongoConnect = () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    mongoose.set('useCreateIndex', true)
}

export default mongoConnect
