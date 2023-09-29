import multer from 'multer'
import fs from 'fs'
import kmlParse from 'kml-parse'
import { DOMParser } from 'xmldom'
import createHandler from '@lib/handler'
import Area from '@models/area'
import externalApp from '@lib/middleware/externalApp'
import checkTokenMiddleware from '@lib/middleware/appCheckToken'

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
    const { price, shootDate, meta } = req.body
    const filename = req.files.preview[0].filename
    const xmlFile = req.files.xml[0].filename
    const xmlContent = fs.readFileSync(`./static/uploads/${xmlFile}`, 'utf8')
    const kmlDom = new DOMParser().parseFromString(xmlContent)
    const kml = kmlParse.parseGeoJSON(kmlDom)
    let polygon = []
    kml.features.map(feature => {
        polygon.push(getPolygon(feature.geometry))
    })
    let metadata = {}
    if (meta) {
        try {
            metadata = JSON.parse(meta)
        } catch (e) {
            console.info('Incorrect json of metadata')
        }
    }
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
            shootDate: new Date(shootDate),
            metadata
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