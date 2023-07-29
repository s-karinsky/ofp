import jwt from 'jsonwebtoken'

export default async function checkTokenMiddleware(req, res, next) {
  const { token } = req.query || {}
  jwt.verify(token, process.env.APP_API_SECRET, function(error, decoded) {
      if (error) throw new Error(error)
      req.token = decoded
      next()
  })
}