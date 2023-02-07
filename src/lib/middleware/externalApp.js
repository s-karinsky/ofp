export default function externalApp(req, res, next) {
    const { api_key } = req.query || {}
    if (api_key !== process.env.APP_API_KEY) {
        res.status(404).send()
        return
    }
    next()
}