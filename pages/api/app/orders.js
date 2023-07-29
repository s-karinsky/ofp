import createHandler from '@lib/handler'
import Area from '@models/area'
import Order from '@models/order'
import externalApp from '@lib/middleware/externalApp'
import checkTokenMiddleware from '@lib/middleware/appCheckToken'
import checkPayments from '@lib/middleware/checkPayments'


const handler = createHandler(['db'])

async function getPaidOrders(req, res) {
    const { id: userId } = req.token
    const areas = await Area.find({ userId })
    const areasId = areas.map(area => String(area._id))

    const orders = await Order.find({
        'items.areaId': { $in: areasId },
        payStatus: 'paid',
        status: 'processed'
    })
    let items = []
    orders.map(order => {
        const item = { order: order._id }
        item.items = order.items.filter(item => areasId.includes(item.areaId))
        items.push(item)
    })

    res.json({ items })
}

handler
    .use(externalApp)
    .use(checkTokenMiddleware)
    .use(checkPayments)
    .get(getPaidOrders)

    export default handler