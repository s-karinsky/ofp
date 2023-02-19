import User from '@models/user'
import createHandler from '@lib/handler'
import sendMail from '@lib/sendMail'

const handler = createHandler(['db'])

async function createUser(req, res) {
    const { email, password, surname, name, phone } = req.body
    try {
        const confirmationCode = (Math.random() + 1).toString(36).substring(2)

        await User.create({
            email,
            password,
            name: `${surname} ${name}`,
            phone,
            confirmationCode
        })

        await sendMail({
            from: `Ортофотоплан <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Подтверждение e-mail',
            html: `
                Этот e-mail был указан для регистрации на сайте ортофотоплан<br>
                Для подтверждения перейдите по ссылке <a href="${process.env.BASE_URL}/api/confirm?email=${email}&code=${confirmationCode}" target="_blank">${process.env.BASE_URL}/api/confirm?email=${email}&code=${confirmationCode}</a>
            `
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