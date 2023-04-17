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

const iconsList = {
    orders: IconOrders,
    profile: IconProfile,
    password: IconPassword,
    myorders: IconOrders,
    logout: IconLogout
}

export default function CabinetNav({ title, section, items = [] }) {
    const dispatch = useDispatch()
    const session = useSession()
    const navItems = items.filter(item => !item.role || item.role === session.data?.user?.role)
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
                {navItems.map(({ title, icon, link = '' }, i) => {
                    const Icon = iconsList[icon]
                    const currentSection = link.split('/').slice(-1)[0]
                    return (
                        <li
                            key={i}
                            className={cn(styles.item, { [styles.item_active]: section === currentSection })}
                        >
                            <Link href={link}>
                                <span className={styles.icon}>{!!Icon && <Icon />}</span>
                                {title}
                            </Link>
                        </li>
                    )
                })}
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