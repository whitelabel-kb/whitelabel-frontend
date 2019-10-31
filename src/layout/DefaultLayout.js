import React from 'react'
import ContentWrapper from '../components/ContentWrapper'
import Sidebar from '../components/Sidebar'

export default class extends React.Component {
  render () {
    const { children } = this.props
    return (
      <ContentWrapper>
        <Sidebar />
        { children }
      </ContentWrapper>
    )
  }
}
