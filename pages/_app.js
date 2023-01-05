import { Provider } from 'react-redux'
import { store } from '@store'
import Header from '@components/Header'
import Footer from '@components/Footer'
import { PopupOverlay } from '@components/Popup'
import '@styles/styles.scss'

const navItems = [
    { link: '/', title: 'Главная' },
    { link: '/map', title: 'Карта' },
    { link: '/partners', title: 'Партнерам' },
    { link: '/documents', title: 'Документы' },
    { link: '/contacts', title: 'Контакты' },
]

export default function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <PopupOverlay />
            <Header navItems={navItems} />
            <div className="container">
                <Component {...pageProps} />
            </div>
            <Footer navItems={navItems} />
        </Provider>
    )
}
