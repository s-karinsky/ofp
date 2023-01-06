import React from 'react'
import styles from './GreenForm.module.scss'

export default function GreenForm({ children }) {
    return (
        <div className={styles.greenForm}>
            <div className="container">
                {React.Children.map(children, (child, i) => (
                    <div className={styles.greenFormInput} key={i}>
                        {child}
                    </div>
                ))}
            </div>
        </div>
    )
}