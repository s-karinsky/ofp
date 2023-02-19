import User from '@models/user'
import createHandler from '@lib/handler'

const handler = createHandler(['db'])

async function confirmUser(req, res) {
    const query = req.query || {}
    const { email, code } = query

    const user = await User.findOneAndUpdate({ email, confirmationCode: code }, { confirmationCode: null  })
    if (user && user._id) {
        res.redirect('/?confirm=ok')
    } else {
        res.redirect('/?confirm=fail')
    }
}

handler.get(confirmUser)

export default handler