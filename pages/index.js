import Home from '@components/Home'
import usageJson from '@json/usage.json'

export default function HomePage({
    usage = []
}) {
    return (
        <Home
            usage={usage}
        />
    )
}

export async function getStaticProps() {
    const usage = Object.keys(usageJson).map(key => {
        const link = key
        const { title, preview, order } = usageJson[key]
        return { link, title, preview, order }
    }).sort((a, b) => a.order > b.order)

    return {
        props: {
            usage
        }
    }
}