import 'leaflet/dist/leaflet.css'
import React from 'react'
import kmlParser from 'js-kml-parser'
import { polygon, point } from '@turf/helpers'
import intersect from '@turf/intersect'
import area from '@turf/area'
import distance from '@turf/distance'
import { MapContainer, TileLayer, ZoomControl, Polygon } from 'react-leaflet'
import cn from 'classnames'
import Button from '@components/Button'
import { Input } from '@components/Form'
import Calendar from '@components/Calendar'
import Popup from '@components/Popup'
import Spinner, { SpinnerRing } from '@components/Spinner'
import { getRectPolygonByCorners, getMultipolygon, reversePolygonCoords } from '@lib/geo'
import { getFormattedDate } from '@lib/datetime'
import { declOfNum } from '@lib/utils'
import axios from '@lib/axios'
import { DRAW_TYPE_OPTIONS, DATE_OPTIONS } from './consts'
import { Draw, DrawArea } from './draw'
import { IconSearch, IconDate, IconArea, IconRect, IconPolygon, IconKML, IconArrow, IconCart } from './icons'
import styles from './Map.module.scss'

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
        return kmlGeometry.coordinates
    }
    if (kmlGeometry.type === 'GeometryCollection') {
        return kmlGeometry.geometries.map(getPolygon)
    }
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
        applyRange: null,
        searchProgress: false,
        searchResult: null,
        detailsAreaId: null,
        detailsAreaPolygon: null,
        highlightArea: null
    }

    pushToCart = async (item) => {
        const areaId = item.id
        const coords = item.isNew && item.polygon
        const res = await axios.post('/order', {
            action: 'add',
            areaId,
            coords
        })
        const { data: { order: { createdAt, status, items = [] } = {} } = {} } = res
        this.props.setOrderCount(items.length)
    }

    searchArea = (points) => {
        const searchPolygon = reversePolygonCoords(getMultipolygon(points))
        const turfSearchItems = searchPolygon.map(polygon)
        const coords = JSON.stringify(searchPolygon)
        this.setState({ searchProgress: true })
        axios.get('/map/search', { params: { coords } }).then(({ data: { result = [] } = {} }) => {
            const searchResult = result.map(item => {
                const polygonCoords = reversePolygonCoords(item.polygon)
                const turfPolygon = polygon(item.polygon)

                const intersections = turfSearchItems
                    .map(inter => intersect(inter, turfPolygon))
                    .filter(inter => inter)
                    .map((inter, i) => ({
                        id: `${item.id}_${i}`,
                        polygon: reversePolygonCoords(inter.geometry.coordinates)
                    }))

                return {
                    ...item,
                    polygon: polygonCoords,
                    intersections
                }
            })

            this.setState({
                searchProgress: false,
                searchResult
            })
        })
    }

    setDrawType = drawType => () => {
        this.setState({
            isDraw: true,
            drawType,
            showOptions: null,
            searchResult: null
        })
    }

    setDateType = dateType => () => {
        this.setState({ dateType, showOptions: null })
        if (dateType === 'custom') this.props.showPopup('map-date-range')
    }

    handleFinishDraw = points => {
        const { drawType, dateFrom, dateTo } = this.state
        const polygon = drawType === 'rect' ? getRectPolygonByCorners(points) : points
        this.setState({
            isDraw: false,
            points: polygon
        })
        this.searchArea(polygon, dateFrom, dateTo)
    }

    getArea() {
        const { points } = this.state
        const multipolygon = getMultipolygon(points)
        let totalArea = 0
        multipolygon.forEach(points => {
            const turfPoly = polygon(reversePolygonCoords(points))
            totalArea += Number((area(turfPoly) / 1000000).toFixed(2))
        })
        return totalArea
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
            if (!Array.isArray(features) || !features.length) {
                alert('Файл не содержит координат или некорректен')
                return
            }
            let polygon = []
            features.map(feature => {
                polygon.push(getPolygon(feature.geometry))
            })
            const points = reversePolygonCoords(polygon).filter(p => p.length)
            this.handleFinishDraw(points)
        }
        reader.readAsText(file)
    }

    renderSearchResult = () => {
        const { searchResult, highlightArea } = this.state
        if (!searchResult || !searchResult.length) return null
        return (
            searchResult.map(area => (
                <>
                    <Polygon
                        key={area.id}
                        positions={area.polygon}
                        eventHandlers={{
                            click: () => {
                                this.setState({ detailsAreaId: area.id, detailsAreaPolygon: null })
                                this.props.showPopup('area-details')
                            },
                            mouseover: () => this.setState({ highlightArea: area.id }),
                            mouseout: () => this.setState({ highlightArea: null })
                        }}
                        pathOptions={{
                            color: '#000',
                            weight: 2,
                            dashArray: '4 4',
                            fillOpacity: highlightArea === area.id ? 0.5 : 0,
                            lineCap: 'butt'
                        }}
                    />
                    {Array.isArray(area.intersections) && area.intersections.map((inter, i) => (
                        <Polygon
                            key={inter.id}
                            positions={inter.polygon}
                            eventHandlers={{
                                click: () => {
                                    this.setState({ detailsAreaId: area.id, detailsAreaPolygon: inter.polygon })
                                    this.props.showPopup('area-details')
                                },
                                mouseover: () => this.setState({ highlightArea: inter.id }),
                                mouseout: () => this.setState({ highlightArea: null }) 
                            }}
                            pathOptions={{
                                color: '#fff',
                                weight: 2,
                                dashArray: '4 4',
                                fillColor: '#E87258',
                                fillOpacity: highlightArea === inter.id ? 0.8 : 0.3,
                                lineCap: 'butt'
                            }}
                        />
                    ))}
                </>
            ))
        )
    }

    renderDistances() {
        const { points } = this.state
        const multipolygon = getMultipolygon(points)
        
        return (
            <div className={styles.allDistances}>
                {multipolygon.map((polygon, i) => {
                    return (
                        <div className={styles.polygonDistances} key={i}>
                            {polygon.map(this.renderPointsDistances)}
                        </div>
                    )
                })}
            </div>
        )
    }

    renderPointsDistances(points, num) {
        const pairs = []
        for (var i = 0; i < points.length - 1; i++) {
            var p1 = [points[i][1], points[i][0]]
            var p2 = [points[i+1][1], points[i+1][0]]
            pairs.push({ points: [point(p1), point(p2)], output: p1 })
        }
        return (
            <div className={styles.distances} key={num}>
                {pairs.map((pair, i) => (
                    <div className={styles.distanceItem} key={i}>
                        <span>{i + 1}</span>
                        <span>
                            <input type="text" defaultValue={pair.output[1]} className={styles.pointInput} disabled />
                            , <input type="text" defaultValue={pair.output[0]} className={styles.pointInput} disabled />
                        </span>
                        <span>{(distance(...pair.points) * 1000).toFixed(2)} м</span>
                    </div>
                ))}
            </div>
        )
    }

    render() {
        const { isLogged } = this.props
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
            applyRange,
            searchProgress,
            searchResult,
            detailsAreaId,
            detailsAreaPolygon
        } = this.state

        const detailsItem = !detailsAreaId || !searchResult ?
            null :
            searchResult.find(item => item.id === detailsAreaId)

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
                <Popup name="area-details">
                    {!detailsItem && 'Ошибка загрузки данных'}
                    {!!detailsItem && <>
                        <div className={styles.areaPreview}>
                            <img src={`/uploads/${detailsItem.preview}`} />
                        </div>
                        <div className={styles.areaDetails}>
                            <span><b>Площадь: </b>{(area(polygon(reversePolygonCoords(detailsAreaPolygon || detailsItem.polygon))) / 1000000).toFixed(2)} км<sup>2</sup></span><br />
                            <span><b>Дата: </b>{getFormattedDate(detailsItem.date)}</span>
                        </div>
                    </>}
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
                        {this.renderSearchResult()}
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
                        {this.renderDistances()}
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
                                    (DATE_OPTIONS[dateType] || 'Дата')
                                }
                                <span className={styles.optionsArrow}><IconArrow /></span>
                            </div>
                            <div className={cn(styles.options, { [styles.options_visible]: showOptions === 'date' })}>
                                {Object.keys(DATE_OPTIONS).map(key => (
                                    <div key={key} className={styles.option} onClick={this.setDateType(key)}>
                                        {DATE_OPTIONS[key]}
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
                                {DRAW_TYPE_OPTIONS[drawType] || 'Область'}
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
                                            accept=".kml,.kmz,.xml"
                                            onChange={this.handleFileChange}
                                            onClick={e => e.target.value = null}
                                        />
                                    </label>
                                </div>
                            </div>
                        </span>
                    </div>
                </div>

                {(searchProgress || searchResult) && <div className={styles.resultPanel}>
                    <div className={styles.resultHeader}>
                        {searchProgress ? <>
                            <div className={styles.resultSpinner}>
                                <Spinner color="green" />
                            </div>
                            Поиск снимков
                        </> : <div>
                            {searchResult.length === 1 ? 'Найден' : 'Найдено'} {searchResult.length} {declOfNum(searchResult.length, ['снимок', 'снимка', 'снимков'])}
                        </div>}
                    </div>
                    {Array.isArray(searchResult) && <div className={styles.resultContent}>
                        <ul className={styles.resultList}>
                            {searchResult.map((item, i) => (
                                <li key={item.id}>
                                    <div
                                        className={styles.resultPlan}
                                        onMouseOver={() => this.setState({ highlightArea: item.id })}
                                        onMouseOut={() => this.setState({ highlightArea: null })}
                                    >
                                        {i + 1}. Ортофотоплан
                                        <div className={styles.resultIcons}>
                                            <IconSearch
                                                className={styles.resultIconSearch}
                                                onClick={() => {
                                                    this.setState({ detailsAreaId: item.id, detailsAreaPolygon: null })
                                                    this.props.showPopup('area-details')
                                                }}
                                            />
                                            {isLogged && <IconCart
                                                className={styles.resultIconCart}
                                                onClick={() => this.pushToCart(item)}
                                            />}
                                        </div>
                                    </div>
                                    {item.intersections.length > 0 && item.intersections.map((inter, j) => (
                                        <div
                                            key={inter.id}
                                            className={styles.resultPlan}
                                            onMouseOver={() => this.setState({ highlightArea: inter.id })}
                                            onMouseOut={() => this.setState({ highlightArea: null })}
                                        >
                                            {i + 1}.{j + 1} Ортофотоплан
                                            <div className={styles.resultIcons}>
                                                <IconSearch
                                                    className={styles.resultIconSearch}
                                                    onClick={() => {
                                                        this.setState({ detailsAreaId: item.id, detailsAreaPolygon: inter.polygon })
                                                        this.props.showPopup('area-details')
                                                    }}
                                                />
                                                {isLogged && <IconCart
                                                    className={styles.resultIconCart}
                                                    onClick={() => this.pushToCart({ ...inter, isNew: true, id: item.id })}
                                                />}
                                            </div>
                                        </div>
                                    ))}
                                </li>
                            ))}
                            {isLogged && <li className={styles.resultPlan}>
                                Заказать карту
                                <div className={styles.resultIcons}>
                                    <IconCart
                                        className={styles.resultIconCart}
                                        onClick={() => this.pushToCart({ isNew: true, polygon: [points] })}
                                    />
                                </div>
                            </li>}
                        </ul>
                    </div>}
                </div>}
            </div>
        )
    }
}
