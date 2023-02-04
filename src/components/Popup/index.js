import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'
import { hidePopup } from '@store/popup'
import IconClose from './close.svg'
import styles from './Popup.module.scss'

function Popup(props = {}) {
    const {
        name,
        title,
        noBorder,
        contentOnly,
        children
    } = props
    const dispatch = useDispatch()
    const [ isPopupMouseDown, setPopupMouseDown ] = useState()
    const popupName = useSelector(state => state.popup.popupName)
    const handleWrapperClick = e => {
        if (e.target === e.currentTarget) {
            if (isPopupMouseDown)
                setPopupMouseDown(false)
            else
                dispatch(hidePopup())
        }
    }
    if (popupName !== name) return null;
    return (
        <div className={styles.popupWrapper} onClick={handleWrapperClick}>
            <div
                className={cn(styles.popup, {
                    [styles.contentOnly]: contentOnly,
                    [styles.noBorder]: noBorder
                })}
                onMouseDown={() => setPopupMouseDown(true)}
                onMouseUp={() => setPopupMouseDown(false)}
            >
                {!contentOnly && <span className={styles.close} onClick={() => dispatch(hidePopup())}>
                    <IconClose />
                </span>}
                {!!title && <div className={styles.popupTitle}>
                    {title}
                </div>}
                {children}
            </div>
        </div>
    )
}

function PopupOverlay() {
    const dispatch = useDispatch()
    const isVisible = useSelector(state => state.popup.isVisible)
    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden'
            document.body.style.marginRight = '17px'
        } else {
            document.body.style.overflow = 'auto'
            document.body.style.marginRight = null
        }
    }, [isVisible])

    return (
        <div
            className={cn({
                [styles.overlay]: true,
                [styles.overlayVisible]: isVisible
            })}
            onClick={() => dispatch(hidePopup())}
        />
    )
}

export { PopupOverlay }
export default Popup