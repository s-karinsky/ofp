import Order from '@models/order'
import dbConnect from '@lib/dbConnect'
import handler from '@lib/handler'
import authorized from '@lib/middleware/authorized'
import { isValidPolygon } from '@lib/geo'

async function addOrderItems(req, res) {
    const { areaId, coords } = req.body || {}
    
    if (coords && !isValidPolygon(coords)) {
        throw new Error('Bad coordinates')
    }

    const polygon = coords && {
        type: 'Polygon',
        coordinates: coords
    }
    let order = await Order.findOne({ userId: res.userId, status: 'order' })
    if (!order) {
        order = await Order.create({
            userId: res.userId,
            items: []
        })
    }
    order.items.push({
        areaId,
        polygon
    })
    order.save()
    
    res.status(200).send({ order })
}

async function deleteOrderItems(req, res) {
    const { id } = req.body || {}
    const order = await Order.findOne({ user: res.userId, status: 'order' })
    if (!order) {
        throw new Error('Active order not found')
    }
    order.items.id(id).remove()
    order.save()
    res.status(200).json({ order })
}

async function changeOrder(req, res) {
    dbConnect()
    const { action } = req.body || {}

    switch (action) {
        case 'add':
            await addOrderItems(req, res)
            break

        case 'delete':
            await deleteOrderItems(req, res)
            break
    
        default:
            res.status(404).send()
            break
    }
    
}

async function getOrder(req, res) {
    const { status, id } = req.query || {}
    const query = { userId: res.userId }
    if (status) {
        query.status = status
    }
    if (id) {
        query._id = id
    }
    const orders = await Order.find(query)

    res.status(200).json({ orders })
}

handler
    .use(authorized)
    .post(changeOrder)
    .get(getOrder)

export default handler