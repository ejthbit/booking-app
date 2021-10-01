import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    port: 465, // true for 465, false for other ports
    host: process.env.SMTP_SERVER,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.MAILER_PASS,
    },
    secure: true,
})

export const checkMailerConnection = () =>
    transporter.verify((error) => {
        if (error) return false
        else return true
    })

export const sendMail = (mailData, res) =>
    transporter.sendMail(mailData, (error, info) => {
        if (error) return error
        else res.status(200).send({ message: 'Mail send successfully', message_id: info.messageId })
    })

export default transporter
