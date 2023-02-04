import handler from '@lib/handler'
import sendMail from '@lib/sendMail'

async function sendContact(req, res) {
    const { body } = req
    if (body.type === 'consult') {
        const { name, email, phone, message } = body
        await sendMail({
            from: email,
            to: process.env.SMTP_USER,
            subject: 'Консультация',
            html: `<b>Имя: </b>${name}<br><b>E-mail: </b>${email}<br><b>Телефон: </b>${phone}<br><br>${message}`
        })
        res.status(201).json({ success: true })
        return
    }

    if (body.type === 'partner') {
        const { name, email, phone } = body
        await sendMail({
            from: email,
            to: process.env.SMTP_USER,
            subject: 'Заявка в партнерство',
            html: `<b>Имя: </b>${name}<br><b>E-mail: </b>${email}<br><b>Телефон: </b>${phone}`,
        })
        res.status(201).json({ success: true })
        return
    }

    res.status(404).json({ success: false })
}

handler.post(sendContact)

export default handler