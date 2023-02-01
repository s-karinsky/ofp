import cn from 'classnames'
import styles from './Form.module.scss'
import Check from './check.svg'

export default function Checkbox(props = {}) {
    const {
        onChange = () => {},
        children,
        disabled,
        size,
        error,
        ...rest
    } = props

    const handleChange = e => onChange(e, e.target.value)

    return (
        <label
            className={cn({
                [styles.checkbox]: true,
                [styles[size]]: !!size,
                [styles.checkboxError]: !!error,
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