import Button from '@components/Button'
import styles from './OrderSubmit.module.scss'

export default function OrderSubmit(props) {
    const { items, onSubmit = () => {}, isSubmitting } = props
    const totalCount = items.reduce((res, item) => res + (item.price || 0), 0)
    const isDisabled = items.reduce((res, item) => res || !item.price, false)
    const isEmpty = !items.length
    return (
        <div className={styles.orderSubmit}>
            {!isEmpty && <div className={styles.title}>Сумма заказа</div>}
            {!isEmpty && <ol className={styles.list}>
                {items.map(item => (
                    <li className={styles.item} key={item.id}>
                        <span>{item.name}</span> <span>{item.price} руб.</span>
                    </li>
                ))}
            </ol>}
            <div className={styles.title} style={{ border: 'none' }}>
                {isEmpty ? 'Товары для заказа не выбраны' : `К оплате ${totalCount} руб.`}
            </div>
            {!isEmpty &&  <Button
                color="orange"
                disabled={isSubmitting || isDisabled}
                onClick={onSubmit}
                fullSize
            >
                Перейти к оплате
            </Button>}
        </div>
    )
}