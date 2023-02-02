import nodemailer from 'nodemailer'

const {
    SMTP_SERVICE,
    SMTP_USER,
    SMTP_PASS,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE
} = process.env

export default async function({ from, to, subject, text, html }) {
    const config = {
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        }
    }

    if (SMTP_SERVICE) {
        config.service = SMTP_SERVICE
    } else {
        config.host = SMTP_HOST
        config.port = SMTP_PORT
        config.secure = SMTP_SECURE
    }

    const transporter = nodemailer.createTransport(config)

    const result = await transporter.sendMail({ from, to, subject, text, html })
}