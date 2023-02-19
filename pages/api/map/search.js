import Area from '@models/area'
import createHandler from '@lib/handler'
import { isValidMultipolygon } from '@lib/geo'

const handler = createHandler(['db'])

async function searchAreas(req, res) {
    const { coords, date_from, date_to } = req.query
    let points
    try {
        points = JSON.parse(coords)
    } catch(e) {
        throw new Error('Incorrect points')
    }
    if (!isValidMultipolygon(points)) {
        throw new Error('Incorrect points')
    }

    const date = {
        $lte: new Date()
    }
    if (Number(date_from)) {
        date.$gte = new Date(Number(date_from))
    }
    if (Number(date_to)) {
        date.$lte = new Date(Number(date_to))
    }
    
    const promises = points.map(coordinates => Area.find({
        polygon: {
            $geoIntersects: {
                $geometry: {
                    type: 'Polygon', 
                    coordinates
                }
            }
        },
        date
    }))

    Promise.all(promises)
        .then(data => {
            const result = data
                .reduce((buf, item) => buf.concat(item), [])
                .map(item => ({
                    id: item._id,
                    polygon: item.polygon.coordinates,
                    date: item.date,
                    preview: item.preview,
                    price: item.price
                }))
            res.status(200).send({ result })
        })
        .catch(error => {
            res.status(500).json({ error })
        })
}

handler
    .get(searchAreas)

export default handler