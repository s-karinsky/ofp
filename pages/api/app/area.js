import createHandler from '@lib/handler'
import Area from '@models/area'
import externalApp from '@lib/middleware/externalApp'

const handler = createHandler(['db'])

async function getArea(req, res) {
    const { id } = req.query || {}
    if (!id || typeof id !== 'string') {
        res.status(500).json({ error: 'Bad id' })
        return
    }
    const ids = id.split(',')
    
    const areas = await Area.find({ id: { $or: ids }})
    res.status(200).json({ areas })
}

handler
    .use(externalApp)
    .get(getArea)

export default handler