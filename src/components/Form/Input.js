import React from 'react'
import pt from 'prop-types'
import cn from 'classnames'
import IconHide from './hide.svg'
import IconShow from './show.svg'
import styles from './Form.module.scss'

class Input extends React.Component {
    static propTypes = {
        type: pt.string,
        value: pt.oneOfType([pt.string, pt.number]),
        defaultValue: pt.oneOfType([pt.string, pt.number]),
        onChange: pt.func,
        required: pt.bool,
        error: pt.oneOfType([pt.string, pt.bool]),
        placeholder: pt.string
    }

    state = {
        isPasswordVisible: false
    }

    toggleShowPassword = () => {
        this.setState({
            isPasswordVisible: !this.state.isPasswordVisible
        })
    }

    getInputType() {
        const { type } = this.props
        if (type !== 'password') return type || 'text'
        return this.state.isPasswordVisible ? 'text' : type
    }

    handleChange = e => {
        const { onChange } = this.props
        if (!onChange) return
        const value = e.target.value
        onChange(value, e)
    }

    renderShowPasswordIcon() {
        const { isPasswordVisible } = this.state;
        return (
            <span className={styles.toggleShowPassword} onClick={this.toggleShowPassword}>
                {isPasswordVisible ? <IconHide /> : <IconShow />}
            </span>
        )
    }

    render() {
        const { error, required, className, type, ...rest } = this.props;
        const placeholder = required && !rest.placeholder ? ' ' : rest.placeholder
    
        return (
            <>
                <label className={cn(styles.input)}>
                    {type === 'password' && this.renderShowPasswordIcon()}
                    <input
                        type={this.getInputType()}
                        className={cn(styles.inputField, {
                            [styles.inputError]: !!error,
                            [className]: !!className
                        })}
                        {...rest}
                        placeholder={placeholder}
                        onChange={this.handleChangeInput}
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

export default Input