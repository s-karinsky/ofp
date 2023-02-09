import styles from './UsePage.module.scss'

export default function UsePage({ content }) {
    return (
        <div className={styles.usePage}>
            <div
                className={styles.usePageHeader}
                style={{
                    backgroundImage: `url(/images/usecases/${content.contentImage})`
                }}
            >
                <div className="container">
                    <div className="title title_noline">{content.title}</div>

                    <ul className={styles.useList}>
                        {content.contentList.map((item, i) => (
                            <li key={i}>
                                {item}
                            </li>
                        ))}
                    </ul>

                </div>
            </div>
            <div className="container">
                <div className="user_html" dangerouslySetInnerHTML={{ __html: content.content }}></div>
            </div>
        </div>
    )
}