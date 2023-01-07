import { useState } from 'react'
import styles from './Contacts.module.scss'
import IconPhone from './phone.svg'
import IconEmail from './email.svg'
import IconCurrency from './currency.svg'
import IconArrow from './arrow.svg'

export default function Contacts() {
    const [ showReq, setReq ] = useState(false)
    return (
        <div className={styles.contacts}>
            <div className="container">
                <div className="title title_noline">Контакты</div>
                <div className={styles.blocks}>
                    <div className={styles.block}>
                        <div className={styles.icon}><IconPhone /></div>
                        <div className={styles.blockTitle}>Номер телефона</div>
                        <div className={styles.blockText}>
                            <p>8 (800) 511 36 39 (бесплатно по России)</p>
                            <p>пн-пт 9:00-21:00</p>
                        </div>
                    </div>
                    <div className={styles.block}>
                        <div className={styles.icon}><IconEmail /></div>
                        <div className={styles.blockTitle}>E-mail для связи</div>
                        <div className={styles.blockText} style={{ marginBottom: '10px' }}>
                            <a href="mailto:zakaz@waveharmony.com">zakaz@waveharmony.com</a>
                        </div>
                        <div className={styles.blockTitle}>Хотите стать партнёром?</div>
                        <div className={styles.blockText}>
                            <a href="mailto:partner@waveharmony.com">partner@waveharmony.com</a>
                        </div>
                    </div>
                    <div className={styles.block}>
                        <div className={styles.icon}><IconCurrency /></div>
                        <div className={styles.blockTitle}>Реквизиты</div>
                        <div className={styles.blockText}>ИП Муравьев Павел Алексеевич<br />249034, Калужская область</div>
                        {showReq && <div className={styles.blockText}>
                            <p>
                                <b>Юридический адрес </b>
                                123456, г. Москва, ул. Подвойского, д. 14, стр. 7<br />
                                <b>Почтовый адрес </b>
                                123456, г. Москва, ул. Подвойского, д. 14, стр. 7<br />
                                <b>ИНН</b> 7712345678<br />
                                <b>КПП</b> 779101001<br />
                                <b>БИК</b> 044521234<br />
                                <b>Р/С</b> 40702810123450101230 в Московский банк ПАО Сбербанк г. Москва<br />
                                <b>К/С</b> 30101234500000000225
                            </p>
                        </div>}
                        <div className={styles.toggleVisible}>
                            {!showReq && <span onClick={() => setReq(true)}>Показать все реквизиты <IconArrow /></span>}
                            {showReq && <span onClick={() => setReq(false)} className={styles.hide}>Скрыть реквизиты <IconArrow /></span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}