import nc from 'next-connect'
import dbConnect from '@lib/dbConnect'

export default (middlewares = []) => {
    const handler = nc({
        onError: (err, req, res) => {
            res.status(500).json({ error: err.toString() })
        },
        onNoMatch: (req, res) => {
            res.status(404).send("Page is not found")
        },
    })

    if (middlewares.includes('db')) {
        handler.use(async (req, res, next) => {
            await dbConnect()
            next()
        })
    }
    return handler
}