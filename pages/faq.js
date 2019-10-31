import React from 'react'
import DefaultLayout from '../src/layout/DefaultLayout'
import {withReduxSaga} from '../src/redux/store'
import Faq from '../src/containers/Faq'

class Page extends React.Component {
  render () {
    return (
      <DefaultLayout>
        <Faq />
      </DefaultLayout>
    )
  }
}

export default withReduxSaga(Page)
