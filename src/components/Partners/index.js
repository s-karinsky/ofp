import { useState } from 'react'
import { useDispatch } from 'react-redux'
import cn from 'classnames'
import { Message } from '@components/Header/forms'
import Popup from '@components/Popup'
import Spinner from '@components/Spinner'
import GreenForm from '@components/GreenForm'
import { Checkbox, Input } from '@components/Form'
import Button from '@components/Button'
import { showPopup, hidePopup } from '@store/popup'
import { isValidEmail } from '@lib/utils'
import { useForm } from '@lib/hooks'
import styles from './Partners.module.scss'

export default function Partners() {
    const { handleSubmit, register, formState } = useForm({ action: 'contact', defaultValues: { type: 'partner' } })
    const [ partnerSendStatus, setPartnerSendStatus ] = useState()
    const dispatch = useDispatch()
    return (
        <>
            <Popup name="partner-send">
                <Message type={partnerSendStatus} buttonText="Закрыть" onClick={() => dispatch(hidePopup())}>
                    <span>
                        {partnerSendStatus === 'success' ?
                            'Ваше сообщение отправлено. В ближайшее время вам ответят' :
                            'Произошла ошибка, попробуйте позже'
                        }
                    </span>
                </Message>
            </Popup>
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
                    ({ data = {}} = {}) => {
                        setPartnerSendStatus(data.success ? 'success' : 'error')
                        dispatch(showPopup('partner-send'))
                    },
                    (err) => {
                        if (err.name === 'AxiosError') {
                            setPartnerSendStatus('error')
                            dispatch(showPopup('partner-send'))
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