import React from 'react'
// import Cookies from 'universal-cookie'
import DefaultLayout from '../src/layout/DefaultLayout'
import {withReduxSaga} from '../src/redux/store'
import Authed from '../src/components/Authed'

class Page extends React.Component {
  // check page has token in cookie

  render () {
    return (
      <DefaultLayout>
        <Authed />
      </DefaultLayout>
    )
  }
}

export default withReduxSaga(Page)
