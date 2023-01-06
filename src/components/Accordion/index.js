import React, { useState } from 'react'
import pt from 'prop-types'
import cn from 'classnames'
import styles from './Accordion.module.scss'

class Accrodion extends React.Component {
    static propTypes = {
        title: pt.string,
        children: pt.node
    }

    state = {
        height: 0
    }

    textRef = React.createRef()

    toggleState = () => {
        const height = this.state.height ? 0 : this.textRef.current.offsetHeight
        this.setState({ height })
    }

    render() {
        const { title, children } = this.props
        const { height } = this.state
        return (
            <div
                className={cn(styles.accordion, {
                    [styles.accrodionOpened]: !!height
                })}
            >
                <div className={styles.title} onClick={this.toggleState}>
                    {title}
                    <img src="/images/arrow.svg" className={styles.arrow} />
                </div>
                <div
                    className={styles.textWrapper}
                    style={{ height }}
                >
                    <div className={styles.text} ref={this.textRef}>
                        {children}
                    </div>
                </div>
            </div>
        )
    }
}

export default Accrodion