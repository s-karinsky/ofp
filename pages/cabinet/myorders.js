import dynamic from 'next/dynamic'
import { useEffect, useState, useCallback } from 'react'
import cn from 'classnames'
import Spinner from '@components/Spinner'
import { getFormattedDate } from '@lib/datetime'
import { reversePolygonCoords } from '@lib/geo'
import axios from '@lib/axios'

export default function PageMyOrders() {
    const MapPreview = dynamic(() => import('@components/MapPreview'), { ssr: false })
    const [ items, setItems ] = useState([])
    const [ section, setSection ] = useState()
    const [ pendingItems, setPendingItems ] = useState([])

    const goToSection = useCallback((newSection) => {
        if (newSection === section) return
        setSection(newSection)
    }, [section])

    const markDone = useCallback((orderId, itemId) => {
        setPendingItems([itemId].concat(pendingItems))
        axios.post('myorders', { orderId, itemId, done: true }).then(({ data = {} }) => {
            if (data.success) {
                const newItems = items.map(item => {
                    if (item._id === itemId) {
                        item.done = true
                    }
                    return item
                })
                setItems(newItems)
            }
            setPendingItems(pendingItems.filter(item => item !== itemId))
        })
    })

    useEffect(() => {
        axios.get('myorders').then(({ data }) => {
            const { areas = [], orders = [] } = data
            const areaById = areas.reduce((res, area) => ({ ...res, [area._id]: area }), {})
            let items = []
            orders.forEach(order => {
                order.items = order.items.filter(item => item.polygon?.coordinates?.length > 0)
                order.items.forEach(item => {
                    if (item.areaId && areaById[item.areaId]) {
                        item.area = areaById[item.areaId]
                    }
                    item.orderId = order._id
                    item.date = order.createdAt
                })
                items = items.concat(order.items)
            })
            setItems(items)
        })
    }, [])

    const itemsNew = items.filter(item => !item.done)
    const itemsDone = items.filter(item => item.done)
    const showItems = section === 'done' ? itemsDone : itemsNew
    return items.length === 0 ? null :
        (
            <div className="myorders">
                <div className="myorders_header">
                    <span
                        className={cn('myorders_section', { myorders_section__selected: !section })}
                        onClick={() => goToSection()}
                    >
                        Новые ({itemsNew.length})
                    </span>
                    <span
                        className={cn('myorders_section', { myorders_section__selected: section === 'done' })}
                        onClick={() => goToSection('done')}
                    >
                        Выполненные ({itemsDone.length})
                    </span>
                </div>
                {showItems.map(item => (
                    <div className="myorders_orderItem" key={item._id}>
                        <div className="myorders_date">
                            <b>Дата заказа</b> {getFormattedDate(item.date)}
                            {!item.done && !pendingItems.includes(item._id) && <span
                                className="myorders_makeDone"
                                onClick={() => markDone(item.orderId, item._id)}
                            >
                                отметить выполненным
                            </span>}
                            {!item.done && pendingItems.includes(item._id) && <Spinner color="green" />}
                        </div>
                        <div className="myorders_details">
                            <div className="myorders_preview">
                                <b>Миниатюра ортофотоплана</b><br />
                                <img className="myorders_orderPreview" src={`/uploads/${item.area?.preview}`} />
                            </div>
                            <div className="myorders_map">
                            <b>На карте</b><br />
                                <MapPreview
                                    style={{ width: '300px', height: '200px' }}
                                    area={reversePolygonCoords(item.area?.polygon?.coordinates)}
                                    intersection={reversePolygonCoords(item.polygon?.coordinates)}
                                />
                            </div>
                            <div className="myorders_coords">
                                <b>Заказанные координаты</b><br />
                                <textarea
                                    className="myorders_coordsValue"
                                    defaultValue={JSON.stringify(reversePolygonCoords(item.polygon?.coordinates))}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
}