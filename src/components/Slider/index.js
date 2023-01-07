import React from 'react'
import pt from 'prop-types'
import Button from '@components/Button'
import PrevIcon from './prev.svg'
import NextIcon from './next.svg'
import styles from './Slider.module.scss'

class Slider extends React.Component {
    static propTypes = {
        children: pt.node,
        slidesToShow: pt.number
    }

    state = {
        firstSlide: 0,
        slideDir: 0
    }

    slidesRef = React.createRef()

    componentDidMount() {
        this.slidesRef.current.addEventListener(
            'transitionend',
            this.handleTransitionEnd,
            false
        )
    }

    componentWillUnmount() {
        this.slidesRef.current.removeEventListener(
            'transitionend',
            this.handleTransitionEnd
        )
    }

    handleTransitionEnd = () => {
        this.setState({
            firstSlide: this.state.firstSlide + this.state.slideDir,
            slideDir: 0
        })
    }

    getSlideByIndex = index => {
        const { children } = this.props
        const childArray = React.Children.toArray(children)
        while (index >= childArray.length) {
            index -= childArray.length
        }
        while (index < 0) {
            index += childArray.length
        }
        return childArray[index]
    }

    getSlidesForRender = () => {
        const { children, slidesToShow } = this.props
        const { firstSlide } = this.state
        const showArray = [];
        for (var i = firstSlide; i <= firstSlide + slidesToShow; i++) {
            showArray.push(this.getSlideByIndex(i))
        }
        showArray.unshift(this.getSlideByIndex(firstSlide - 1))
        return showArray
    }

    scrollSlider = slideDir => () => {
        this.setState({ slideDir })
    }

    renderSlide = (slide, i) => {
        const { slidesToShow } = this.props
        const width = 100 / slidesToShow + '%'
        return (
            <div
                key={i}
                className={styles.slide}
                style={{ width }}
            >
                {slide}
            </div>
        )
    }

    render() {
        const { slidesToShow } = this.props
        const { slideDir } = this.state
        const width = 100 / slidesToShow
        const slides = this.getSlidesForRender()
        const transform = `translateX(${-width * slideDir - width}%)`
        const transition = slideDir !== 0 ? 'ease .3s transform' : null
        return (
            <>
                <div className={styles.nav}>
                    <Button
                        color="white"
                        onClick={this.scrollSlider(-1)}
                        className={styles.navButton}
                        width="52px"
                        height="52px"
                    >
                        <PrevIcon />
                    </Button>
                    <Button
                        color="white"
                        onClick={this.scrollSlider(1)}
                        className={styles.navButton}
                        width="52px"
                        height="52px"
                    >
                        <NextIcon />
                    </Button>
                </div>
                <div className={styles.slider}>
                    <div
                        ref={this.slidesRef}
                        className={styles.slides}
                        style={{
                            transform,
                            transition
                        }}
                    >
                        {slides.map(this.renderSlide)}
                    </div>
                </div>
            </>
        )
    }
}

export default Slider