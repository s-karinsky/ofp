import { Provider } from 'react-redux'
import { SessionProvider } from 'next-auth/react'
import { store } from '@store'
import Header from '@components/Header'
import Footer from '@components/Footer'
import { PopupOverlay, PopupMessage } from '@components/Popup'
import CabinetNav from '@components/CabinetNav'
import headerJson from '@json/header.json'
import footerJson from '@json/footer.json'
import '@styles/styles.scss'

const cabinetTitles = {
    default: 'Мои заказы',
    profile: 'Личные данные',
    password: 'Изменить пароль'
}

export default function MyApp({
    Component,
    pageProps: { session, ...pageProps },
    router
}) {
    const { pathname = '', state = {} } = router
    const rootSection = pathname.split('/')[1]
    const subSection = pathname.split('/')[2]
    return (
        <SessionProvider session={session}>
            <Provider store={store}>
                <PopupOverlay />
                <PopupMessage />
                <Header
                    navItems={headerJson.nav}
                    tel={headerJson.tel}
                    router={router}
                />
                {rootSection === 'cabinet'
                    ? <div className="cabinet">
                        <div className="container">
                            <div className="cabinet_layout">
                                <CabinetNav
                                    title={cabinetTitles[subSection] || cabinetTitles.default}
                                    section={subSection}
                                />
                                <Component {...pageProps} />
                            </div>
                        </div>
                    </div>
                    : <Component {...pageProps} />
                }
                <Footer
                    navItems={footerJson.nav}
                    email={footerJson.email}
                    tel={footerJson.tel}
                />
            </Provider>
        </SessionProvider>
    )
}
