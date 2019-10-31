import React from 'react'
import {connect} from 'react-redux'

class ContentWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    const { children, toogle } = this.props
    return (
      <div className={`content-wrapper ${toogle.isToogled && 'toggled'}`}>
        { children }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  toogle: state.toogle
})

export default connect(mapStateToProps)(ContentWrapper)
