import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Button from '@components/Button'
import Checkbox from '@components/Checkbox'
import Popup from '@components/Popup'
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
        onCheck,
        onRemove
    } = props
    const isCheckedAll = items.reduce((res, item) => res && checkedItems[item.id], true)
    const [previewImage, setPreviewImage] = useState()
    const [itemToRemove, setItemToRemove] = useState()
    const dispatch = useDispatch()

    return (
        <div className={styles.order}>
            <Popup name="order-preview" noBorder>
                <img src={previewImage} width="900" />
            </Popup>
            {withRemove && <Popup name="confirm-remove">
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
                                        onClick={() => {
                                            setPreviewImage(item.preview)
                                            dispatch(showPopup('order-preview'))
                                        }}
                                    >
                                        <IconPreview />
                                    </span>
                                </div>
                                <div>{item.price ? `${item.price} руб.` : 'сумма уточняется'}</div>
                            </div>
                        </div>
                        {withRemove && <div
                            className={styles.trashIcon}
                            onClick={() => {
                                setItemToRemove(item.id)
                                dispatch(showPopup('confirm-remove'))
                            }}
                        >
                            <IconTrash />
                        </div>}
                    </div>
                ))}
            </div>
        </div>
    )
}