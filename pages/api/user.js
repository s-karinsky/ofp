import User from '@models/user'
import dbConnect from '@lib/dbConnect'
import handler from '@lib/handler'
import authorized from '@lib/middleware/authorized'

async function getUser(req, res) {
    dbConnect()
    
    const user = await User.findById(res.userId, ['email', 'name', 'phone', 'legalForm', 'birthdate'])
    if (!user) {
        throw new Error('User not found')
    }

    res.status(200).json({ user })
}

async function updateUser(req, res) {
    dbConnect()
    const { password, password_repeat, password_old, ...data } = req.body || {}
    if (password && password_repeat && password_old) {
        const user = await User.findById(res.userId).select('+password')
        if (!user) throw new Error('Wrong user')
        const pwValid = await user.comparePassword(password_old)
        if (!pwValid) {
            throw new Error('Wrong password')
        }
        if (password !== password_repeat) {
            throw new Error('Different passwords')
        }
        user.password = password
        user.save()
        res.status(200).json({ success: true })
        return
    }
    const user = await User.findByIdAndUpdate(res.userId, data, {
        new: true,
        select: 'email name phone legalForm birthdate'
    })
    res.status(200).json({ user })
}

handler
    .use(authorized)
    .get(getUser)
    .post(updateUser)

export default handler