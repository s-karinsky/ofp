import React from 'react'
import pt from 'prop-types'
import * as R from 'ramda'
import cn from 'classnames'
import styles from './Input.module.scss'
import HideIcon from './hide.svg'
import ShowIcon from './show.svg'
import Arrow from './arrow.svg'

const getSelected = (val, options) => R.path(['label'], R.find(R.propEq('value', val), options));

class Input extends React.Component {
    static propTypes = {
        label: pt.string,
        error: pt.string,
        required: pt.bool,
        size: pt.oneOf(['normal', 'small', 'xsmall']),
        type: pt.string,
        options: pt.array,
        defaultValue: pt.oneOfType([pt.string, pt.number]),
        onChange: pt.func
    }

    state = {
        isPasswordVisible: false,
        selectLabel: this.props.defaultValue && this.props.options
            ? getSelected(this.props.defaultValue, this.props.options)
            : null
    }

    toggleShowPassword = () => {
        this.setState({
            isPasswordVisible: !this.state.isPasswordVisible
        })
    }

    getInputType() {
        const { type } = this.props;
        if (type !== 'password') return type || 'text';
        return this.state.isPasswordVisible ? 'text' : type;
    }

    handleChangeInput = e => {
        const { onChange } = this.props;
        if (!onChange) return;
        const value = e.target.value;
        onChange(value, e);
    }

    handleChangeSelect = e => {
        const { value, options, onChange } = this.props;
        const val = e.target.value;
        if (value === undefined) {
            const selectLabel = getSelected(val, options);
            this.setState({ selectLabel });
        }
        if (onChange) onChange(val, e);
        e.target.blur();
    }

    renderShowPasswordIcon() {
        const { isPasswordVisible } = this.state;
        return (
            <span className={styles.toggleShowPassword} onClick={this.toggleShowPassword}>
                {isPasswordVisible ? <HideIcon /> : <ShowIcon />}
            </span>
        )
    }

    renderInput() {
        const { error, size = 'normal', type, ...rest } = this.props;
        return (
            <React.Fragment>
                {type === 'password' && this.renderShowPasswordIcon()}
                <input
                    type={this.getInputType()}
                    className={cn({
                        [styles.inputField]: true,
                        [styles.inputError]: !!error,
                        [styles[size]]: !!size
                    })}
                    {...rest}
                    onChange={this.handleChangeInput}
                />
            </React.Fragment>
        )
    }

    renderSelect() {
        const { error, options, value, defaultValue, size = 'normal', ...rest } = this.props;
        const { selectLabel } = this.state;
        const valueLabel = value === undefined ? selectLabel : getSelected(value, options)

        return (
            <React.Fragment>
                <div
                    className={cn({
                        [styles.inputField]: true,
                        [styles.inputError]: !!error,
                        [styles[size]]: !!size
                    })}>
                    {valueLabel}
                </div>
                <select
                    className={cn({
                        [styles.select]: true,
                        [styles[size]]: !!size,
                        [styles.selectWithValue]: !!valueLabel
                    })}
                    defaultValue={defaultValue}
                    {...rest}
                    onChange={this.handleChangeSelect}
                >
                    {options.map(option => (
                        <option value={option.value} key={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <span className={styles.selectArrow}>
                    <Arrow />
                </span>
            </React.Fragment>
        )
    }

    render() {
        const { label, error, required, size = 'normal', options, placeholder } = this.props;
    
        return (
            <React.Fragment>
                {!!label && <div className={styles.label}>
                    {label}
                </div>}
                <label className={styles.input}>
                    {options ? this.renderSelect() : this.renderInput()}
                    {required && <span
                        className={cn({
                            [styles.requiredMark]: true,
                            [styles[size]]: !!size
                        })}
                    >
                        {placeholder ? placeholder + ' ' : ''}<span>*</span>
                    </span>}
                    {!!error && <div className={styles.errorMessage}>{error}</div>}
                </label>
            </React.Fragment>
        )
    }
}

export default Input