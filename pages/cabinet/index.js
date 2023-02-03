import { useState } from 'react'
import { useSelector } from 'react-redux'
import Order from '@components/Order'
import OrderSummary from '@components/OrderSummary'

const statuses = {
    success: (<span style={{ color: '#0CA41B' }}>выполнено</span>)
}

export default function Cabinet() {
    const [ expandedOrders, setExpandedOrders ] = useState([])
    const orders = useSelector(state => state.profile.orders)
    
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