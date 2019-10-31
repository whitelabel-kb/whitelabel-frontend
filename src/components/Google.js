import GoogleLogin from 'react-google-login'
const GoogleClientId = process.env.GOOGLE_CLIENT_ID

const Google = (props) => (
  <GoogleLogin
    clientId={GoogleClientId}
    className={props.className}
    onSuccess={(response) => props.onSuccess(response)}
    onFailure={(response) => props.onFailure(response)}
  >
    <i className={props.icon} />
    <span> {props.text}</span>
  </GoogleLogin>
)

export default Google
