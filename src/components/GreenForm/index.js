import React from 'react'
import styles from './GreenForm.module.scss'

export default function GreenForm({ children, ...form }) {
    return (
        <div className={styles.greenForm}>
            <div className="container">
                <form {...form}>
                    {React.Children.map(children, (child, i) => (
                        <div className={styles.greenFormInput} key={i}>
                            {child}
                        </div>
                    ))}
                </form>
            </div>
        </div>
    )
}