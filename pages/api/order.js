import intersect from '@turf/intersect'
import { default as turfArea } from '@turf/area'
import { polygon as turfPolygon } from '@turf/helpers'
import Order from '@models/order'
import Area from '@models/area'
import dbConnect from '@lib/dbConnect'
import handler from '@lib/handler'
import authorized from '@lib/middleware/authorized'
import { isValidPolygon, isValidMultipolygon, reversePolygonCoords } from '@lib/geo'

async function addOrderItems(req, res) {
    const { areaId, coords } = req.body
    
    if (coords && !isValidPolygon(coords) && !isValidMultipolygon(coords)) {
        throw new Error('Invalid polygon')
    }
    const order = await Order.findOneAndUpdate({ userId: res.userId, status: 'order' }, {}, { new: true })
    const area = await Area.findById(areaId)

    if (!coords) {
        order.items.push({
            areaId,
            price: area.price
        })
    } else {
        const multipolygon = isValidMultipolygon(coords) ? coords : [coords]
        multipolygon.forEach(points => {
            const polygon = turfPolygon(reversePolygonCoords(points))
            const storePolygon = { type: 'Polygon', coordinates: reversePolygonCoords(points) }
            if (!area) {
                order.items.push({ polygon: storePolygon })
            } else if (area.price) {
                let price = area.price
                const intersection = intersect(polygon, area.polygon)
                if (intersection && intersection.geometry) {
                    const intersectionArea = turfArea(intersection)
                    const fullArea = turfArea(area.polygon)
                    price = Math.ceil(price * (intersectionArea / fullArea))
                } else {
                    price = null
                }
                order.items.push({
                    areaId,
                    polygon: storePolygon,
                    price
                })
            }
        })
    }
    order.save()
    res.status(200).send({ order })
}

async function deleteOrderItems(req, res) {
    const { id } = req.body
    if (!id) {
        throw new Error('id is required')
    }
    const order = await Order.findOneAndUpdate({
        userId: res.userId,
        status: 'order'
    }, {
        $pull: {
            items: {
                _id: id
            }
        }
    }, {
        returnDocument: 'after',
        lean: true
    })

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
        if (Array.isArray(status)) {
            query.status = { $in: status }
        } else {
            query.status = status
        }
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