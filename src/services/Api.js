import apisauce from 'apisauce'
const apiURL = process.env.API_URL

const create = (baseURL = apiURL) => {
  const api = apisauce.create({
    baseURL,
    timeout: 10000
  })

  const headerWithToken = (token) => {
    return {headers: {
      Authorization: `${token}`
    }}
  }

  const headerFormWithToken = (token) => {
    return {headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `${token}`
    }}
  }

  const headerNoToken = {
    header: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    const naviMonitor = (response) => console.log('API DEBUG! response =', response.ok)
    api.addMonitor(naviMonitor)
  }

  const login = (data) => api.post(`${baseURL}users/login`, {...data}, headerNoToken)
  const logout = (token) => api.post(`${baseURL}users/logout?access_token=${token}`, {}, headerWithToken(token))
  const register = (data) => api.post(`${baseURL}users`, {...data}, headerNoToken)
  const authFb = (data) => api.post(`${baseURL}users/auth/facebook`, {...data}, headerNoToken)
  const authGoogle = (data) => api.post(`${baseURL}users/auth/google`, {...data}, headerNoToken)
  const confirm = (data) => api.get(`${baseURL}users/confirm`, {...data}, headerNoToken)
  const forgot = (data) => api.post(`${baseURL}users/reset`, {...data}, headerNoToken)
  const forgotPassword = (data) => api.post(`${baseURL}users/reset-password`, {newPassword: data.newPassword}, headerWithToken(data.token))
  // example with token auth
  const resetPassword = (token, data) => api.post(`${baseURL}users/reset-password`, {...data}, headerWithToken(token))
  const changePassword = (token, data) => api.post(`${baseURL}users/change-password`, {...data}, headerWithToken(token))
  const getCompany = () => api.get(`${baseURL}companies`, {}, headerNoToken)
  const getUser = (token) => api.get(`${baseURL}users/profile`, {}, headerWithToken(token))
  const getMyDonation = (token, data) => api.get(`${baseURL}users/donations`, data, headerWithToken(token))
  const getMyDonationProgress = (token, data) => api.get(`${baseURL}users/progresses`, data, headerWithToken(token))
  const updateUser = (token, data) => api.put(`${baseURL}users/profile`, {...data}, headerWithToken(token))
  const addPhotoUser = (token, data) => api.post(`${baseURL}containers/images/upload`, data, headerFormWithToken(token))
  const getCampaigns = (data) => api.get(`${baseURL}campaigns`, data, headerNoToken)
  const getCampaign = ({ link }) => api.get(`${baseURL}campaigns/${link}`, {}, headerNoToken)
  const getCampaignDonations = (data) => api.get(`${baseURL}campaigns/${data.id}/donations`, data.params, headerNoToken)
  const getCampaignProgress = (data) => api.get(`${baseURL}campaigns/${data.id}/progresses`, data.params, headerNoToken)
  const getCategory = () => api.get(`${baseURL}categories`, {}, headerNoToken)
  const getCampaignByCategory = (data) => api.get(`${baseURL}categories/${data.id}/campaign`, data.params, headerNoToken)
  const postCampaignDonations = (token, data) => api.post(`${baseURL}campaigns/${data.campaignId}/donations`, {...data}, headerWithToken(token))
  const postCampaignDonations2 = (data) => api.post(`${baseURL}campaigns/${data.campaignId}/donations`, {...data}, headerNoToken)
  const getDetailCampaignDonation = (data) => api.get(`${baseURL}campaigns/${data.campaignId}/donations/${data.donationId}`, headerNoToken)
  const listBanks = () => api.get(`${baseURL}funds/banks`, {}, headerNoToken)
  const listProvinces = () => api.get(`${baseURL}provinces`, {}, headerNoToken)
  const listCities = () => api.get(`${baseURL}cities`, {}, headerNoToken)

  return {
    login,
    logout,
    forgot,
    forgotPassword,
    getCompany,
    register,
    authFb,
    authGoogle,
    confirm,
    resetPassword,
    changePassword,
    getUser,
    getMyDonation,
    getMyDonationProgress,
    updateUser,
    addPhotoUser,
    getCampaigns,
    getCampaign,
    getCampaignDonations,
    getCampaignProgress,
    getCategory,
    getCampaignByCategory,
    postCampaignDonations,
    postCampaignDonations2,
    getDetailCampaignDonation,
    listBanks,
    listProvinces,
    listCities
  }
}

// let's return back our create method as the default.
export default {
  create
}
