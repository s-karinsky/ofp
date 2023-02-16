import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Order from '@components/Order'
import OrderSummary from '@components/OrderSummary'
import axios from '@lib/axios'
import { setOrders } from '@store/profile'

const statuses = {
    success: (<span style={{ color: '#0CA41B' }}>выполнено</span>),
    processed: (<span style={{ color: '#f2d324' }}>выполняется</span>),
}

const orderItemsToCart = items => items.map(item => ({
    id: item._id,
    price: item.price,
    name: item.areaId ? 'Ортофотоплан' : 'Заказ съемки',
    preview: '',
    type: item.areaId ? 'plan' : 'shoot'
}))

export default function Cabinet() {
    const [ expandedOrders, setExpandedOrders ] = useState([])
    const orders = useSelector(state => state.profile.orders)
    const dispatch = useDispatch()

    useEffect(() => {
        axios.get('order', { params: { status: ['processed', 'success'] } }).then(({ data: { orders } = {}} = {}) => {
            const userOrders = orders.map(({ _id, userId, ...order }) => {
                const items = orderItemsToCart(order.items)
                return {
                    orderId: _id,
                    ...order,
                    items
                }
            })
            console.log(userOrders)
            dispatch(setOrders(userOrders))
        })
    }, [])
    
    return (
        <div className="cabinet_orders">
            {orders.map(order => (
                <div className="cabinet_order" key={order.orderId}>
                    {expandedOrders.indexOf(order.orderId) !== -1 ? (
                        <Order
                            index={order.orderId}
                            date={order.date}
                            status={statuses[order.status]}
                            items={order.items}
                            onCollapse={() => setExpandedOrders(expandedOrders.filter(id => id !== order.orderId))}
                        />
                    ) : (
                        <OrderSummary
                            index={order.orderId}
                            date={order.date}
                            status={statuses[order.status]}
                            count={order.items.length}
                            onExpand={() => setExpandedOrders([...expandedOrders, order.orderId])}
                        />
                    )
                    }
                </div>)
            )}
        </div>
    )
}