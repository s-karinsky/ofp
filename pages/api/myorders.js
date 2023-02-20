import User from '@models/user'
import Area from '@models/area'
import Order from '@models/order'
import createHandler from '@lib/handler'
import authorized from '@lib/middleware/authorized'

const handler = createHandler(['db'])

async function getOrders(req, res) {
    const user = await User.findById(res.userId)
    if (!user || user.role !== 'seller') {
        throw new Error('Bad user')
    }
    const userAreas = await Area.find({ user: res.userId })
    const areasId = userAreas.map(area => area._id.toString())
    const orders = await Order.find({ status: 'processed', items: { $elemMatch: { areaId: { "$in": areasId } } } })
    orders.forEach(order => {
        order.items = order.items.filter(item => areasId.indexOf(item.areaId) !== -1)
    })

    res.status(200).json({ areas: userAreas, orders })
}

handler
    .use(authorized)
    .get(getOrders)

export default handler