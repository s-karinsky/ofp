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
                            <p>8 (962) 083 14 04</p>
                            <p>пн-пт 9:00-21:00</p>
                        </div>
                    </div>
                    <div className={styles.block}>
                        <div className={styles.icon}><IconEmail /></div>
                        <div className={styles.blockTitle}>E-mail для связи</div>
                        <div className={styles.blockText} style={{ marginBottom: '10px' }}>
                            <a href="mailto:terraartechnology@gmail.com">terraartechnology@gmail.com</a>
                        </div>
                        <div className={styles.blockTitle}>Хотите стать партнёром?</div>
                        <div className={styles.blockText}>
                            <a href="mailto:terraartechnology@gmail.com">terraartechnology@gmail.com</a>
                        </div>
                    </div>
                    <div className={styles.block}>
                        <div className={styles.icon}><IconCurrency /></div>
                        <div className={styles.blockTitle}>Реквизиты</div>
                        <div className={styles.blockText}>ООО "ТЕРРА"</div>
                        {showReq && <div className={styles.blockText}>
                            <p>
                                <b>Юридический адрес </b>662605, РОССИЯ, Красноярский край, г. Минусинск, Улица Дружбы, д. д.10 <br />
                                <b>Номер счета: </b> 40702810923540000375<br />
                                <b>ИНН</b> 2455033042<br />
                                <b>ОГРН</b> 1122455001283<br />
                                <b>ФИЛИАЛ</b> "НОВОСИБИРСКИЙ" АО "АЛЬФА-БАНК"<br /> 
                                <b>БИК</b> 045004774<br />            
                                <b>К/С</b> К/с: 30101810600000000774 в СИБИРСКОЕ ГУ БАНКА РОССИИ <br /> 
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