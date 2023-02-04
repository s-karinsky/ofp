import React from 'react'
import pt from 'prop-types'
import cn from 'classnames'
import IconHide from './hide.svg'
import IconShow from './show.svg'
import styles from './Form.module.scss'

class Textarea extends React.Component {
    static propTypes = {
        value: pt.oneOfType([pt.string, pt.number]),
        defaultValue: pt.oneOfType([pt.string, pt.number]),
        onChange: pt.func,
        required: pt.bool,
        error: pt.oneOfType([pt.string, pt.bool]),
        placeholder: pt.string
    }

    handleChange = e => {
        const { onChange } = this.props
        if (!onChange) return
        const value = e.target.value
        onChange(e, value)
    }

    render() {
        const { error, required, className, ...rest } = this.props;
        const placeholder = required && !rest.placeholder ? ' ' : rest.placeholder
    
        return (
            <>
                <label className={cn(styles.input)}>
                    <textarea
                        className={cn(styles.inputField, styles.textarea, {
                            [styles.inputError]: !!error,
                            [className]: !!className
                        })}
                        {...rest}
                        placeholder={placeholder}
                        onChange={this.handleChange}
                    />
                    {required && <span className={cn(styles.requiredMark)}>
                        {rest.placeholder ? rest.placeholder + ' ' : ''}
                        <span>*</span>
                    </span>}
                </label>
                {!!error && <div className={styles.errorMessage}>{error}</div>}
            </>
        )
    }
}

export default Textarea