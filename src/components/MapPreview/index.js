import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Polygon } from 'react-leaflet'

const pathOptionsFull = {
    color: '#000',
    weight: 2,
    dashArray: '4 4',
    fillOpacity: 0,
    lineCap: 'butt'
}

const pathOptionsArea = {
    color: '#E87258',
    weight: 2,
    dashArray: '4 4',
    fillOpacity: 0.5,
    lineCap: 'butt'
}

export default function MapPreview({
    area,
    intersection,
    style = { width: '100%', height: '100%' }
}) {
    return (
        <MapContainer
            bounds={area || intersection}
            style={style}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {!!area && <Polygon
                positions={area}
                pathOptions={(intersection && intersection.length > 0) ? pathOptionsFull : pathOptionsArea}
            />}
            {!!intersection && <Polygon
                positions={intersection}
                pathOptions={pathOptionsArea}
            />}
        </MapContainer>
    )
}