import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cn from 'classnames'
import Button from '@components/Button'
import { Input, Select, Checkbox } from '@components/Form'
import OrderSubmit from '@components/OrderSubmit'
import OrderSummary from '@components/OrderSummary'
import Spinner from '@components/Spinner'
import Order from '@components/Order'
import Popup from '@components/Popup'
import AreaPreview from '@components/AreaPreview'
import { useForm } from '@lib/hooks'
import { isValidEmail } from '@lib/utils'
import axios from '@lib/axios'
import { reversePolygonCoords } from '@lib/geo'
import { showPopup, hidePopup, showMessage } from '@store/popup'
import { setChecked, removeById, setOrderItems, setOrderCount } from '@store/cart'

const mapStatusText = {
    order: 'заказ'
}

const orderItemsToCart = items => items.map(item => ({
    id: item._id,
    price: item.price,
    name: item.areaId ? 'Ортофотоплан' : 'Заказ съемки',
    preview: '',
    type: item.areaId ? 'plan' : 'shoot',
    areaId: item.areaId,
    polygon: reversePolygonCoords(item.polygon?.coordinates)
}))

export default function CartPage() {
    const [ isCompany, setIsCompany ] = useState()
    const [ removingItems, setRemovingItems ] = useState([])
    const [ isSubmitting, setIsSubmitting ] = useState()
    const [ areaPreview, setAreaPreview ] = useState({})
    const cart = useSelector(state => state.cart)
    const dispatch = useDispatch()
    const submitItems = cart.items.filter(item => cart.checkedById[item.id])

    useEffect(() => {
        axios.get('order', { params: { status: 'order' } }).then(({ data: { orders } = {}} = {}) => {
            const order = orders && orders[0]
            if (!order) return
            const items = orderItemsToCart(order.items || [])
            dispatch(setOrderItems(items))
        })
    }, [])

    const sendOrder = async (values) => {
        if (!cart.items || !cart.items.length) return
        setIsSubmitting(true)
        const skipItems = cart.items.filter(item => !cart.checkedById[item.id]).map(({ id }) => id)
        return axios.post('order', { action: 'send', skipItems, orderDetails: values })
    }

    const { handleSubmit, register } = useForm({
        action: sendOrder
    })

    return (
        <div className="cart">
            <Popup name="area-preview">
                <AreaPreview {...areaPreview} />
            </Popup>
            {cart.orderCount > 0 ? <>
                <Popup name="submit-order">
                    {isSubmitting ?
                        <Spinner color="green" /> :
                        <>
                        <div className="cart_popupTitle">
                            <span>Заказ № {cart.orderId}</span>
                            <span>Дата {cart.date}</span>
                        </div>
                        <form onSubmit={handleSubmit(({ data } = {}) => {
                            dispatch(hidePopup())
                            setIsSubmitting(false)
                            if (data.success) {
                                dispatch(showMessage({
                                    icon: 'success',
                                    text: 'Заказ успешно оформлен. Статус заказа вы можете посмотреть в личном кабинете'
                                }))
                            }
                            if (data.order) {
                                const items = orderItemsToCart(data.order.items || [])
                                dispatch(setOrderItems(items))
                                dispatch(setOrderCount(items.length))
                            } else {
                                dispatch(setOrderCount(0))
                            }
                        })} noValidate>
                            <div className="cart_popupContent">
                                <div className="cart_popupInput">
                                    <Input
                                        placeholder="ФИО"
                                        {...register('name', {
                                            required: true
                                        })}
                                    />
                                </div>
                                <div className="cart_popupInput">
                                    <Input
                                        placeholder="E-mail"
                                        {...register('email', {
                                            required: true,
                                            getValidationError: val => !isValidEmail(val) && 'Введите корректный e-mail'
                                        })}
                                    />
                                </div>
                                <div className="cart_popupInput">
                                    <Input
                                        placeholder="Телефон"
                                        {...register('phone', {
                                            required: true
                                        })}
                                    />
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
                                    >{isCompany ? '- убрать организацию' : '+ добавить организацию'}</Button>
                                </div>
                                {isCompany && <>
                                    <div className="cart_popupInput">
                                        <Select
                                            placeholder="Правовая форма"
                                            options={[
                                                { value: 1, label: 'ИП' },
                                                { value: 2, label: 'Акционерное общество' }
                                            ]}
                                            {...register('company.legalForm')}
                                        />
                                    </div>
                                    <div className="cart_popupInput">
                                        <Input
                                            placeholder="Название"
                                            {...register('company.name')}
                                        />
                                    </div>
                                    <div className="cart_popupInput">
                                        <Input
                                            placeholder="Электронный адрес"
                                            {...register('company.email')}
                                        />
                                    </div>
                                    <div className="cart_popupInput">
                                        <Input
                                            placeholder="Телефон"
                                            {...register('company.phone')}
                                        />
                                    </div>
                                    <div className="cart_popupInput">
                                        <Input
                                            placeholder="ИНН"
                                            {...register('company.inn')}
                                        />
                                    </div>
                                    <div className="cart_popupInput">
                                        <Input
                                            placeholder="КПП"
                                            {...register('company.kpp')}
                                        />
                                    </div>
                                    <div className="cart_popupInput">
                                        <Input
                                            placeholder="Банк"
                                            {...register('company.bank')}
                                        />
                                    </div>
                                    <div className="cart_popupInput">
                                        <Input
                                            placeholder="Расчетный счет"
                                            {...register('company.checkingAccount')}
                                        />
                                    </div>
                                </>}
                                <div className="cart_popupHeader">Параметры съемки ортофотоплана</div>
                                <div className="cart_popupInput">
                                    <div className="cart_popupLabel">Разрешение</div>
                                    <span className="cart_popupSmallInput">
                                        <Input className="cart_popupField" {...register('shootParams.resolution')} />
                                    </span> см/пк
                                </div>
                                <div className="cart_popupInput cart_popupInputSunheader">
                                    Рекомендуемый диапазон:
                                </div>
                                <div className="cart_popupInput">
                                    <div className="cart_popupLabel">Перекрытие</div>
                                    <span className="cart_popupLabelContent">
                                        Поперечное <span className="cart_popupSmallInput">
                                            <Input className="cart_popupField cart_popupFieldSmall" {...register('shootParams.crossOverlap')} />
                                        </span> %<br />
                                        Продольное <span className="cart_popupSmallInput">
                                            <Input className="cart_popupField cart_popupFieldSmall" {...register('shootParams.longOverlap')} />
                                        </span> %
                                    </span>
                                </div>
                                <div className="cart_popupInput cart_popupInputSunheader">
                                    Рекомендуемый диапазон поперечного перекрытия, продольного перекрытия
                                </div>
                                <div className="cart_popupInput">
                                    <div className="cart_popupLabel" style={{ marginRight: '20px' }}>Точность</div>
                                    <span className="cart_popupSmallInput"><Input className="cart_popupField" {...register('shootParams.accuracy')} /></span>
                                </div>
                                <div className="cart_popupInput">
                                    <div className="cart_popupLabel" style={{ marginRight: '20px' }}>Освещенность</div>
                                    <span className="cart_popupSmallInput"><Input className="cart_popupField" {...register('shootParams.light')} /></span>
                                </div>
                                <div className="cart_popupInput">
                                    <Checkbox {...register('processPersonalData', { checkbox: true, required: true })}>
                                        <span className="cart_popupCheckbox">Я даю согласие на <a>обработку персональных данных</a></span>
                                    </Checkbox>
                                </div>
                                <div className="cart_popupInput">
                                    <Button
                                        color="orange"
                                        type="submit"
                                        fullSize
                                    >
                                        Оформить заказ
                                    </Button>
                                </div>
                                <div className="cart_popupInput">
                                    <Button color="gray" onClick={() => dispatch(hidePopup())} fullSize>Отмена</Button>
                                </div>
                            </div>
                        </form>
                        </>
                    }
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
                                onRemove={id => {
                                    setRemovingItems([id].concat(removingItems))
                                    axios.post('order', { action: 'delete', id }).then(({ data: { order } = {}}) => {
                                        setRemovingItems(removingItems.filter(itemId => itemId !== id))
                                        const items = orderItemsToCart(order.items || [])
                                        dispatch(setOrderItems(items))
                                        dispatch(setOrderCount(items.length))
                                        dispatch(removeById(id))
                                    })
                                }}
                                onClickDetails={id => {
                                    const item = cart.items.find(item => item.id === id)
                                    setAreaPreview({ id: item.areaId, polygon: item.polygon, price: item.price })
                                    dispatch(showPopup('area-preview'))
                                }}
                                removingItems={removingItems}
                                withCheckboxes
                                withRemove
                            />
                        </div>
                    </div>
                </div></> :
                <div className="cart_empty">
                    Ваша корзина пуста
                </div>
            }
        </div>
    )
}
