import { useState, useRef } from 'react'
import axios from '@lib/axios'

export function useForm({ defaultValues = {}, action, method = 'post' } = {}) {
    const formControl = useRef()
    if (!formControl.current) {
        formControl.current = {
            validators: {}
        }
    }
    const _form = formControl.current
    const [ values, setValues ] = useState(defaultValues)
    const [ errors, setErrors ] = useState({})
    const [ formState, setFormState ] = useState({ submitting: false })
    const setError = (name, value) => typeof name === 'object' ?
        setErrors({ ...errors, ...name }) :
        setErrors({ ...errors, [name]: value })

    const setValue = (name, value) => typeof name === 'object' ?
        setValues({ ...values, ...name }) :
        setValues({ ...values, [name]: value })

    const handleChange = name => e => {
        let { value } = e.target
        if (['checkbox', 'radio'].indexOf(e.target.type) !== -1) {
            value = e.target.checked
        }
        setValue(name, value)
        if (errors[name]) setError(name, null)
    }

    const handleBlur = name => e => {
        const { value } = e.target
        if (typeof _form.validators[name] !== 'function') {
            return
        }
        const error = _form.validators[name](value)
        setError(name, error)
    }

    const register = (name, { getValidationError, required, checkbox } = {}) => {
        _form.validators[name] = value => {
            if (required && !value) return 'Обязательное поле'
            if (typeof getValidationError !== 'function') return false
            return getValidationError(value)
        }

        const res = {
            name,
            onBlur: handleBlur(name),
            onChange: handleChange(name),
            error: errors[name],
            required
        }

        if (checkbox) {
            res.checked = !!values[name]
        } else {
            res.value = values[name] || ''
        }

        return res
    }

    const handleSubmit = (onSuccess = () => {}, onError = () => {}) => e => {
        e.preventDefault()
        const submitErrors = {}
        let isInvalid = false
        Object.keys(_form.validators).map(name => {
            submitErrors[name] = _form.validators[name](values[name])
            isInvalid = isInvalid || !!submitErrors[name]
        })
        setErrors(submitErrors)

        if (isInvalid) {
            onError(values, errors)
            return
        }

        const submitValues = Object.keys(values).reduce((res, key) => {
            if (!key.includes('.')) {
                return { ...res, [key]: values[key] }
            }
            const parts = key.split('.')
            let valueProp = res
            parts.forEach((part, i) => {
                if (!valueProp[part]) {
                    valueProp[part] = {}
                }
                if (i === parts.length - 1) {
                    valueProp[part] = values[key]
                }
                valueProp = valueProp[part]
            })
            return { ...res }
        }, {})

        if (action) {
            const promise = typeof action === 'function' ?
                action(submitValues) :
                axios.request({
                    method,
                    url: action,
                    data: submitValues
                })
            setFormState({ submitting: true })
            promise
                .then(onSuccess)
                .catch(onError)
                .finally(() => setFormState({ submitting: false }))
        } else {
            onSuccess(submitValues)
        }
    }

    return { handleSubmit, register, setError, setValue, formState, values }
}
