import { setCookie, hasCookie, getCookie } from 'cookies-next'
import User from '@models/user'
import sendMail from '@lib/sendMail'
import createHandler from '@lib/handler'

const handler = createHandler(['db'])

async function postRestorePassword(req, res) {
    const { body = {} } = req
    const { email, password } = body
    if (!email && password && hasCookie('restoreEmail', { req, res }) && hasCookie('restoreCode', { req, res })) {
        const mail = getCookie('restoreEmail', { req, res })
        const code = getCookie('restoreCode', { req, res })
        const date = Date.now() - 24 * 60 * 60 * 1000
        const user = await User.findOne({ email: mail, restoreCode: code }).where('restoreDate').gt(date)
        if (!user) {
            throw new Error('Bad request')
        }
        user.password = password
        user.restoreCode = null
        user.restoreDate = null
        user.save()
        deleteCookie('restoreEmail', {req, res })
        deleteCookie('restoreCode', { req, res })
        res.status(201).json({ message: 'Success' })
        return
    }

    // @TODO: make more safe code generation
    const restoreCode = (Math.random() + 1).toString(36).substring(2)
    const restoreDate = Date.now()

    const user = await User.findOneAndUpdate({ email }, { restoreCode, restoreDate })
    if (!user) {
        throw new Error('User not found')
    }

    await sendMail({
        from: `Ортофотоплан <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Восстановление пароля',
        html: `
            Кто-то запросил сброс пароля на сайте ортофотоплан. Если это были не вы, проигнорируйте это письмо.<br>
            Для изменения пароля перейдите по ссылке <a href="${process.env.BASE_URL}/api/restore?email=${email}&code=${restoreCode}" target="_blank">localhost:3000/api/restore?email=${email}&code=${restoreCode}</a>.<br>
            Ссылка действительна в течение 24 часов после получения письма.
        `
    })

    res.status(201).json({ message: 'Success' })
}

async function getRestorePassword(req, res) {
    const { query = {} } = req
    const { email, code } = query

    const date = Date.now() - 24 * 60 * 60 * 1000
    const user = await User.findOne({ email, restoreCode: code }).where('restoreDate').gt(date)

    if (!user) {
        throw new Error('Wrong code')
    }

    const cookieOptions = {
        req,
        res,
        httpOnly: true,
        sameSite: 'lax',
        secure: true
    }
    setCookie('restoreEmail', email, cookieOptions)
    setCookie('restoreCode', code, cookieOptions)
    res.redirect('/?reset=pass')
}

handler
    .post(postRestorePassword)
    .get(getRestorePassword)

export default handler