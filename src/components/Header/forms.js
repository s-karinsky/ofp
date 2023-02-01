import { useState } from 'react'
import cn from 'classnames'
import { signIn } from 'next-auth/react'
import { useForm } from '@lib/hooks'
import { isValidEmail } from '@lib/utils'
import { Checkbox, Input } from '@components/Form'
import Button from '@components/Button'
import Spinner from '@components/Spinner'
import IconSuccess from './success.svg'
import IconError from './error.svg'
import styles from './Header.module.scss'

const signInAction = ({ email, password, remember }) =>
    signIn('credentials', {
        redirect: false,
        email,
        password,
        remember
    })

function Message({ children, onClick, type, buttonText = 'Назад' }) {
    return (
        <div className={styles.errorMessage}>
            <div className={styles.errorMessageContent}>
                {type === 'success' && <IconSuccess className={cn(styles.messageIcon, styles.success)} />}
                {type === 'error' && <IconError className={cn(styles.messageIcon, styles.error)} />}
                {children}
            </div>
            <Button
                className={styles.submit}
                type="button"
                onClick={onClick}
                fullSize
            >
                {buttonText}
            </Button>
        </div>
    )
}

export function SigninForm({ showPopup, hidePopup }) {
    const { handleSubmit, register, setError, formState } = useForm({ action: signInAction })
    const [ isUnconfirmed, setIsUnconfirmed ] = useState(false)

    return !isUnconfirmed ? 
        (<form onSubmit={handleSubmit(res => {
            if (!res.ok) {
                if (res.error === 'Your password is invalid') {
                    setError({
                        email: 'Неправильные e-mail или пароль',
                        password: true
                    })
                }
                if (res.error === 'Unconfirmed') {
                    setIsUnconfirmed(true)
                }
            } else {
                hidePopup()
            }
        })} noValidate>
            <div className="popup_header">
                Войти<br />или <span
                    className={styles.popupHeaderLink}
                    onClick={() => showPopup('signup')}
                >
                    создать аккаунт
                </span>
            </div>
            <div className={styles.popupField}>
                <Input
                    placeholder="Email"
                    type="email"
                    {...register('email', {
                        required: true,
                        getValidationError: val => !isValidEmail(val) && 'Введите корректный e-mail'
                    })}
                />
            </div>
            <div className={styles.popupField}>
                <Input
                    placeholder="Пароль"
                    type="password"
                    {...register('password', {
                        required: true
                    })}
                />
            </div>
            <div className={styles.popupRemember}>
                <Checkbox
                    size="small"
                    defaultValue={true}
                    {...register('remember', {
                        checkbox: true
                    })}
                >
                    Запомнить меня
                </Checkbox>
                <span
                    className={styles.resetPass}
                    onClick={() => showPopup('reset-password')}
                >
                    Забыли пароль?
                </span>
            </div>
            <Button
                type="submit"
                className={styles.submit}
                disabled={formState.submitting}
                fullSize
            >
                {formState.submitting ? <Spinner /> : 'Войти'}
            </Button>
        </form>) :
        (<Message type='error' onClick={() => setIsUnconfirmed(false)}>
            Подтвердите регистрацию для входа в этот аккаунт
        </Message>)
}

export function ResetPasswordForm({ showPopup }) {
    const { handleSubmit, register } = useForm()
    return (
        <form onSubmit={handleSubmit(() => console.log('ok'), () => console.log('fail'))} noValidate>
            <div className="popup_header">Восстановить пароль</div>
            <div className={styles.popupField}>
                <Input
                    placeholder="E-mail"
                    type="email"
                    {...register('email', {
                        required: true,
                        getValidationError: val => !isValidEmail(val) && 'Введите корректный e-mail'
                    })}
                />
            </div>
            <Button className={styles.submit} fullSize>Сбросить мой пароль</Button>
            <div className={styles.resetText}>
                Вспомнили пароль? <span
                    className={styles.resetPass}
                    onClick={() => showPopup('signin')}
                >
                    Войдите
                </span>
            </div>
        </form>
    )
}

export function SignupForm({ showPopup, hidePopup }) {
    const { handleSubmit, register, setError, formState } = useForm({ action: 'signup' })
    const [ errorMessage, setErrorMessage ] = useState()
    const [ isSuccess, setIsSuccess ] = useState(false)
    return (
        <form onSubmit={
            handleSubmit(
                res => {
                    setIsSuccess(true)
                },
                err => {
                    if (err.response) {
                        const { data } = err.response
                        if (data.error === 'duplicate')
                            setErrorMessage('Этот e-mail уже зарегистрирован, попробуйте другой')
                    }
                }
            )
        } noValidate>
            {!errorMessage && !isSuccess && <>
                <div className="popup_header">
                    Создать аккаунт<br />или <span
                        className={styles.popupHeaderLink}
                        onClick={() => showPopup('signin')}
                    >
                        войти в существующий
                    </span>
                </div>
                <div className={styles.popupField}>
                    <Input
                        placeholder="Имя"
                        {...register('name', {
                            required: true
                        })}
                    />
                </div>
                <div className={styles.popupField}>
                    <Input
                        placeholder="Фамилия"
                        {...register('surname', {
                            required: true
                        })}
                    />
                </div>
                <div className={styles.popupField}>
                    <Input
                        placeholder="E-mail"
                        type="email"
                        {...register('email', {
                            required: true,
                            getValidationError: val => !isValidEmail(val) && 'Введите корректный e-mail'
                        })}
                    />
                </div>
                <div className={styles.popupField}>
                    <Input
                        placeholder="Телефон"
                        type="phone"
                        {...register('phone', {
                            required: true
                        })}
                    />
                </div>
                <div className={styles.popupField}>
                    <Input
                        placeholder="Пароль"
                        type="password"
                        {...register('password', {
                            required: true
                        })}
                    />
                </div>
                <div className={styles.popupField}>
                    <Checkbox {...register('processPersonalData', { checkbox: true, required: true })}>
                        <span className={styles.agreeText}>Я даю согласие на обработку персональных данных</span>
                    </Checkbox>
                </div>
                <div className={styles.popupField}>
                    <Checkbox {...register('agreement', { checkbox: true, required: true })}>
                        <span className={styles.agreeText}>
                            Я подтверждаю, что ознакомлен(а) и принимаю условия следующих документов <a href="#" target="_blank">Согласие на трансграничную передачу</a>
                            , <a href="#" target="_blank">Договора-оферты</a>, <a href="#" target="_blank">Положения о конфиденциальности</a>
                            , <a href="#" target="_blank">Пользовательского соглашения</a>
                        </span>
                    </Checkbox>
                </div>
                <Button
                    className={styles.submit}
                    disabled={formState.submitting}
                    fullSize
                >
                    {formState.submitting ? <Spinner /> : 'Создать аккаунт'}
                </Button>
            </>}
            {!!errorMessage && <Message type='error' onClick={() => setErrorMessage()}>
                {errorMessage}
            </Message>}
            {isSuccess && <Message onClick={() => hidePopup()} type='success' buttonText='Закрыть окно'>
                На ваш e-mail отправлена ссылка для подтверждения. Пройдите по ней, чтобы завершить регистрацию
            </Message>}
        </form>
    )
}