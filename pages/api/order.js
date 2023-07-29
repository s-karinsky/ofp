import axios from 'axios'
import { polygon as turfPolygon } from '@turf/helpers'
import Area from '@models/area'
import Order from '@models/order'
import User from '@models/user'
import authorized from '@lib/middleware/authorized'
import checkPayments from '@lib/middleware/checkPayments'
import { isValidPolygon, isValidMultipolygon, reversePolygonCoords, getIntersectionPrice } from '@lib/geo'
import createHandler from '@lib/handler'
import getPaykeeperHeaders from '@lib/getPaykeeperHeaders'

const { PAYKEEPER_SERVER } = process.env

const handler = createHandler(['db'])

async function addOrderItems(req, res) {
    const { areaId, coords } = req.body
    
    if (coords && !isValidPolygon(coords) && !isValidMultipolygon(coords)) {
        throw new Error('Invalid polygon')
    }
    let order = await Order.findOneAndUpdate({ userId: res.userId, status: 'order' }, {}, { new: true })
    if (!order) {
        order = await Order.create({ userId: res.userId, status: 'order', items: [] })
    }

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
                const price = getIntersectionPrice(area.polygon, polygon, area.price)
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

    const orderId = order._id
    const user = await User.findById(order.userId)
    const price = order.items.reduce((sum, item) => sum + item.price, 0)

    const headers = getPaykeeperHeaders()
    const payToken = '/info/settings/token/'
    const payPreview = '/change/invoice/preview/'
    
    const resToken = await axios.get(`${PAYKEEPER_SERVER}${payToken}`, { headers })
    const token = resToken.data.token
    const data = {
        pay_amount: price,
        clientid: user.name,
        orderid: orderId,
        client_email: user.email,
        token
    }
    const invoiceRes = await axios.post(`${PAYKEEPER_SERVER}${payPreview}`, data, { headers })

    resJson.success = true
    resJson.invoiceId = invoiceRes.data.invoice_id
    resJson.invoiceLink = `${PAYKEEPER_SERVER}/bill/${resJson.invoiceId}`
    await order.updateOne({
        status: 'processed',
        payStatus: 'created',
        invoiceId: resJson.invoiceId,
        details: orderDetails
    })

    res.status(200).send(resJson)
}

async function postOrder(req, res) {
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
    .use(checkPayments)
    .post(postOrder)
    .get(getOrder)

export default handler