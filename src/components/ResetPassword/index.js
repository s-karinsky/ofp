import Spinner from '@components/Spinner'
import Button from '@components/Button'
import { Input } from '@components/Form'
import { useForm } from '@lib/hooks'
import styles from './ResetPassword.module.scss'

export default function ResetPassword() {
    const { formState, register, handleSubmit, setError } = useForm({ action: 'user' })
    return (
        <form onSubmit={handleSubmit(
            () => {},
            ({ response: { data: { error = '' } = {} } = {} } = {}) => {
                if (error.indexOf('Wrong password') !== -1) {
                    setError('password_old', 'Введен неправильный пароль')
                }
                if (error.indexOf('Different passwords') !== -1) {
                    setError({
                        password: true,
                        password_repeat: 'Пароли должны совпадать'
                    })
                }
            }
        )} noValidate>
            <div>
                <div className={styles.field}>
                    <Input
                        placeholder="Старый пароль"
                        type="password"
                        {...register('password_old', { required: true })}
                    />
                </div>
                <div className={styles.field}>
                    <Input
                        placeholder="Новый пароль"
                        type="password"
                        {...register('password', { required: true })}
                    />
                </div>
                <div className={styles.field}>
                    <Input
                        placeholder="Повторите новый пароль"
                        type="password"
                        {...register('password_repeat', { required: true })}
                    />
                </div>
                <div className={styles.field}>
                    <Button fullSize>
                        {formState.submitting ? <Spinner /> : 'Сохранить'}
                    </Button>
                </div>
            </div>
        </form>
    )
}