import UsePage from '@components/UsePage'
import data from '@json/usage.json'

export default function UsagePage({ content }) {
    return (
        !content ? null : <UsePage content={content} />
    )
}

export async function getStaticPaths() {
    const paths = Object.keys(data).map(page => ({ params: { page } }))
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    const { page } = params
    const content = data[page]

    return {
        props: {
            content
        }
    }
}