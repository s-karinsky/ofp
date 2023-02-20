import Area from '@models/area'
import dbConnect from '@lib/dbConnect'
import createHandler from '@lib/handler'

const handler = createHandler()

handler.get(async (req, res) => {
    await dbConnect()
    const { id } = req.query || {}
    const area = await Area.findById(id)
    if (!area) {
        res.status(200).json({ success: false, error: 'Area not found' })
    } else {
        res.status(200).json({ success: true, area })
    }
})

export default handler
