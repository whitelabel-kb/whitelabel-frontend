import React from 'react'
import Img from 'react-image'
// themes
import { Images } from '../themes'

export default (props) => {
  const loader = <img src={Images.loading} />
  // const unloader = <img src={Images.loadingFailed} />
  return <Img
    {...props}
    loader={loader}
    unloader={loader} />
}
