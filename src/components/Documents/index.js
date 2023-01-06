import styles from './Documents.module.scss'

export default function Documents() {
    return (
        <div className={styles.documents}>
            <div className="container">
                <h1 className="title title_white title_noline">
                    Документы
                </h1>
                <div className={styles.links}>
                    <div className={styles.linkWrap}>
                        <a className={styles.link} href="/file.docx">Согласие на трансграничную передачу данных</a>
                    </div>
                    <div className={styles.linkWrap}>
                        <a className={styles.link} href="/file.docx">Договор-оферта</a>
                    </div>
                    <div className={styles.linkWrap}>
                        <a className={styles.link} href="/file.docx">Положение о конфиденциальности</a>
                    </div>
                    <div className={styles.linkWrap}>
                        <a className={styles.link} href="/file.docx">Пользовательское соглашение</a>
                    </div>
                </div>
            </div>
        </div>
    )
}