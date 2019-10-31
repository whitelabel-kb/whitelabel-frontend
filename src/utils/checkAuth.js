import Cookies from 'universal-cookie'
import Router from 'next/router'
import getToken from '../services/GetToken'

export const checkAuth = (req, res) => {
  if (req && req.headers) {
    let cookies = new Cookies(req.headers.cookie)
    const { host } = req.headers
    if (res) {
      if (!cookies.cookies.access_token) {
        res.writeHead(302, {
          Location: `http://${host}/login`
        })
        res.end()
        res.finished = true
      }
    }
  } else {
    let accessToken = getToken()
    if (!accessToken) {
      Router.push('/login')
    }
  }
}
