import { useState } from 'react'
import {
    Rectangle,
    Polyline,
    Polygon,
    useMap,
    useMapEvents
} from 'react-leaflet'

const pathOptions = {
    color: '#E87258',
    weight: 2
}

function DrawRect({ onFinish = () => {} }) {
    const [ isDraw, setIsDraw ] = useState()
    const [ bounds, setBounds ] = useState([])
    useMapEvents({
        click: e => {
            const { lat, lng } = e.latlng
            if (isDraw) {
                setBounds([bounds[0], [lat, lng]])
                onFinish([bounds[0], [lat, lng]])
                setIsDraw(false)
            } else {
                setBounds([[lat, lng]])
                setIsDraw(true)
            }
        },
        mousemove: e => {
            if (!isDraw) return
            const { lat, lng } = e.latlng
            setBounds([bounds[0], [lat, lng]])
        }
    })
    return bounds.length === 2
        ? <Rectangle bounds={bounds} pathOptions={pathOptions} className="mapPointer"  />
        : null
}

function DrawPolyline({ onFinish = () => {} }) {
    const [ isDraw, setIsDraw ] = useState()
    const [ bounds, setBounds ] = useState([])
    const [ pointMove, setPointMove ] = useState([])
    useMapEvents({
        click: e => {
            const { lat, lng } = e.latlng
            if (isDraw) {
                const lastBound = bounds[bounds.length - 1]
                if (lastBound[0] !== lat || lastBound[1] !== lng) {
                    setBounds([...bounds, [lat, lng]])
                }
            } else {
                setBounds([[lat, lng]])
                setIsDraw(true)
            }
        },
        mousemove: e => {
            if (!isDraw) return
            const { lat, lng } = e.latlng
            setPointMove([[lat, lng]])
        },
        dblclick: e => {
            setIsDraw(false)
            setPointMove([])
            setBounds(bounds.concat([bounds[0]]))
            onFinish(bounds.concat([bounds[0]]))
        }
    })
    return bounds.length ?
        <Polyline positions={bounds.concat(pointMove)} pathOptions={pathOptions} className="mapPointer" /> :
        null
}

function Draw({ type, onFinish = () => {} }) {
    // Не думай обо мне плохо, если видишь это. Но по-другому я не смог :)
    const map = useMap()
    const cont = map._container
    cont.classList.add('mapPointer')
    return (
        type === 'rect' ?
            <DrawRect onFinish={onFinish} /> :
            <DrawPolyline onFinish={onFinish} />
    )
}

function DrawArea({ type, points }) {
    // Ну правда не смог :(
    const map = useMap()
    const cont = map._container
    cont.classList.remove('mapPointer')
    return <Polygon positions={points} pathOptions={pathOptions} />
}

export { Draw, DrawArea }