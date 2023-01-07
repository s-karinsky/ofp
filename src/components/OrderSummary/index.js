import styles from './OrderSummary.module.scss'

export default function OrderSummary(props) {
    const { index, date, count, status } = props

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
        </div>
    )
}