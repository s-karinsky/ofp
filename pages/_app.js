import { Provider } from 'react-redux'
import { store } from '@store'
import '@styles/styles.scss'

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <div className="container">
        <Component {...pageProps} />
      </div>
    </Provider>
  )
}
