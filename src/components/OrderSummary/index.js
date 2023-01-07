import styles from './OrderSummary.module.scss'

export default function OrderSummary(props) {
    const { index, date, count, status, onExpand } = props
    const isExpanded = typeof onExpand === 'function'

    return (
        <div className={styles.orderSummary}>
            <div>
                Заказ № {index}
            </div>
            <div>
                <span className={styles.label}>Дата </span>
                {date}
            </div>
            <div>
                <span className={styles.label}>Кол-во товаров </span>
                {count}
            </div>
            <div>
                <span className={styles.label}>Статус </span>
                {status}
            </div>
            {isExpanded && <div>
                <span className={styles.expand} onClick={onExpand}>+</span>
            </div>}
        </div>
    )
}