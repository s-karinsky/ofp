import React from 'react'
import { connect } from 'react-redux'
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import cn from 'classnames'
import { computeArea, computeDistanceBetween } from 'spherical-geometry-js'
import 'leaflet/dist/leaflet.css'
import Button from '@components/Button'
import { Input } from '@components/Form'
import Calendar from '@components/Calendar'
import Popup from '@components/Popup'
import { Draw, DrawArea } from './draw'
import { IconSearch, IconDate, IconArea, IconRect, IconPolygon, IconKML, IconArrow } from './icons'
import styles from './Map.module.scss'

function getRectCoords(p) {
    return [[p[0][0], p[0][1]], [p[0][0], p[1][1]], [p[1][0], p[1][1]], [p[1][0], p[0][1]], [p[0][0], p[0][1]]]
}

function getDateOffsetMonth(offset = 0) {
    let year = new Date().getFullYear()
    let month = new Date().getMonth() + offset
    while (month < 0) {
        month += 12
        year -= 1
    }
    while (month > 11) {
        month -= 12
        year +=1
    }
    return [year, month]
}

const nameByDrawType = {
    rect: 'Прямоугольник',
    polygon: 'Полигон'
}

const nameByDate = {
    last3: 'последние 3 месяца',
    last6: 'последние 6 месяцев',
    lastyear: 'последний год',
    all: 'за все время',
    custom: 'выбрать даты...'
}

export default class Map extends React.Component {
    state = {
        showOptions: null,
        isDraw: false,
        drawType: null,
        dateType: null,
        points: [],
        calendar: getDateOffsetMonth(-1),
        calendar2: getDateOffsetMonth(),
        dateFrom: null,
        dateTo: null
    }

    setDrawType = drawType => () => {
        this.setState({
            isDraw: true,
            drawType,
            showOptions: null
        })
    }

    setDateType = dateType => () => {
        this.setState({ dateType, showOptions: null })
        if (dateType === 'custom') this.props.showPopup('map-date-range')
    }

    handleFinishDraw = points => {
        const { drawType } = this.state
        this.setState({
            isDraw: false,
            points: drawType === 'rect' ? getRectCoords(points) : points
        })
    }

    getArea() {
        const { drawType, points } = this.state
        const lanLng = points.map(item => ({ lat: item[0], lng: item[1]}))
        return (computeArea(lanLng) / 1000000).toFixed(2)
    }

    handleChangeCalendar = key => date => this.setState({ [key]: date })

    renderPointsDistances() {
        const { drawType, points } = this.state
        const pairs = [];
        for (var i = 0; i < points.length - 1; i++) {
            var p1 = { lat: points[i][0], lng: points[i][1] }
            var p2 = { lat: points[i+1][0], lng: points[i+1][1] }
            pairs.push([p1, p2])
        }
        return (
            <div className={styles.distances}>
                {pairs.map((pair, i) => (
                    <div className={styles.distanceItem} key={i}>
                        <span>{i + 1}</span>
                        <span>
                            <input type="text" defaultValue={pair[0].lat} className={styles.pointInput} disabled />
                            , <input type="text" defaultValue={pair[0].lng} className={styles.pointInput} disabled />
                        </span>
                        <span>{computeDistanceBetween(pair[0], pair[1]).toFixed(2)} м</span>
                    </div>
                ))}
            </div>
        )
    }

    render() {
        const { showOptions, drawType, dateType, isDraw, points, calendar, calendar2 } = this.state
        return (
            <div className={styles.map}>
                <Popup name="map-date-range" contentOnly>
                    <div className={styles.calendars}>
                        <div className={styles.calendarOuter}>
                            <div className={styles.calendar}>
                                <Calendar
                                    month={calendar[1]}
                                    year={calendar[0]}
                                    onChange={this.handleChangeCalendar('calendar')}
                                />
                            </div>
                            <Button fullSize>Применить</Button>
                        </div>
                        <div className={styles.calendarOuter}>
                            <div className={styles.calendar}>
                                <Calendar
                                    month={calendar2[1]}
                                    year={calendar2[0]}
                                    onChange={this.handleChangeCalendar('calendar2')}
                                />
                            </div>
                            <Button onClick={this.props.hidePopup} fullSize>Отмена</Button>
                        </div>
                    </div>
                </Popup>
                <div className={styles.mapContainer}>
                    <MapContainer
                        center={[53.721152, 91.442396]}
                        scrollWheelZoom={false}
                        doubleClickZoom={false}
                        zoomControl={false}
                        zoom={13}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <ZoomControl position="bottomright" />
                        {isDraw ?
                            <Draw type={drawType} onFinish={this.handleFinishDraw} /> :
                            <DrawArea points={points} type={drawType} />
                        }
                    </MapContainer>
                </div>
                {!isDraw && !!drawType && <div className={styles.editPanel}>
                    <div className={styles.editHeader}>
                        Площадь {this.getArea()} км<sup>2</sup>
                    </div>
                    <div className={styles.distanceHeader}>
                        <span>№</span>
                        <span>Координаты</span>
                        <span>Расстояние</span>
                    </div>
                    <div>
                        {this.renderPointsDistances()}
                    </div>
                </div>}
                <div className={styles.searchPanel}>
                    <div className={styles.searchField}>
                        <span className={styles.searchIcon}><IconSearch /></span>
                        <span className={styles.searchInput}>
                            <Input placeholder="Найти" className={styles.input} />
                        </span>
                    </div>
                    <div className={styles.searchField}>
                        <span className={styles.searchIcon}><IconDate /></span>
                        <span className={styles.searchInput}>
                            <div
                                className={cn(styles.input, {
                                    [styles.input_opened]: showOptions === 'date'
                                })}
                                onClick={() => this.setState({ showOptions: showOptions === 'date' ? null : 'date' })}
                            >
                                {nameByDate[dateType] || 'Дата'}
                                <span className={styles.optionsArrow}><IconArrow /></span>
                            </div>
                            <div className={cn(styles.options, { [styles.options_visible]: showOptions === 'date' })}>
                                {Object.keys(nameByDate).map(key => (
                                    <div key={key} className={styles.option} onClick={this.setDateType(key)}>
                                        {nameByDate[key]}
                                    </div>
                                ))}
                            </div>
                        </span>
                    </div>
                    <div className={styles.searchField}>
                        <span className={styles.searchIcon}><IconArea /></span>
                        <span className={styles.searchInput}>
                            <div
                                className={cn(styles.input, {
                                    [styles.input_opened]: showOptions === 'draw'
                                })}
                                onClick={() => this.setState({ showOptions: showOptions === 'draw' ? null : 'draw' })}
                            >
                                {nameByDrawType[drawType] || 'Область'}
                                <span className={styles.optionsArrow}><IconArrow /></span>
                            </div>
                            <div className={cn(styles.options, { [styles.options_visible]: showOptions === 'draw' })}>
                                <div className={styles.option} onClick={this.setDrawType('rect')}>
                                    <span className={styles.optionIcon}><IconRect /></span>
                                    прямоугольник
                                </div>
                                <div className={styles.option} onClick={this.setDrawType('polygon')}>
                                    <span className={styles.optionIcon}><IconPolygon /></span>
                                    полигон
                                </div>
                                <div className={styles.option}>
                                    <span className={styles.optionIcon}><IconKML /></span>
                                    файл (KML)
                                </div>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}
