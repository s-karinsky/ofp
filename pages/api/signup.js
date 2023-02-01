import User from '@models/user'
import dbConnect from '@lib/dbConnect'
import handler from '@lib/handler'
import sendMail from '@lib/sendMail'

async function createUser(req, res) {
    const data = req.body
    const { email, password, surname, name, phone } = data
    dbConnect()
    try {
        const confirmationCode = (Math.random() + 1).toString(36).substring(2)

        await sendMail({
            from: `Ортофотоплан <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Подтверждение e-mail',
            html: `
                Этот e-mail был указан для регистрации на сайте ортофотоплан<br>
                Для подтверждения перейдите по ссылке <a href="localhost:3000/api/confirm?email=${email}&code=${confirmationCode}" target="_blank">localhost:3000/api/confirm?email=${email}&code=${confirmationCode}</a>
            `
        })

        await User.create({
            email,
            password,
            name: `${surname} ${name}`,
            phone,
            confirmationCode
        })

        res.status(201).json({ message: 'User created' })
    } catch (e) {
        if (e.toString().indexOf('duplicate key error collection') !== -1) {
            throw 'duplicate'
        }
        throw e.toString()
    }
    
}

handler.post(createUser)

export default handler