import jwt from 'jsonwebtoken'
import multer from 'multer'
import fs from 'fs'
import kmlParse from 'kml-parse'
import { DOMParser } from 'xmldom'
import createHandler from '@lib/handler'
import Area from '@models/area'
import externalApp from '@lib/middleware/externalApp'

const handler = createHandler(['db'])

const uploadPreview = multer({
    storage: multer.diskStorage({
        destination: './static/uploads',
        filename: (req, file, cb) => {
            const id = req.token.id
            const filename = `${id}${Date.now()}.${file.originalname.split('.').pop()}`
            cb(null, filename)
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'preview' && ['image/gif', 'image/jpeg', 'image/png'].indexOf(file.mimetype) === -1) {
            cb(new Error('Preview must be image'))
        }
        cb(null, true)
    }
})
const uploadPreviewMiddleware = uploadPreview.fields([
    {
        name: 'preview'
    }, {
        name: 'xml'
    }
])

async function checkTokenMiddleware(req, res, next) {
    const { token } = req.query || {}
    jwt.verify(token, process.env.APP_API_SECRET, function(error, decoded) {
        if (error) throw new Error(error)
        req.token = decoded
        next()
    })
}

function getPolygon(kmlGeometry) {
    if (kmlGeometry.type === 'Polygon') {
        return kmlGeometry.coordinates
    }
    if (kmlGeometry.type === 'GeometryCollection') {
        return kmlGeometry.geometries.map(getPolygon)
    }
}

async function createArea(req, res) {
    const id = req.token.id
    const { price, shootDate } = req.body
    const filename = req.files.preview[0].filename
    const xmlFile = req.files.xml[0].filename
    const xmlContent = fs.readFileSync(`./static/uploads/${xmlFile}`, 'utf8')
    const kmlDom = new DOMParser().parseFromString(xmlContent)
    const kml = kmlParse.parseGeoJSON(kmlDom)
    let polygon = []
    kml.features.map(feature => {
        polygon.push(getPolygon(feature.geometry))
    })
    try {
        const area = await Area.create({
            user: id,
            preview: filename,
            polygon: {
                type: "Polygon",
                coordinates: polygon[0]
            },
            price: parseInt(price),
            date: Date.now(),
            shootDate: new Date(shootDate)
        })
        res.status(201).send({
            id: area._id,
            preview: filename
        })
    } catch (e) {
        throw new Error(e)
    }

}

handler
    .use(externalApp)
    .use(checkTokenMiddleware)
    .use(uploadPreviewMiddleware)
    .post(createArea)

export const config = {
    api: {
        bodyParser: false
    }
}

export default handler