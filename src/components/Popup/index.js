import React from 'react'
import pt from 'prop-types'
import { connect, useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'
import { hidePopup } from '@store/popup'
import IconClose from './close.svg'
import styles from './Popup.module.scss'

function Popup(props = {}) {
    const {
        name,
        title,
        children
    } = props
    const dispatch = useDispatch()
    const popupName = useSelector(state => state.popup.popupName)
    const handleWrapperClick = e => {
        if (e.target === e.currentTarget) {
            dispatch(hidePopup())
        }
    }
    if (popupName !== name) return null;
    return (
        <div className={styles.popupWrapper} onClick={handleWrapperClick}>
            <div className={styles.popup}>
                <span className={styles.close} onClick={() => dispatch(hidePopup())}>
                    <IconClose />
                </span>
                {!!title && <div className={styles.popupTitle}>
                    {title}
                </div>}
                {children}
            </div>
        </div>
    )
}

class Overlay extends React.Component {
    static propTypes = {
        isVisible: pt.bool,
        hidePopup: pt.func
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.isVisible && nextProps.isVisible) {
            document.body.style.overflow = 'hidden'
            document.body.style.marginRight = '17px'
        }
        if (this.props.isVisible && !nextProps.isVisible) {
            document.body.style.overflow = 'auto'
            document.body.style.marginRight = null
        }
    }

    render() {
        const { isVisible } = this.props
        return (
            <div
                className={cn({
                    [styles.overlay]: true,
                    [styles.overlayVisible]: isVisible
                })}
                onClick={this.props.hidePopup}
            />
        )
    }
}

const PopupOverlay = connect(state => ({
    isVisible: state.popup.isVisible
}), {
    hidePopup
})(Overlay)

export { PopupOverlay }
export default Popup