import cn from 'classnames'
import styles from './Spinner.module.scss'

export default function Spinner({ color }) {
    return (
        <div className={cn(styles.spinner, { [styles[color]]: !!color })}>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}