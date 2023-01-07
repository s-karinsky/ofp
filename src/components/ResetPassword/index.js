import Button from '@components/Button'
import Input from '@components/Input'
import styles from './ResetPassword.module.scss'

export default function ResetPassword() {
    return (
        <div>
            <div className={styles.field}>
                <Input placeholder="Старый пароль" type="password" required />
            </div>
            <div className={styles.field}>
                <Input placeholder="Новый пароль" type="password" required />
            </div>
            <div className={styles.field}>
                <Input placeholder="Повторите новый пароль" type="password" required />
            </div>
            <div className={styles.field}>
                <Button fullSize>Сохранить</Button>
            </div>
        </div>
    )
}