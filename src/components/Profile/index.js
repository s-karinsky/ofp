import { useSelector, useDispatch } from 'react-redux'
import { isValidEmail } from '@lib/utils'
import Spinner from '@components/Spinner'
import Button from '@components/Button'
import { Input, Select } from '@components/Form'
import { useForm } from '@lib/hooks'
import { setUserData } from '@store/profile'
import styles from './Profile.module.scss'

export default function Profile() {
    const profile = useSelector(state => state.profile.user)
    const dispatch = useDispatch()
    const { formState, register, handleSubmit } = useForm({ action: 'user', defaultValues: profile })
    return (
        <form onSubmit={handleSubmit(({ data } = {}) => {
            if (data.user) {
                const { _id, ...user } = data.user
                dispatch(setUserData(user))
            }
        })} noValidate>
            <div className={styles.profile}>
                <div className={styles.field}>
                    <Input
                        placeholder="ФИО"
                        {...register('name', { required: true })}
                    />
                </div>
                <div className={styles.field}>
                    <Input
                        placeholder="Дата рождения"
                        {...register('birthdate')}
                    />
                </div>
                <div className={styles.field}>
                    <Select
                        placeholder="Правовая форма"
                        options={[
                            { value: 1, label: 'Физическое лицо' },
                            { value: 2, label: 'Индивидуальный предприниматель' },
                            { value: 3, label: 'Акционерное общество' }
                        ]}
                        {...register('legalForm')}
                    />
                </div>
                <div className={styles.field}>
                    <Input
                        placeholder="Телефон"
                        mask="+7 999 999 9999"
                        {...register('phone', { required: true })}
                    />
                </div>
                <div className={styles.field}>
                    <Input
                        placeholder="E-mail"
                        {...register('email', {
                            required: true,
                            getValidationError: val => !isValidEmail(val) && 'Введите корректный e-mail'
                        })}
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