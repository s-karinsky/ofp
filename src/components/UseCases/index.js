import Link from 'next/link'
import styles from './UseCases.module.scss'

export default function UseCases({ items }) {
    return (
        <div className={styles.useCases}>
            <h1 className="title title_noline">Области применения</h1>
            <ul className={styles.list}>
                {items.map(item => (
                    <li className={styles.item} key={item.link}>
                        <Link className={styles.itemLink} href={`/usage/${item.link}`}>
                            <img
                                src={`/images/usecases/${item.preview}`}
                                className={styles.preview}
                            />
                            <span className={styles.itemTitle}>{item.title}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}