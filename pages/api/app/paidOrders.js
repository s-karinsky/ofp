import createHandler from '@lib/handler'
import Order from '@models/order'
import externalApp from '@lib/middleware/externalApp'
import checkTokenMiddleware from '@lib/middleware/appCheckToken'
import checkPayments from '@lib/middleware/checkPayments'

const handler = createHandler(['db'])

async function getPaidOrders(req, res) {
    const { id: userId } = req.token
    const orders = await Order.find({ userId, payStatus: 'paid' })

    res.json({ orders })
}

handler
    .use(externalApp)
    .use(checkTokenMiddleware)
    .use(checkPayments)
    .get(getPaidOrders)

export default handler