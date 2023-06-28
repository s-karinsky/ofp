import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import cn from 'classnames'
import Spinner from '@components/Spinner'
import axios from '@lib/axios'
import { reversePolygonCoords } from '@lib/geo'
import { getFormattedDate } from '@lib/datetime'
import styles from './AreaPreview.module.scss'

export default function AreaPreview({ id, title, polygon = [], price }) {
    const MapPreview = dynamic(() => import('@components/MapPreview'), { ssr: false })
    const [ area, setArea ] = useState({ loading: true, loaded: false })

    useEffect(() => {
        if (!id) {
            setArea({ loading: false, loaded: false })
            return
        }
        axios.get('area', { params: { id } }).then(({ data }) => {
            if (data.success) {
                const { area } = data
                const coordinates = reversePolygonCoords(area.polygon?.coordinates)
                setArea({ ...area, coordinates, loading: false, loaded: true })
            } else {
                setArea({ loading: false, loaded: false })
            }
        })
    }, [id])

    return (
        <div>
            {area.loading && <Spinner color="green" />}
            {!area.loading &&
                <div className={styles.areaPreview}>
                    {area.loaded && <div className={styles.details}>
                        <div className={styles.header}>Информация о снимке</div>
                        <ul className={styles.detailsList}>
                            <li>
                                <b>Дата снимка</b> {getFormattedDate(area.date)}
                            </li>
                            {area.loaded && <li>
                                <b>{!polygon.length ? 'Цена снимка' : 'Цена полного снимка'}</b> {area.price} руб.
                            </li>}
                            {area.loaded && polygon.length > 0 && <li>
                                <b>Цена выделенного фрагмента</b> {price} руб.
                            </li>}
                        </ul>
                    </div>}
                    {!!area.preview && <div className={styles.preview}>
                        <div className={styles.header}>Миниатюра {area.loaded && polygon.length > 0 && 'исходного'} плана</div>
                        <img
                            src={`/static/uploads/${area.preview}`}
                            className={styles.previewImage}
                        />
                    </div>}
                    <div className={styles.map}>
                        <div className={cn(styles.header, styles.mapHeader)}>
                            Выбранная область {area.loaded && polygon.length > 0 && <span>исходный снимок</span>} на карте
                        </div>
                        <MapPreview
                            style={{ width: '100%', height: '300px' }}
                            area={area.coordinates}
                            intersection={polygon}
                        />
                    </div>
                </div>
            }
        </div>
    )
}