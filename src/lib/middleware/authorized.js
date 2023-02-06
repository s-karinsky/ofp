import { getServerSession } from 'next-auth/next'
import { getToken } from 'next-auth/jwt'

export default async function(req, res, next) {
    const session = await getServerSession(req, res)
    if (!session) {
        res.status(401).json({ message: 'You must be logged in' })
        return
    }
    const token = await getToken({ req })
    res.userId = token.user._id

    next()
}