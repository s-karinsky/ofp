import { useSelector } from 'react-redux'
import Button from '@components/Button'
import Input from '@components/Input'
import styles from './Profile.module.scss'

export default function Profile() {
    const profile = useSelector(state => state.profile.user)
    return (
        <div className={styles.profile}>
            <div className={styles.field}>
                <Input placeholder="ФИО" defaultValue={profile.name} required />
            </div>
            <div className={styles.field}>
                <Input placeholder="Дата рождения" defaultValue={profile.birthdate} />
            </div>
            <div className={styles.field}>
                <Input
                    placeholder="Правовая форма"
                    defaultValue={profile.status}
                    options={[
                        { value: 1, label: 'Физическое лицо' },
                        { value: 2, label: 'Индивидуальный предприниматель' },
                        { value: 3, label: 'Акционерное общество' }
                    ]}
                />
            </div>
            <div className={styles.field}>
                <Input placeholder="Телефон" defaultValue={profile.phone} />
            </div>
            <div className={styles.field}>
                <Input placeholder="E-mail" defaultValue={profile.email} required />
            </div>
            <div className={styles.field}>
                <Button fullSize>Сохранить</Button>
            </div>
        </div>
    )
}