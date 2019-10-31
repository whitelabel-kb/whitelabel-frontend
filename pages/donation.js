import React from 'react'
import DefaultLayout from '../src/layout/DefaultLayout'
import {withReduxSaga} from '../src/redux/store'
import Donation from '../src/containers/Donation'

class Page extends React.Component {
  static getInitialProps (props) {
    const { query } = props
    return {
      link: query.link || null,
      amount: query.amount || null
    }
  }

  render () {
    return (
      <DefaultLayout>
        <Donation {...this.props} />
      </DefaultLayout>
    )
  }
}

export default withReduxSaga(Page)
