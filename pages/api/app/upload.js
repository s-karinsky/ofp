import jwt from 'jsonwebtoken'
import multer from 'multer'
import handler from '@lib/handler'
import dbConnect from '@lib/dbConnect'
import Area from '@models/area'
import externalApp from '@lib/middleware/externalApp'

const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
            const id = req.token.id
            const filename = `${id}${Date.now()}.${file.originalname.split('.').pop()}`
            req.filename = filename
            cb(null, filename)
        }
    })
})
const uploadMiddleware = upload.single('preview')

async function checkTokenMiddleware(req, res, next) {
    const { token } = req.query || {}
    jwt.verify(token, process.env.APP_API_SECRET, function(error, decoded) {
        if (error) throw new Error(error)
        req.token = decoded
        next()
    })
}

async function loginUser(req, res) {
    dbConnect()
    const id = req.token.id
    const filename = req.filename
    
    try {
        const area = await Area.create({
            user: id,
            preview: filename,
            polygon: {
                type: "Polygon",
                coordinates: [
                    [
                        [53.73584425610803, 91.43732070922853],
                        [53.72873590918657, 91.45551681518555],
                        [53.71878220409145, 91.43577575683595],
                        [53.727212535607784, 91.42358779907228],
                        [53.73584425610803, 91.43732070922853]
                    ]
                ]
            }
        })
        res.status(201).send({ create: area._id })
    } catch (e) {
        throw new Error(e)
    }

}

handler
    .use(externalApp)
    .use(checkTokenMiddleware)
    .use(uploadMiddleware)
    .post(loginUser)

export const config = {
    api: {
        bodyParser: false
    }
}

export default handler