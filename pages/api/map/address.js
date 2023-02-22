import createHandler from '@lib/handler'

const handler = createHandler()

handler.get((req, res) => {
    // @TODO detect csrf or xml-request
    const { q } = req.query || {}
    var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address"

    var options = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Token ${process.env.DADATA_API_KEY}`
        },
        body: JSON.stringify({ query: q })
    }

    fetch(url, options)
        .then(response => response.json())
        .then(result => res.status(200).json(result))
        .catch(error => res.status(500).json({ error }))
})

export default handler
