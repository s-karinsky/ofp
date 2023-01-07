import { useSelector, useDispatch } from 'react-redux'
import OrderSubmit from '@components/OrderSubmit'
import OrderSummary from '@components/OrderSummary'
import Order from '@components/Order'
import { setChecked, removeById } from '@store/cart'

const mapStatusText = {
    order: 'заказ'
}

export default function CartPage() {
    const cart = useSelector(state => state.cart)
    const dispatch = useDispatch()
    const submitItems = cart.items.filter(item => cart.checkedById[item.id])

    return (
        <div className="cart">
            <div className="container">
                <div className="cart_layout">
                    <div className="cart_submit">
                        <OrderSubmit items={submitItems} />
                    </div>
                    <div className="cart_details">
                        <div className="cart_summary">
                            <OrderSummary
                                index={cart.orderId}
                                date={cart.date}
                                count={cart.items.length}
                                status={mapStatusText[cart.status]}
                            />
                        </div>
                        <Order
                            index={cart.orderId}
                            date={cart.date}
                            status={mapStatusText[cart.status]}
                            items={cart.items}
                            checkedItems={cart.checkedById}
                            onCheck={val => dispatch(setChecked(val))}
                            onRemove={id => dispatch(removeById(id))}
                            withCheckboxes
                            withRemove
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
