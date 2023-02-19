import jwt from 'jsonwebtoken'
import createHandler from '@lib/handler'
import User from '@models/user'
import externalApp from '@lib/middleware/externalApp'

const handler = createHandler(['db'])

async function loginUser(req, res) {
    const { email, password } = req.body || {}
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        throw new Error('No user with a matching email was found.')
    }
    if (user.confirmationCode) {
        throw new Error('User not confirm own e-mail')
    }
    // if (user.role !== 'seller') {
    //     throw new Error('User role is not seller')
    // }
    const pwValid = await user.comparePassword(password)
    if (!pwValid) {
        throw new Error("Your password is invalid")
    }
    const token = jwt.sign({ id: user._id }, process.env.APP_API_SECRET, {
        expiresIn: '1h'
    })
    res.status(200).json({ token })
}

handler
    .use(externalApp)
    .post(loginUser)

export default handler