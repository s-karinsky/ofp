import Link from 'next/link'
import cn from 'classnames'
import { useDispatch } from 'react-redux'
import { signOut, useSession } from 'next-auth/react'
import Popup from '@components/Popup'
import Button from '@components/Button'
import { showPopup, hidePopup } from '@store/popup'
import IconOrders from './orders.svg'
import IconProfile from './profile.svg'
import IconPassword from './password.svg'
import IconLogout from './logout.svg'
import styles from './CabinetNav.module.scss'

export default function CabinetNav({ title, section }) {
    const dispatch = useDispatch()
    const session = useSession()
    return (
        <div className={styles.cabinetNav}>
            <Popup name="confirm-logout">
                <div className={styles.logoutConfirm}>
                    <span>Вы уверены, что<br />хотите выйти?</span>
                    <Button
                        color="orange"
                        onClick={() => signOut({ callbackUrl: '/' })}
                        fullSize
                    >
                        Выйти
                    </Button>
                    <Button
                        color="gray"
                        onClick={() => dispatch(hidePopup())}
                        fullSize
                    >
                        Отмена
                    </Button>
                </div>
            </Popup>
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
                {session.data?.user?.role === 'seller' &&
                    <li className={cn(styles.item, { [styles.item_active]: section === 'myorders' })}>
                        <Link href="/cabinet/myorders">
                            <span className={styles.icon}><IconOrders /></span>
                            Заказы моих планов
                        </Link>
                    </li>
                }
                <li className={cn(styles.item)}>
                    <a onClick={() => dispatch(showPopup('confirm-logout'))}>
                        <span className={styles.icon}><IconLogout /></span>
                        Выйти
                    </a>
                </li>
            </ul>
        </div>
    )
}