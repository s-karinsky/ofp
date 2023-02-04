import Subscriber from '@models/subscriber'
import dbConnect from '@lib/dbConnect'
import handler from '@lib/handler'
import sendMail from '@lib/sendMail'

async function unsubscribe(req, res) {
    const { query: { email, code } = {} } = req
    dbConnect()
    
    const result = await Subscriber.findOneAndRemove({ email, unsubscribeCode: code })
    if (result) {
        res.status(200).send('Unsubscribed')
    } else {
        res.status(404).send('User not found')
    }
}

async function subscribe(req, res) {
    const data = req.body
    const { email } = data
    dbConnect()

    try {
        const unsubscribeCode = (Math.random() + 1).toString(36).substring(2)

        await Subscriber.create({
            email,
            unsubscribeCode
        })

        await sendMail({
            from: `Ортофотоплан <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Подписка',
            html: `
                Вы были подписаны на новости сайта ортофотоплан<br>
                Для отмены подписки перейдите по ссылке <a href="${process.env.BASE_URL}/api/subscribe?email=${email}&code=${unsubscribeCode}" target="_blank">localhost:3000/api/subscribe?email=${email}&code=${unsubscribeCode}</a>
            `
        })

        res.status(201).json({ success: true })
    } catch (e) {
        if (e.toString().indexOf('duplicate key error collection') !== -1) {
            throw 'duplicate'
        }
        throw e.toString()
    }
    
}

handler
    .post(subscribe)
    .get(unsubscribe)

export default handler