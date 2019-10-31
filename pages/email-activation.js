import React from 'react'
import DefaultLayout from '../src/layout/DefaultLayout'
import {withReduxSaga} from '../src/redux/store'
import EmailActivation from '../src/containers/EmailActivation'

class Page extends React.Component {
  static getInitialProps (props) {
    const { query } = props
    return {
      token: query.token || null,
      uid: query.uid || null
    }
  }
  render () {
    return (
      <DefaultLayout>
        <EmailActivation {...this.props} />
      </DefaultLayout>
    )
  }
}

export default withReduxSaga(Page)
