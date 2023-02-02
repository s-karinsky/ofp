import User from '@models/user'
import dbConnect from '@lib/dbConnect'
import handler from '@lib/handler'

async function confirmUser(req, res) {
    dbConnect()
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