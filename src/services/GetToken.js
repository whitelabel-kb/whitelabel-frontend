import Cookies from 'universal-cookie'
const cookies = new Cookies()

const getToken = () => {
  return cookies.get('access_token')
}
export default getToken
