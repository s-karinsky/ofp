import { useEffect, useState } from 'react'
import { getFormattedDate } from '@lib/datetime'
import axios from '@lib/axios'

export default function PageResetPassword() {
    const [ orders, setOrders ] = useState([])

    useEffect(() => {
        axios.get('myorders').then(({ data }) => {
            const { areas = [], orders = [] } = data
            const areaById = areas.reduce((res, area) => ({ ...res, [area._id]: area }), {})
            orders.forEach(order => {
                order.items = order.items.filter(item => item.polygon?.coordinates?.length > 0)
                order.items.forEach(item => {
                    if (item.areaId && areaById[item.areaId]) {
                        item.area = areaById[item.areaId]
                    }
                })
            })
            setOrders(orders)
        })
    }, [])

    return orders.length === 0 ? null :
        (
            <div className="myorders">
                {orders.map(order => (
                    <div className="myorders_order" key={order._id}>
                        {order.items.map(item => (
                            <div className="myorders_orderItem" key={item._id}>
                                <b>Дата заказа</b> {getFormattedDate(order.createdAt)}<br />
                                <b>Миниатюра ортофотоплана</b><br /><img className="myorders_orderPreview" src={`/uploads/${item.area?.preview}`} /><br />
                                <b>Заказанные координаты</b> {JSON.stringify(item.polygon?.coordinates)}<br />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        )
}