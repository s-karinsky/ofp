import React from 'react'
import pt from 'prop-types'
import cn from 'classnames'
import { Select } from '@components/Form'
import styles from './Calendar.module.scss'

const monthNames = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
const weekdayNames = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']

const monthOptions = monthNames.map((label, value) => ({ value, label }))
const yearOptions = Array(30).fill(0).map((_, num) => {
    const value = new Date().getFullYear() - num
    return { value, label: value }
})

function getWeeksInMonth(year, month) {
    let weeks = []
    const firstDate = new Date(year, month, 1)
    const lastDate = new Date(year, month + 1, 0)
    const numDays = lastDate.getDate()
    let dayOfWeekCounter = firstDate.getDay()

    for (let date = 1; date <= numDays; date++) {
        if (dayOfWeekCounter === 1 || weeks.length === 0) {
            weeks.push([])
        }
        weeks[weeks.length - 1].push(date)
        dayOfWeekCounter = (dayOfWeekCounter + 1) % 7
    }
    weeks = weeks.filter((w) => !!w.length)
    if (weeks[0].length < 7) {
        weeks[0] = Array(7 - weeks[0].length).fill('').concat(weeks[0])
    }
    return weeks
}

class Calendar extends React.Component {
    static propTypes = {
        month: pt.oneOfType([pt.number, pt.string]),
        year: pt.oneOfType([pt.number, pt.string]),
        minDate: pt.instanceOf(Date),
        maxDate: pt.instanceOf(Date),
        onChange: pt.func
    }

    renderWeek = (week, num) => {
        const { month, year } = this.props
        const keyPref = `${year}-${month}`
        return (
            <div className={styles.week} key={`${keyPref}-w${num}`}>
                {week.map((date, i) => (
                    <div className={styles.date} key={`${keyPref}-${date || -i}`}>
                        {date}
                    </div>
                ))}
            </div>
        )
    }
    
    render() {
        const { month, year, onChange = () => {} } = this.props
        const weeks = getWeeksInMonth(parseInt(year), parseInt(month))
        return (
            <div className={styles.calendar}>
                <div className={styles.controls}>
                    <div className={styles.selectMonth}>
                        <Select
                            className={styles.select}
                            options={monthOptions}
                            value={month}
                            onChange={val => onChange([year, val])}
                        />
                    </div>
                    <div className={styles.selectYear}>
                        <Select
                            className={styles.select}
                            options={yearOptions}
                            value={year}
                            onChange={val => onChange([val, month])}
                        />
                    </div>
                </div>
                <div className={cn(styles.week, styles.weekdays)}>
                    {weekdayNames.map(name => 
                        <div className={cn(styles.date, styles.dateName)} key={name}>{name}</div>    
                    )}
                </div>
                {weeks.map(this.renderWeek)}
            </div>
        )
    }
}

export default Calendar