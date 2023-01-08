import cn from 'classnames'
import Button from '@components/Button'
import { Input } from '@components/Form'
import styles from './Subscribe.module.scss'
import IconSubmit from './submit.svg'

export default function Subscribe() {
    return (
        <div className={styles.subscribe}>
            <div className={cn("container", styles.inner)}>
                <div className={styles.text}>Получайте актуальную информацию</div>
                <div className={styles.input}><Input type="email" placeholder="Введите ваш e-mail" /></div>
                <div className={styles.button}><Button className={styles.submit}><IconSubmit /></Button></div>
            </div>
        </div>
    )
}