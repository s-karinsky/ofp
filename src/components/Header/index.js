import Link from 'next/link'
import { useRouter } from 'next/router'
import cn from 'classnames'
import { useDispatch } from 'react-redux'
import Popup from '@components/Popup'
import Input from '@components/Input'
import Checkbox from '@components/Checkbox'
import Button from '@components/Button'
import { showPopup } from '@store/popup'
import styles from './Header.module.scss'
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

export default function Header() {
    const dispatch = useDispatch()

    return (
        <header className={styles.header}>
            <Link href="/" className={styles.logo}></Link>
            <MainNav items={[
                { link: '/', title: 'Главная' },
                { link: '/map', title: 'Карта' },
                { link: '/partners', title: 'Партнерам' },
                { link: '/documents', title: 'Документы' },
                { link: '/contacts', title: 'Контакты' },
            ]} />
            <div className={styles.contacts}>
                <div className={styles.contactsNumber}>+7 962 800 9090</div>
                бесплатно по России
            </div>
            <div className={styles.icons}>
                {/* <a className={styles.iconLink} role="button">
                    <span className={styles.icon}>
                        <IconCart />
                        <span className={styles.iconCounter}>10</span>
                    </span>
                </a> */}
                <a className={styles.iconLink} role="button" onClick={() => dispatch(showPopup('signin'))}>
                    <span className={styles.icon}>
                        <IconUser />
                    </span>
                    <span className={styles.iconText}>Войти</span>
                </a>
            </div>
            <Popup name="signin">
                <div className="popup_header">
                    Войти<br />или <span
                        className={styles.popupHeaderLink}
                        onClick={() => dispatch(showPopup('signup'))}
                    >
                        создать аккаунт
                    </span>
                </div>
                <div className={styles.popupField}>
                    <Input placeholder="Email" type="email" name="email" required />
                </div>
                <div className={styles.popupField}>
                    <Input placeholder="Пароль" type="password" name="password" required />
                </div>
                <div className={styles.popupRemember}>
                    <Checkbox size="small">Запомнить меня</Checkbox>
                    <span
                        className={styles.resetPass}
                        onClick={() => dispatch(showPopup('reset-password'))}
                    >
                        Забыли пароль?
                    </span>
                </div>
                <Button className={styles.submit} fullSize>Войти</Button>
            </Popup>

            <Popup name="reset-password">
                <div className="popup_header">Восстановить пароль</div>
                <div className={styles.popupField}>
                    <Input placeholder="Email" type="email" name="email" required />
                </div>
                <Button className={styles.submit} fullSize>Сбросить мой пароль</Button>
                <div className={styles.resetText}>
                    Вспомнили пароль? <span
                        className={styles.resetPass}
                        onClick={() => dispatch(showPopup('signin'))}
                    >
                        Войдите
                    </span>
                </div>
            </Popup>

            <Popup name="signup">
                <div className="popup_header">
                    Создать аккаунт<br />или <span
                        className={styles.popupHeaderLink}
                        onClick={() => dispatch(showPopup('signin'))}
                    >
                        войти в существующий
                    </span>
                </div>
                <div className={styles.popupField}>
                    <Input placeholder="Имя" name="name" required />
                </div>
                <div className={styles.popupField}>
                    <Input placeholder="Фамилия" name="surname" required />
                </div>
                <div className={styles.popupField}>
                    <Input placeholder="E-mail" type="email" name="email" required />
                </div>
                <div className={styles.popupField}>
                    <Input placeholder="Телефон" type="phone" name="phone" required />
                </div>
                <div className={styles.popupField}>
                    <Input placeholder="Пароль" type="password" name="password" required />
                </div>
                <div className={styles.popupField}>
                    <Checkbox>
                        <span className={styles.agreeText}>Я даю согласие на обработку персональных данных</span>
                    </Checkbox>
                </div>
                <div className={styles.popupField}>
                    <Checkbox>
                        <span className={styles.agreeText}>
                            Я подтверждаю, что ознакомлен(а) и принимаю условия следующих документов <a href="#" target="_blank">Согласие на трансграничную передачу</a>
                            , <a href="#" target="_blank">Договора-оферты</a>, <a href="#" target="_blank">Положения о конфиденциальности</a>
                            , <a href="#" target="_blank">Пользовательского соглашения</a>
                        </span>
                    </Checkbox>
                </div>
                <Button className={styles.submit} fullSize>Создать аккаунт</Button>
            </Popup>
        </header>
    )
}