import React from 'react'
import DefaultLayout from '../src/layout/DefaultLayout'
import Home from '../src/containers/Home'
import { withReduxSaga } from '../src/redux/store'

class Page extends React.Component {
  render () {
    return (
      <DefaultLayout>
        <Home />
      </DefaultLayout>
    )
  }
}

export default withReduxSaga(Page)
