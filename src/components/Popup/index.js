import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'
import { hidePopup, hideMessage } from '@store/popup'
import Button from '@components/Button'
import IconClose from './close.svg'
import IconSuccess from './success.svg'
import IconError from './error.svg'
import styles from './Popup.module.scss'

const MessageIcon = {
    error: IconError,
    success: IconSuccess
}

export default function Popup(props = {}) {
    const {
        name,
        title,
        noBorder,
        contentOnly,
        children
    } = props
    const dispatch = useDispatch()
    const [ isPopupMouseDown, setPopupMouseDown ] = useState()
    const popupName = useSelector(({ popup }) => popup.popupName)
    const popupMessageVisible = useSelector(({ popup }) => popup.popupMessage.visible)
    const handleWrapperClick = e => {
        if (e.target === e.currentTarget) {
            if (isPopupMouseDown)
                setPopupMouseDown(false)
            else
                dispatch(hidePopup())
        }
    }
    return (
        popupName !== name ?
            null :
            <div
                className={cn(styles.popupWrapper, {
                    [styles.popupHidden]: popupMessageVisible
                })}
                onClick={handleWrapperClick}
            >
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

export function PopupMessage() {
    const { icon, text, visible, buttonText = 'Закрыть' } = useSelector(({ popup }) => popup.popupMessage)
    const dispatch = useDispatch()
    const Icon = MessageIcon[icon]
    return (
        !visible ?
            null :
            <div
                className={cn(styles.popupWrapper)}
                onClick={() => dispatch(hideMessage())}
            >
                <div className={cn(styles.popup)}>
                    <div className={styles.popupMessage}>
                        <div className={styles.popupMessageContent}>
                            {!!Icon && <Icon className={cn(styles.popupMessageIcon, styles[icon])} />}
                            {text}
                        </div>
                        <Button
                            className={styles.popupMessageSubmit}
                            type="button"
                            fullSize
                        >
                            {buttonText}
                        </Button>
                    </div>
                </div>
            </div>
    )
}

export function PopupOverlay() {
    const dispatch = useDispatch()
    const isVisible = useSelector(({ popup }) => popup.isVisible || popup.popupMessage.visible)
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
