import React from 'react'

class Notification extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      message: props.message,
      status: props.status,
      type: props.type
    }
  }

  render () {
    const { type, message, status } = this.props
    return (
      <div className='alert-wrap'>
        <div className={`alert alert-${type}`} style={{ display: `${status ? 'block' : 'none'}` }}>
          <p>{message}</p>
        </div>
      </div>
    )
  }
}

export default Notification
