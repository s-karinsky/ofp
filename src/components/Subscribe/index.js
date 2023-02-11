import cn from 'classnames'
import { useDispatch } from 'react-redux'
import Spinner from '@components/Spinner'
import Button from '@components/Button'
import { Input } from '@components/Form'
import { showMessage } from '@store/popup'
import { useForm } from '@lib/hooks'
import { isValidEmail } from '@lib/utils'
import styles from './Subscribe.module.scss'
import IconSubmit from './submit.svg'

export default function Subscribe() {
    const dispatch = useDispatch()
    const { handleSubmit, register, formState } = useForm({ action: 'subscribe' })
    return (
        <form className={styles.subscribe} onSubmit={handleSubmit(
            ({ data: { success } = {}} = {}) => {
                dispatch(showMessage({
                    icon: success ? 'success' : 'error',
                    text: success ?
                        'Вы подписаны на рассылку ортофотоплан' :
                        'Вы уже подписаны на рассылку'
                }))
            },
            (err) => {
                if (err.name === 'AxiosError') {
                    dispatch(showMessage({
                        icon: 'error',
                        text: 'Вы уже подписаны на рассылку'
                    }))
                }
            }
        )}>
            <div className={cn("container", styles.inner)}>
                <div className={styles.text}>Получайте актуальную информацию</div>
                <div className={styles.input}>
                    <Input
                        type="email"
                        placeholder="Введите ваш e-mail"
                        {...register('email', {
                            required: true,
                            getValidationError: val => !isValidEmail(val) && 'Введите корректный e-mail'
                        })}
                    />
                </div>
                <div className={styles.button}>
                    <Button
                        className={styles.submit}
                        disabled={formState.submitting}
                        width={formState.submitting ? '100px' : null}
                    >
                        {formState.submitting ? <Spinner /> : <IconSubmit />}
                    </Button>
                </div>
            </div>
        </form>
    )
}