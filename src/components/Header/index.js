import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import cn from 'classnames'
import { useDispatch } from 'react-redux'
import { useSession } from 'next-auth/react'
import Popup from '@components/Popup'
import { showPopup, hidePopup, showMessage } from '@store/popup'
import styles from './Header.module.scss'
import { SigninForm, SignupForm, ResetPasswordForm, ChangePasswordForm } from './forms'
import IconCart from './cart.svg'
import IconUser from './user.svg'

function MainNav(props) {
    const router = useRouter()
    const { items = [] } = props
    return (
        <ul className={styles.nav}>
            {items.map(item => (
                <li
                    key={item.link}
                    className={cn({
                        [styles.navLink]: true,
                        [styles.navLinkActive]: router.pathname === item.link
                    })}
                >
                    <Link href={item.link}>{item.title}</Link>
                </li>
            ))}
        </ul>
    )
}

export default function Header({ router, navItems = [], tel }) {
    const dispatch = useDispatch()
    const popupShow = name => dispatch(showPopup(name))
    const popupHide = () => dispatch(hidePopup())
    const message = payload => dispatch(showMessage(payload))
    const session = useSession()
    const isLogged = session.status === 'authenticated'

    const { query: { confirm, reset } = {} } = router.state || {}
    
    useEffect(function() {
        if (confirm) {
            message({
                icon: confirm === 'ok' ? 'success' : 'error',
                text: confirm === 'ok' ? 'Регистрация успешно завершена' : 'Ошибка подтверждения регистрации'
            })
        }
        if (reset === 'pass') {
            popupShow('change-password')
        }
    }, [confirm, reset])

    return (
        <header className={cn('container', styles.header)}>
            <Link href="/" className={styles.logo}></Link>
            <MainNav items={navItems} />
            <div className={styles.contacts}>
                <Link href={`tel:${tel}`}>
                    <div className={styles.contactsNumber}>
                        {tel}
                    </div>
                </Link>
                бесплатно по России
            </div>
            <div className={styles.icons}>
                {isLogged && <Link className={styles.iconLink} href="/cart">
                    <span className={styles.icon}>
                        <IconCart />
                        <span className={styles.iconCounter}>10</span>
                    </span>
                </Link>}
                {isLogged ?
                    <Link className={styles.iconLink} href="/cabinet">
                        <span className={styles.icon}>
                            <IconUser />
                        </span>
                    </Link>
                    :
                    <a className={styles.iconLink} role="button" onClick={() => popupShow('signin')}>
                        <span className={styles.icon}>
                            <IconUser />
                        </span>
                        <span className={styles.iconText}>Войти</span>
                    </a>
                }
            </div>
            <Popup name="signin">
                <SigninForm showPopup={popupShow} hidePopup={popupHide} showMessage={message} />
            </Popup>

            <Popup name="reset-password">
                <ResetPasswordForm showPopup={popupShow} hidePopup={popupHide} showMessage={message} />
            </Popup>

            <Popup name="signup">
                <SignupForm showPopup={popupShow} hidePopup={popupHide} showMessage={message} />
            </Popup>

            <Popup name="change-password">
                <ChangePasswordForm showPopup={popupShow} hidePopup={popupHide} showMessage={message} />
            </Popup>
        </header>
    )
}