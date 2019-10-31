import React from 'react'
import DefaultLayout from '../src/layout/DefaultLayout'
import {withReduxSaga} from '../src/redux/store'
import Campaigns from '../src/containers/Campaigns'

class Page extends React.Component {
  static getInitialProps (props) {
    const { query } = props
    return {
      search: query.search || null
    }
  }
  render () {
    return (
      <DefaultLayout>
        <Campaigns {...this.props} />
      </DefaultLayout>
    )
  }
}

export default withReduxSaga(Page)
