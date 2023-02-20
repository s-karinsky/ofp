import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Button from '@components/Button'
import { Checkbox } from '@components/Form'
import Popup from '@components/Popup'
import Spinner from '@components/Spinner'
import { showPopup, hidePopup } from '@store/popup'
import IconPlan from './plan.svg'
import IconShoot from './shoot.svg'
import IconTrash from './trash.svg'
import IconPreview from './preview.svg'
import styles from './Order.module.scss'

const mapIcons = {
    plan: <IconPlan />,
    shoot: <IconShoot />
}

export default function Order(props) {
    const {
        index,
        date,
        status,
        items = [],
        withCheckboxes,
        withRemove,
        checkedItems = {},
        removingItems = [],
        onCheck,
        onRemove,
        onClickDetails = () => {},
        onCollapse
    } = props
    const isCheckedAll = items.reduce((res, item) => res && checkedItems[item.id], true)
    const [itemToRemove, setItemToRemove] = useState()
    const dispatch = useDispatch()
    const isCollapsing = typeof onCollapse === 'function'

    return (
        <div className={styles.order}>
            {isCollapsing && <span className={styles.collapse} onClick={onCollapse}>-</span>}
            {withRemove && <Popup name={`confirm-remove-${index}`}>
                <div className={styles.removeHeader}>Уверены?</div>
                <div className={styles.removeText}>Это удалит товар из корзины</div>
                <div className={styles.removeButton}>
                    <Button
                        onClick={() => {
                            onRemove(itemToRemove)
                            dispatch(hidePopup())
                        }}
                        fullSize
                    >
                        Удалить
                    </Button>
                </div>
                <div className={styles.removeButton}>
                    <Button color="gray" onClick={() => dispatch(hidePopup())} fullSize>Отмена</Button>
                </div>
            </Popup>}
            <div className={styles.orderSummary}>
                <div className={styles.orderSummaryItem}>
                    Заказ № {index}
                </div>
                <div className={styles.orderSummaryItem}>
                    <span className={styles.label}>Дата </span>
                    {date}
                </div>
                <div className={styles.orderSummaryItem}>
                    <span className={styles.label}>Кол-во </span>
                    {items.length}
                </div>
                <div className={styles.orderSummaryItem}>
                    <span className={styles.label}>Статус </span>
                    {status}
                </div>
            </div>
            <div className={styles.orderDetails}>
                {withCheckboxes && <div className={styles.commonCheckbox}>
                    <Checkbox
                        onChange={() => onCheck(!isCheckedAll)}
                        checked={isCheckedAll}
                    >
                        выбрать всё
                    </Checkbox>
                </div>}
                {items.map(item => (
                    <div className={styles.orderItem} key={item.id}>
                        {withCheckboxes && <div className={styles.checkbox}>
                            <Checkbox
                                onChange={() => onCheck({ ...checkedItems, [item.id]: !checkedItems[item.id] })}
                                checked={checkedItems[item.id]}
                            />    
                        </div>}
                        <div className={styles.icon}>
                            {mapIcons[item.type]}
                        </div>
                        <div>
                            <div className={styles.itemName}>
                                <div>
                                    {item.name}
                                    <span
                                        className={styles.previewIcon}
                                        onClick={() => onClickDetails(item.id)}
                                    >
                                        <IconPreview />
                                    </span>
                                </div>
                                <div>{item.price ? `${item.price} руб.` : 'сумма уточняется'}</div>
                            </div>
                        </div>
                        {withRemove && <div className={styles.trashIcon}>
                            {removingItems.indexOf(item.id) === -1 ?
                                <IconTrash onClick={() => {
                                    setItemToRemove(item.id)
                                    dispatch(showPopup(`confirm-remove-${index}`))
                                }} /> :
                                <Spinner color="green" />
                            }
                        </div>}
                    </div>
                ))}
            </div>
        </div>
    )
}