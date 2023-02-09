import UseCases from '@components/UseCases'
import data from '@json/usage.json'

export default function UsagePage({ items }) {
    return (
        <UseCases items={items} />
    )
}

export async function getStaticProps() {
    const items = Object.keys(data).map(key => {
        const link = key
        const { title, preview, order } = data[key]
        return { link, title, preview, order }
    }).sort((a, b) => a.order > b.order)

    return {
        props: {
            items
        }
    }
}