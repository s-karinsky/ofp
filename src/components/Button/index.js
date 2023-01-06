import cn from 'classnames'
import Link from 'next/link'
import styles from './Button.module.scss'

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
    const Tag = rest.href ? Link : 'button'

    return (
        <Tag
            className={cn({
                [styles.button]: true,
                [styles.fullsize]: fullSize,
                [styles[size]]: !!size,
                [styles[color]]: !!color,
                [className]: !!className
            })}
            style={{
                width,
                height,
                lineHeight: height
            }}
            {...rest}
        >
            {children}
        </Tag>
    )
}