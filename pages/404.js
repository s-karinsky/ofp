import Button from '@components/Button'

export default function NotFoundPage() {
    return (
        <div className="not-found">
            <div className="not-found_header">404</div>
            <div className="not-found_title">Страница не найдена.</div>
            <div className="not-found_text">Извините, мы не можем найти то, что вы искали.</div>
            <div className="not-found_button">
                <Button color="white" href="/" height="72px" fullSize>На главную</Button>
            </div>
        </div>
    )
}
