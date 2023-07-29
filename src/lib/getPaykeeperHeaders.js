const { PAYKEEPER_LOGIN, PAYKEEPER_PASSWORD } = process.env

export default function() {
  const base64 = btoa(`${PAYKEEPER_LOGIN}:${PAYKEEPER_PASSWORD}`)
  return {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${base64}`
  }
}