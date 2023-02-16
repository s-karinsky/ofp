import intersect from '@turf/intersect'
import { default as turfArea } from '@turf/area'
import { polygon as turfPolygon } from '@turf/helpers'
import Order from '@models/order'
import Area from '@models/area'
import dbConnect from '@lib/dbConnect'
import handler from '@lib/handler'
import authorized from '@lib/middleware/authorized'
import { isValidPolygon, reversePolygonCoords } from '@lib/geo'

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

    const item = {
        areaId,
        polygon
    }
    if (areaId) {
        const area = await Area.findById(areaId)
        if (!area) {
            item.areaId = null
        } else {
            let ratio = 1
            if (polygon) {
                const fullPolygon = area.polygon
                const intersection = intersect(
                    turfPolygon(reversePolygonCoords(polygon.coordinates)),
                    turfPolygon(fullPolygon.coordinates)
                )
                if (intersection && intersection.geometry) {
                    const interArea = turfArea(intersection)
                    const fullArea = turfArea(fullPolygon)
                    ratio = interArea / fullArea
                }
            }
            item.price = area.price ? Math.ceil(area.price * ratio) : null
        }
    }

    order.items.push(item)
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

async function submitOrder(req, res) {
    dbConnect()
    const { skipItems, orderDetails } = req.body || {}
    const order = await Order.findOne({ userId: res.userId, status: 'order' })

    if (!order) {
        throw new Error('Order not found')
    }

    const resJson = {}
    if (skipItems && skipItems.length && order.items) {
        const newOrderItems = []
        skipItems.map(id => {
            const { _id, ...item } = order.items.id(id)
            newOrderItems.push(item)
            order.items.id(id).remove()
        })
        order.save()
        if (newOrderItems.length) {
            resJson.order = await Order.create({ userId: res.userId, status: 'order', items: newOrderItems })
        }
    }
    await order.updateOne({ status: 'processed', details: orderDetails })
    resJson.success = true

    res.status(200).send(resJson)
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

        case 'send':
            await submitOrder(req, res)
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