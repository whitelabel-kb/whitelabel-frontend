import React from 'react'
import DefaultLayout from '../src/layout/DefaultLayout'
import {withReduxSaga} from '../src/redux/store'
import Register from '../src/containers/Register'

class Page extends React.Component {
  render () {
    return (
      <DefaultLayout>
        <Register />
      </DefaultLayout>
    )
  }
}

export default withReduxSaga(Page)
