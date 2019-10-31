import React from 'react'
import DefaultLayout from '../src/layout/DefaultLayout'
import {withReduxSaga} from '../src/redux/store'
import SummaryDonation from '../src/containers/SummaryDonation'

class Page extends React.Component {
  static getInitialProps (props) {
    const { query } = props
    return {
      link: query.link || null,
      donationId: query.donationId || null
    }
  }

  render () {
    return (
      <DefaultLayout>
        <SummaryDonation {...this.props} />
      </DefaultLayout>
    )
  }
}

export default withReduxSaga(Page)
