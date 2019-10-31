import React from 'react'
import Cookies from 'universal-cookie'
import DefaultLayout from '../src/layout/DefaultLayout'
import {withReduxSaga} from '../src/redux/store'
// import {Creators as SampleActions} from '../src/redux/SampleRedux'
import Login from '../src/containers/Login'

class PageLogin extends React.Component {
  // check page has token in cookie
  static async getInitialProps ({ req, res }) {
    if (req && req.headers) {
      let cookies = new Cookies(req.headers.cookie)
      const { host } = req.headers
      if (res) {
        if ((Object.keys(cookies.cookies).length > 0) && cookies.cookies.access_token) {
          res.writeHead(302, {
            Location: `http://${host}`
          })
          res.end()
          res.finished = true
        }
      }
    }
  }

  render () {
    return (
      <DefaultLayout>
        <Login />
      </DefaultLayout>
    )
  }
}

export default withReduxSaga(PageLogin)
