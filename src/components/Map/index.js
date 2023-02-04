import React from 'react'
import kmlParser from 'js-kml-parser'
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

function getDateOffsetMonth(offset = 0, date = []) {
    let year = new Date(...date).getFullYear()
    let month = new Date(...date).getMonth() + offset
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

function getPolygon(kmlGeometry) {
    if (kmlGeometry.type === 'Polygon') {
        return kmlGeometry.coordinates[0]
    }
    if (kmlGeometry.type === 'GeometryCollection') {
        return kmlGeometry.geometries.map(getPolygon)
    }
}

function toMultiPolygon(points) {
    return points[0] && typeof points[0][0] === 'number' ? [points] : points
}

const nameByDrawType = {
    rect: 'Прямоугольник',
    polygon: 'Полигон',
    kml: 'Файл (KML)'
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
        dateTo: null,
        applyRange: null
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
        const { points } = this.state
        const lanLng = points.map(item => ({ lat: item[0], lng: item[1]}))
        return (computeArea(lanLng) / 1000000).toFixed(2)
    }

    applyCalendar = () => {
        const { dateFrom, dateTo } = this.state
        const applyRange = {
            start: [...dateFrom].reverse(),
            end: [...dateTo].reverse()
        }
        applyRange.start[1] = Number(applyRange.start[1]) + 1
        applyRange.end[1] = Number(applyRange.end[1]) + 1
        this.setState({ applyRange })
        this.props.hidePopup()
    }

    handleChangeCalendar = key => date => {
        const { calendar, calendar2 } = this.state
        const val = { calendar, calendar2 }
        val[key] = date
        if (new Date(...val.calendar).getTime() >= new Date(...val.calendar2).getTime()) {
            if (key === 'calendar') {
                val.calendar2 = getDateOffsetMonth(1, val.calendar)

                if (val.calendar2[0] > new Date().getFullYear()) {
                    val.calendar2 = val.calendar
                    val.calendar = getDateOffsetMonth(-1, val.calendar2)
                }
            } else {
                val.calendar = getDateOffsetMonth(-1, val.calendar2)
            }
        }
        this.setState(val)
    }

    hideCalendar = () => {
        this.props.hidePopup()
        this.setState({ dateFrom: null, dateTo: null })
    }

    handleFileChange = e => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onload = () => {
            const geoJson = kmlParser.toGeoJson(reader.result)
            const features = geoJson.features
            if (!Array.isArray(features)) return
            let polygon = []
            features.map(feature => {
                polygon.push(getPolygon(feature.geometry))
            })
            this.handleFinishDraw(polygon[0])
        }
        reader.readAsText(file)
    }

    renderPointsDistances(points, num) {
        const pairs = []
        for (var i = 0; i < points.length - 1; i++) {
            var p1 = { lat: points[i][0], lng: points[i][1] }
            var p2 = { lat: points[i+1][0], lng: points[i+1][1] }
            pairs.push([p1, p2])
        }
        return (
            <div className={styles.distances} key={num}>
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
        const {
            showOptions,
            drawType,
            dateType,
            isDraw,
            points,
            calendar,
            calendar2,
            dateFrom,
            dateTo,
            applyRange
        } = this.state
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
                                    onSelect={dateFrom => this.setState({ dateFrom })}
                                    startSelect={dateFrom}
                                    endSelect={dateTo}
                                />
                            </div>
                            <Button onClick={this.applyCalendar} fullSize>Применить</Button>
                        </div>
                        <div className={styles.calendarOuter}>
                            <div className={styles.calendar}>
                                <Calendar
                                    month={calendar2[1]}
                                    year={calendar2[0]}
                                    onChange={this.handleChangeCalendar('calendar2')}
                                    onSelect={dateTo => this.setState({ dateTo })}
                                    startSelect={dateFrom}
                                    endSelect={dateTo}
                                />
                            </div>
                            <Button onClick={this.hideCalendar} fullSize>Отмена</Button>
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
                            <DrawArea points={points} />
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
                        {toMultiPolygon(points).map(this.renderPointsDistances)}
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
                                {dateType === 'custom' && applyRange ?
                                    `${applyRange.start.join('.')} - ${applyRange.end.join('.')}` :
                                    (nameByDate[dateType] || 'Дата')
                                }
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
                                    <label className={styles.optionFile} onClick={this.setDrawType('kml')}>
                                        <span className={styles.optionIcon}><IconKML /></span>
                                        файл (KML)
                                        <input
                                            type="file"
                                            className={styles.file}
                                            accept=".kml,.kmz"
                                            onChange={this.handleFileChange}
                                        />
                                    </label>
                                </div>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}