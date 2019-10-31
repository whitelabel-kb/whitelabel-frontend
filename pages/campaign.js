import React from 'react'
import DefaultLayout from '../src/layout/DefaultLayout'
import {withReduxSaga} from '../src/redux/store'
import CampaignDetail from '../src/containers/CampaignDetail'

class Page extends React.Component {
  static getInitialProps (props) {
    const { query } = props
    return {
      link: query.urlLink || null
    }
  }
  render () {
    let link = this.props.link || this.props.url.query.urlLink
    return (
      <DefaultLayout>
        <CampaignDetail link={link} {...this.props} />
      </DefaultLayout>
    )
  }
}

export default withReduxSaga(Page)
