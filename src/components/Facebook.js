import React from 'react'
import FacebookLogin from 'react-facebook-login'
const FacebookAppId = process.env.FACEBOOK_APP_ID

const Facebook = (props) => {
  return (
    <FacebookLogin
      appId={FacebookAppId}
      fields='name,email,picture'
      textButton={props.text}
      disableMobileRedirect
      cssClass={props.className}
      callback={(response) => props.responseFacebook(response)}
      icon={<i className={props.icon} />}
    />
  )
}

export default Facebook
