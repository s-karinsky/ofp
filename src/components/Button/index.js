import styles from './Button.module.scss'
import cn from 'classnames'

export default function Button(props = {}) {
    var {
        children,
        fullSize,
        size,
        color,
        width,
        height,
        className,
        ...rest
    } = props

    return (
        <button
            className={cn({
                [styles.button]: true,
                [styles.fullsize]: fullSize,
                [styles[size]]: !!size,
                [styles[color]]: !!color,
                [className]: !!className
            })}
            style={{
                width,
                height
            }}
            {...rest}
        >
            {children}
        </button>
    )
}