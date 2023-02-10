import Link from 'next/link'
import { useRouter } from 'next/router'
import cn from 'classnames'
import Subscribe from '@components/Subscribe'
import IconLetter from './letter.svg'
import IconPhone from './phone.svg'
import styles from './Footer.module.scss'

export default function Footer({ navItems = [], email, tel = [] }) {
    const router = useRouter()
    return (
        <>
            <Subscribe />
            <div className={cn("container", styles.footer)}>
                <div className={cn(styles.column, styles.columnLogo)}>
                    <Link href="/" className={styles.logo} />
                    <div className={styles.logoText}>
                        Информация для покупателей Ортофотоплан. РФ - фотосъемка с БПЛА. Все права защищены. 2022
                    </div>
                </div>
                <div className={styles.column}>
                    <div className={styles.columnHeader}>
                        Разделы
                    </div>
                    <ul className={styles.nav}>
                        {navItems.filter(item => item.link !== '/').map(item => (
                            <li
                                key={item.link}
                                className={cn(styles.navItem, {
                                    [styles.navItemActive]: router.pathname === item.link
                                })}
                            >
                                <Link href={item.link}>
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.column}>
                    <div className={styles.columnHeader}>
                        Контакты
                    </div>
                    <div className={styles.contacts}>
                        <div className={styles.contact}>
                            <Link href="mailto:uhninv@mail.ru">
                                <span className={styles.contactIcon}>
                                    <IconLetter />
                                </span>
                                {email}
                            </Link>
                        </div>
                        {tel.map(num => (
                            <div className={styles.contact} key={num}>
                                <Link href={`tel:${num}`}>
                                    <span className={styles.contactIcon}>
                                        <IconPhone />
                                    </span>
                                    {num}
                                </Link>
                            </div>
                        ))}
                        <div className={styles.contact}>бесплатно по России</div>
                    </div>
                </div>
            </div>
        </>
    )
}