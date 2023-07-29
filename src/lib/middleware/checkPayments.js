import axios from 'axios'
import Order from '@models/order'
import getPaykeeperHeaders from '@lib/getPaykeeperHeaders'

const { PAYKEEPER_SERVER } = process.env

export default async function checkPayments(req, res, next) {
  try {
    const orders = await Order.find({ payStatus: 'created', invoiceId: { $ne: undefined } })
    const headers = getPaykeeperHeaders()
    const uri = '/info/invoice/byid'
  
    const requests = orders.map(order =>
      axios
        .post(`${PAYKEEPER_SERVER}${uri}?id=${order.invoiceId}`, {}, { headers })
        .then(res => res.data)
    )
  
    const payments = await Promise.all(requests)

    await Promise.all(
      payments
        .filter(pay => pay.status !== 'created')
        .map(pay => console.log(pay) || Order.findByIdAndUpdate(pay.orderid, { payStatus: pay.status }))
    )
  } catch (e) {
    console.error('Error: ', e.message)
  } finally {
    next()
  }
}