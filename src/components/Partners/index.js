import cn from 'classnames'
import GreenForm from '@components/GreenForm'
import PartnersSlider from '@components/PartnersSlider'
import { Checkbox, Input } from '@components/Form'
import Button from '@components/Button'
import styles from './Partners.module.scss'

export default function Partners() {
    return (
        <>
            <div className={cn("container", styles.partners)}>
                <h1 className="title title_noline">Где применяется</h1>
                <PartnersSlider />
            </div>
            <div className="container">
                <h1 className="title title_noline">
                    Станьте нашим партнером
                    <div className="subtitle">Заполните форму</div>
                </h1>
            </div>
            <GreenForm>
                <Input placeholder="Имя" />
                <Input placeholder="E-mail" type="email" />
                <Input placeholder="Телефон" />
                <div>Мы Вам перезвоним и расскажем подробнее про условия партнёрства</div>
                <Checkbox>Я даю согласие на обработку  персональных данных</Checkbox>
                <div className={styles.submit}><Button color="white" width="335px">Отправить</Button></div>
            </GreenForm>
        </>
    )
}