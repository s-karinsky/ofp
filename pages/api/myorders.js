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
    const orders = await Order
        .find({
            status: 'processed',
            items: {
                $elemMatch: {
                    areaId: {
                        "$in": areasId
                    }
                }
            }
        })
        .sort({ createdAt: -1 })

    orders.forEach(order => {
        order.items = order.items.filter(item => areasId.indexOf(item.areaId) !== -1)
    })

    res.status(200).json({ areas: userAreas, orders })
}

async function updateOrder(req, res) {
    const { orderId, itemId, done } = req.body
    if (!orderId || !itemId) {
        throw new Error('orderId and itemId are required')
    }
    Order.findOneAndUpdate({
        _id: orderId,
        "items._id": itemId
    }, {
        "$set": {
            "items.$.done": done
        }
    }, function(err, doc) {
        if (err) {
            res.status(500).json({ err })
        } else {
            res.status(200).json({ success: true })
        }
    })
}

handler
    .use(authorized)
    .get(getOrders)
    .post(updateOrder)

export default handler