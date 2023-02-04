import Slider from '@components/Slider'
import styles from './UsageSlider.module.scss'

export default function UsageSlider() {
    return (
        <div className={styles.sliderWrapper}>
            <Slider slidesToShow={3}>
                <div>
                    <div className={styles.slideImage}>
                        <img src="/images/slide1.png" width="100%" />
                    </div>
                    <div className={styles.slideText}>
                        Промышленные объекты
                    </div>
                </div>
                <div>
                    <div className={styles.slideImage}>
                        <img src="/images/slide2.png" width="100%" />
                    </div>
                    <div className={styles.slideText}>
                        Сельское хозяйство
                    </div>
                </div>
                <div>
                    <div className={styles.slideImage}>
                        <img src="/images/slide3.png" width="100%" />
                    </div>
                    <div className={styles.slideText}>
                        Строительство
                    </div>
                </div>
            </Slider>
        </div>
    )
}