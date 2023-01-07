import Link from 'next/link'
import cn from 'classnames'
import IconOrders from './orders.svg'
import IconProfile from './profile.svg'
import IconPassword from './password.svg'
import IconLogout from './logout.svg'
import styles from './CabinetNav.module.scss'

export default function CabinetNav({ title, section }) {
    return (
        <div className={styles.cabinetNav}>
            <div className={styles.title}>{title}</div>
            <ul className={styles.nav}>
                <li className={cn(styles.item, { [styles.item_active]: !section })}>
                    <Link href="/cabinet">
                        <span className={styles.icon}><IconOrders /></span>
                        Мои заказы
                    </Link>
                </li>
                <li className={cn(styles.item, { [styles.item_active]: section === 'profile' })}>
                    <Link href="/cabinet/profile">
                        <span className={styles.icon}><IconProfile /></span>
                        Личные данные
                    </Link>
                </li>
                <li className={cn(styles.item, { [styles.item_active]: section === 'password' })}>
                    <Link href="/cabinet/password">
                        <span className={styles.icon}><IconPassword /></span>
                        Изменить пароль
                    </Link>
                </li>
                <li className={cn(styles.item)}>
                    <Link href="/logout">
                        <span className={styles.icon}><IconLogout /></span>
                        Выйти
                    </Link>
                </li>
            </ul>
        </div>
    )
}