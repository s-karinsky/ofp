import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cn from 'classnames'
import Button from '@components/Button'
import { Input, Select, Checkbox } from '@components/Form'
import OrderSubmit from '@components/OrderSubmit'
import OrderSummary from '@components/OrderSummary'
import Order from '@components/Order'
import Popup from '@components/Popup'
import axios from '@lib/axios'
import { showPopup, hidePopup } from '@store/popup'
import { setChecked, removeById, setOrderItems } from '@store/cart'

const mapStatusText = {
    order: 'заказ'
}

export default function CartPage() {
    const [ isCompany, setIsCompany ] = useState()
    const cart = useSelector(state => state.cart)
    const dispatch = useDispatch()
    const submitItems = cart.items.filter(item => cart.checkedById[item.id])

    useEffect(() => {
        axios.get('order', { status: 'order' }).then(({ data: { orders } = {}} = {}) => {
            const order = orders && orders[0]
            const items = order.items || []
            const orderItems = items.map(item => ({
                id: item._id,
                price: item.price,
                name: item.areaId ? 'Ортофотоплан' : 'Заказ съемки',
                preview: '',
                type: item.areaId ? 'plan' : 'shoot'
            }))
            dispatch(setOrderItems(orderItems))
        })
    }, [])

    return (
        <div className="cart">
            <Popup name="submit-order">
                <div className="cart_popupTitle">
                    <span>Заказ № {cart.orderId}</span>
                    <span>Дата {cart.date}</span>
                </div>
                <div className="cart_popupContent">
                    <div className="cart_popupInput">
                        <Input placeholder="ФИО" required />
                    </div>
                    <div className="cart_popupInput">
                        <Input placeholder="E-mail" required />
                    </div>
                    <div className="cart_popupInput">
                        <Input placeholder="Телефон" required />
                    </div>
                    <div className="cart_popupCompany">
                        <Button
                            className={cn("cart_popupCompanyBtn", {
                                cart_popupCompanyBtn__white: isCompany
                            })}
                            width="275px"
                            height="34px"
                            color={isCompany ? 'white' : 'orange'}
                            onClick={() => setIsCompany(!isCompany)}
                        >{isCompany ? '-' : '+'} добавить организацию</Button>
                    </div>
                    {isCompany && <>
                        <div className="cart_popupInput">
                            <Select
                                placeholder="Правовая форма"
                                options={[
                                    { value: 1, label: 'ИП' },
                                    { value: 2, label: 'Акционерное общество' }
                                ]}
                                required
                            />
                        </div>
                        <div className="cart_popupInput">
                            <Input placeholder="Название" required />
                        </div>
                        <div className="cart_popupInput">
                            <Input placeholder="Электронный адрес" required />
                        </div>
                        <div className="cart_popupInput">
                            <Input placeholder="Телефон" required />
                        </div>
                        <div className="cart_popupInput">
                            <Input placeholder="ИНН" required />
                        </div>
                        <div className="cart_popupInput">
                            <Input placeholder="КПП" required />
                        </div>
                        <div className="cart_popupInput">
                            <Input placeholder="Банк" required />
                        </div>
                        <div className="cart_popupInput">
                            <Input placeholder="Расчетный счет" required />
                        </div>
                    </>}
                    <div className="cart_popupHeader">Параметры съемки ортофотоплана</div>
                    <div className="cart_popupInput">
                        <div className="cart_popupLabel">Разрешение</div>
                        <span className="cart_popupSmallInput"><Input className="cart_popupField" /></span> см/пк
                    </div>
                    <div className="cart_popupInput cart_popupInputSunheader">
                        Рекомендуемый диапазон:
                    </div>
                    <div className="cart_popupInput">
                        <div className="cart_popupLabel">Перекрытие</div>
                        <span className="cart_popupLabelContent">
                            Поперечное <span className="cart_popupSmallInput"><Input className="cart_popupField cart_popupFieldSmall" /></span> %<br />
                            Продольное <span className="cart_popupSmallInput"><Input className="cart_popupField cart_popupFieldSmall" /></span> %
                        </span>
                    </div>
                    <div className="cart_popupInput cart_popupInputSunheader">
                        Рекомендуемый диапазон поперечного перекрытия, продольного перекрытия
                    </div>
                    <div className="cart_popupInput">
                        <div className="cart_popupLabel" style={{ marginRight: '20px' }}>Точность</div>
                        <span className="cart_popupSmallInput"><Input className="cart_popupField" /></span>
                    </div>
                    <div className="cart_popupInput">
                        <div className="cart_popupLabel" style={{ marginRight: '20px' }}>Освещенность</div>
                        <span className="cart_popupSmallInput"><Input className="cart_popupField" /></span>
                    </div>
                    <div className="cart_popupInput">
                        <Checkbox>
                            <span className="cart_popupCheckbox">Я даю согласие на <a>обработку персональных данных</a></span>
                        </Checkbox>
                    </div>
                    <div className="cart_popupInput">
                        <Button color="orange" fullSize>Перейти к оплате</Button>
                    </div>
                    <div className="cart_popupInput">
                        <Button color="gray" onClick={() => dispatch(hidePopup())} fullSize>Отмена</Button>
                    </div>
                </div>
            </Popup>
            <div className="container">
                <div className="cart_layout">
                    <div className="cart_submit">
                        <OrderSubmit
                            items={submitItems}
                            onSubmit={() => dispatch(showPopup('submit-order'))}
                        />
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
