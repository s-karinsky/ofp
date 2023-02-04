import cn from 'classnames'
import GreenForm from '@components/GreenForm'
import UsageSlider from '@components/UsageSlider'
import { Checkbox, Input } from '@components/Form'
import Button from '@components/Button'
import styles from './Partners.module.scss'

export default function Partners() {
    return (
        <>
            <div className={styles.partners}>
                <div className="container">
                    <h1 className="title title_white title_noline">Станьте Нашим партнёром</h1>
                    <div className={styles.partnerText}>
                        Вы занимаетесь созданием ортофотопланов и у вас уже есть готовые ортофотопланы, <b>вы можете стать нашим партнером и продать ваши ОФП</b>
                    </div>
                </div>
            </div>
            <div className="container">
                <h1 className={cn("title", "title_noline", styles.formTitle)}>
                    Заполните форму<br />мы с вами свяжемся
                </h1>
                <GreenForm>
                    <Input placeholder="Имя" />
                    <Input placeholder="E-mail" type="email" />
                    <Input placeholder="Телефон" />
                    <div>Мы Вам перезвоним и расскажем подробнее про условия партнёрства</div>
                    <Checkbox>Я даю согласие на обработку  персональных данных</Checkbox>
                    <div className={styles.submit}><Button color="white" width="335px">Отправить</Button></div>
                </GreenForm>
            </div>
        </>
    )
}