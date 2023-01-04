import styles from './Checkbox.module.scss'
import Check from './check.svg'
import cn from 'classnames'

export default function Checkbox(props = {}) {
    const {
        onChange = () => {},
        children,
        disabled,
        size,
        ...rest
    } = props

    const handleChange = e => onChange(e.target.value, e)

    return (
        <label
            className={cn({
                [styles.checkbox]: true,
                [styles[size]]: !!size,
                [styles.disabled]: disabled
            })}>
            <input
                className={styles.checkboxInput}
                type="checkbox"
                onChange={handleChange}
                disabled={disabled}
                {...rest}
            />
            <div className={styles.checkboxBlock}>
                <Check className={styles.checkboxIcon} />
            </div>
            {!!children && <div className={styles.checkboxContent}>
                {children}
            </div>}
        </label>
    )
}