import { GoogleLogout } from 'react-google-login'

const GoogleSignOut = (props) => (
  <GoogleLogout
    onLogoutSuccess={() => props.onLogoutSuccess()}
  >
    <i className='fab fa-google-plus-g' />
    <span> {props.buttonText}</span>
  </GoogleLogout>
)

export default GoogleSignOut
