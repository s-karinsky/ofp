import dynamic from 'next/dynamic'
const MyMap = dynamic(() => import('@components/Map'), { ssr: false });
export default function MapPage() {
    return (
        <MyMap />
    )
}
