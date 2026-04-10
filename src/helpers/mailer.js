import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    port: 465,
    host: process.env.SMTP_SERVER,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.MAILER_PASS,
    },
    secure: true,
})

export const checkMailerConnection = () =>
    transporter.verify().then(() => true).catch(() => false)

export const sendMail = (mailData) =>
    transporter.sendMail(mailData).catch((error) => {
        console.error('Failed to send email:', error)
    })

export default transporter
