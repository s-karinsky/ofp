import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import cn from 'classnames'
import { useDispatch } from 'react-redux'
import { useSession } from 'next-auth/react'
import Popup from '@components/Popup'
import { showPopup, hidePopup } from '@store/popup'
import styles from './Header.module.scss'
import { SigninForm, SignupForm, ResetPasswordForm, Message } from './forms'
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

export default function Header({ router, navItems = [] }) {
    const dispatch = useDispatch()
    const popupShow = name => dispatch(showPopup(name))
    const popupHide = () => dispatch(hidePopup())
    const session = useSession()
    const isLogged = session.status === 'authenticated'

    const { query: { confirm } = {} } = router.state || {}
    
    useEffect(function() {
        if (confirm === 'ok') {
            popupShow('confirm-success')
        }
        if (confirm === 'fail') {
            popupShow('confirm-fail')
        }
    }, [confirm])

    return (
        <header className={cn('container', styles.header)}>
            <Link href="/" className={styles.logo}></Link>
            <MainNav items={navItems} />
            <div className={styles.contacts}>
                <div className={styles.contactsNumber}>+7 962 800 9090</div>
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
                <SigninForm showPopup={popupShow} hidePopup={popupHide} />
            </Popup>

            <Popup name="reset-password">
                <ResetPasswordForm showPopup={popupShow} hidePopup={popupHide} />
            </Popup>

            <Popup name="signup">
                <SignupForm showPopup={popupShow} hidePopup={popupHide} />
            </Popup>

            <Popup name="confirm-success">
                <Message type="success" buttonText="Закрыть" onClick={popupHide}>
                    <span>
                        Регистрация успешно завершена. <a className="textLink" onClick={() => popupShow('signin')}>Войдите</a>, используя e-mail и пароль
                    </span>
                </Message>
            </Popup>

            <Popup name="confirm-fail">
                <Message type="error" buttonText="Закрыть" onClick={popupHide}>
                    Ошибка подтверждения регистрации
                </Message>
            </Popup>
        </header>
    )
}