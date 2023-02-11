import { useDispatch } from 'react-redux'
import cn from 'classnames'
import Spinner from '@components/Spinner'
import GreenForm from '@components/GreenForm'
import { Checkbox, Input } from '@components/Form'
import Button from '@components/Button'
import { showMessage } from '@store/popup'
import { isValidEmail } from '@lib/utils'
import { useForm } from '@lib/hooks'
import styles from './Partners.module.scss'

export default function Partners() {
    const { handleSubmit, register, formState } = useForm({ action: 'contact', defaultValues: { type: 'partner' } })
    const dispatch = useDispatch()
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
                <GreenForm onSubmit={handleSubmit(
                    ({ data: { success } = {}} = {}) => {
                        dispatch(showMessage({
                            icon: success ? 'success' : 'error',
                            text: success ? 'Ваше сообщение отправлено. В ближайшее время вам ответят' : 'Произошла ошибка, попробуйте позже'
                        }))
                    },
                    (err) => {
                        if (err.name === 'AxiosError') {
                            dispatch(showMessage({
                                icon: 'error',
                                text: 'Произошла ошибка, попробуйте позже'
                            }))
                        }
                    }
                )}>
                    <Input
                        placeholder="Имя"
                        {...register('name', { required: true })}
                    />
                    <Input
                        placeholder="E-mail"
                        type="email"
                        {...register('email', {
                            required: true,
                            getValidationError: val => !isValidEmail(val) && 'Введите корректный e-mail'
                        })}
                    />
                    <Input
                        placeholder="Телефон"
                        {...register('phone')}
                    />
                    <div>Мы Вам перезвоним и расскажем подробнее про условия партнёрства</div>
                    <Checkbox {...register('agree', { required: true, checkbox: true })}>
                        Я даю согласие на обработку персональных данных
                    </Checkbox>
                    <div className={styles.submit}>
                        <Button color="white" width="335px" disabled={formState.submitting}>
                            {formState.submitting ? <Spinner /> : 'Отправить'}
                        </Button>
                    </div>
                </GreenForm>
            </div>
        </>
    )
}