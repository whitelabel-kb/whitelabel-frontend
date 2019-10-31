import React from 'react'
import { Router } from '../../routes'
import Link from 'next/link'
import {connect} from 'react-redux'
import { imageUrl } from '../helpers/input'
import { Images } from '../themes'
import MyImage from '../components/MyImage'
import getToken from '../services/GetToken'
import LoginDrop from '../components/LoginDrop'
import NotLoginDrop from '../components/NotLoginDrop'
import { Creators as UserActions } from '../redux/UserRedux'
import { Creators as CampaignsActions } from '../redux/CampaignRedux'
import { Creators as uiActions } from '../redux/ui'

class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      authed: '',
      user: props.user,
      toogle: false,
      searching: false
    }
    this.fetching = { getUser: false, listCampaigns: false }
  }

  handleToogle () {
    const { toogle } = this.state
    this.setState({ toogle: !toogle })
    this.props.toogleRequest({ toogle: !toogle })
  }

  componentDidMount () {
    let authed = getToken()
    this.setState({ authed })
    if (!this.state.user.isFound) {
      this.fetching = { ...this.fetching, getUser: true }
      this.props.getUser()
    }
  }

  handleSearch (e) {
    const { value } = e.target
    if (e.key === 'Enter') {
      if (value) {
        Router.pushRoute(`/explore?search=${value}`)
      } else {
        Router.pushRoute(`/explore`)
      }
      this.setState({ searching: false })
    }
    this.props.saveSearch({ search: value })
  }

  componentWillReceiveProps (nextProps) {
    const { user } = nextProps
    const { isFetching, isFound, isFailure } = user
    if (!isFetching && this.fetching.getUser) {
      this.fetching = { ...this.fetching, getUser: false }
      if (isFound) {
        this.setState({ user })
      }
      if (isFailure) {
        this.setState({ user })
      }
    }
  }

  render () {
    const { authed, user, searching } = this.state
    const { companyLogo, companyMobileLogo, searchText } = this.props
    let image = companyLogo.path ? imageUrl(companyLogo.path) : ''
    let imageLogoMobile = companyMobileLogo.path ? imageUrl(companyMobileLogo.path) : ''
    return (
      <header>
        <div className='header-default'>
          <div className='container'>
            <div className='header-wrapper'>
              <div className='header-logo' >
                <Link href='/'>
                  <a className='logo-desktop'>
                    <MyImage className='logo-header' src={image} alt='LOGO' />
                  </a>
                </Link>
                <a className='menu-mobile' role='button' data-toggle='offcanvas' onClick={() => this.handleToogle()}>
                  <MyImage src={Images.menu} alt='image' />
                </a>
              </div>
              <div className='header-center'>
                <div className='header-logo-center'>
                  <a onClick={() => Router.push('/')}>
                    <MyImage src={imageLogoMobile} alt='LOGO' /></a>
                </div>
                <div className='header-search'>
                  <input name='search' value={searchText.searchText} className='form-search-header' type='search' placeholder='Cari judul, nama atau isi campaign'
                    onChange={(e) => this.handleSearch(e)}
                    onKeyPress={(e) => this.handleSearch(e)} />{ this.fetching.listCampaigns && <img src={Images.loadingSpinCyan} alt='loading' style={{ paddingLeft: '10px' }} /> }
                </div>
                <div className='header-button'><a className='btn btn-orange' onClick={() => Router.pushRoute('/explore')}>Donasi Sekarang</a></div>
              </div>
              <div className='header-menu dropdown'>
                <a className='search-icon' id='openSearch' onClick={() => this.setState({ searching: !searching })}>
                  <MyImage src={Images.search} alt='image' />
                </a>
                <a className='profile-icon' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>
                  {
                    authed
                    ? <MyImage src={Images.userCircle} />
                    : <MyImage src={Images.menu} />
                  }
                </a>
                {
                  authed
                  ? user.isFound && <LoginDrop {...user.data} />
                  : <NotLoginDrop />
                }
              </div>
            </div>
          </div>
        </div>
        <div className='header-search-wrapper' id='searchHeader' style={{ display: `${searching ? 'block' : 'none'}` }}>
          <div className='header-search-form'>
            <input onChange={(e) => this.handleSearch(e)} value={searchText.searchText} onKeyPress={(e) => this.handleSearch(e)}
              name='search' className='form-control search' type='search' placeholder='Cari Campaign' /><a onClick={() => this.setState({ searching: false })} className='close-search' id='hideSearch'>Batal</a>
          </div>
        </div>
      </header>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  campaigns: state.campaigns,
  searchText: state.searchText
})

const mapDispatchToProps = (dispatch) => ({
  getUser: () => dispatch(UserActions.userRequest()),
  listCampaigns: (data) => dispatch(CampaignsActions.campaignsRequest(data)),
  toogleRequest: (data) => dispatch(uiActions.toogleRequest(data)),
  saveSearch: (data) => dispatch(uiActions.searchText(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
