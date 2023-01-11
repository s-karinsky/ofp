import React from 'react'
import pt from 'prop-types'
import cn from 'classnames'
import styles from './Form.module.scss'
import IconArrow from './arrow.svg'

const getSelected = (val, options) => {
    var option = options.find(item => `${item.value}` === `${val}`)
    return option && option.label
}

class Select extends React.Component {
    static propTypes = {
        error: pt.string,
        required: pt.bool,
        options: pt.array,
        value: pt.oneOfType([pt.string, pt.number]),
        defaultValue: pt.oneOfType([pt.string, pt.number]),
        onChange: pt.func,
        placeholder: pt.string
    }

    state = {
        selectLabel: this.props.defaultValue && this.props.options
            ? getSelected(this.props.defaultValue, this.props.options)
            : this.props.placeholder
    }

    handleChangeSelect = e => {
        const { value, options, onChange } = this.props;
        const val = e.target.value
        if (value === undefined) {
            const selectLabel = getSelected(val, options)
            this.setState({ selectLabel })
        }
        if (onChange) onChange(val, e)
        e.target.blur()
    }

    render() {
        const { error, required, options, placeholder, className, ...rest } = this.props
        const { selectLabel } = this.state
        const valueLabel = rest.value === undefined ? selectLabel : getSelected(rest.value, options)

        return (
            <>
                <label className={cn(styles.input)}>
                    <div
                        className={cn(styles.inputField, styles.selectField, {
                            [styles.inputError]: !!error,
                            [styles.selectPlaceholder]: valueLabel === placeholder,
                            [className]: !!className
                        })}>
                        {valueLabel || ''}
                        {(required && valueLabel === placeholder) && <span>*</span>}
                    </div>
                    <select
                        className={cn(styles.select, {
                            [styles.selectWithValue]: !!valueLabel
                        })}
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
                        <IconArrow />
                    </span>
                </label>
                {!!error && <div className={styles.errorMessage}>{error}</div>}
            </>
        )
    }
}

export default Select