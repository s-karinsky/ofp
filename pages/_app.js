import { Provider } from 'react-redux'
import { store } from '@store'
import Header from '@components/Header'
import { PopupOverlay } from '@components/Popup'
import '@styles/styles.scss'

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PopupOverlay />
      <Header />
      <div className="container">
        <Component {...pageProps} />
      </div>
    </Provider>
  )
}
