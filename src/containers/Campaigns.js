import React from 'react'
import {connect} from 'react-redux'
import { animateScroll as scroll } from 'react-scroll'
// Components
import MainContent from '../containers/MainContent'
import Section from '../components/Section'
import Container from '../components/Container'
import Campaign from '../containers/Campaign'
import { Images } from '../themes'
import MyImage from '../components/MyImage'
import NotificationSystem from 'react-notification-system'
import { imageUrl } from '../helpers/input'
// actions
import { Creators as CategoryActions } from '../redux/Categories'
import { Creators as CampaignActions } from '../redux/CampaignRedux'
import { Creators as uiActions } from '../redux/ui'

class Campaigns extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      campaigns: props.campaigns || null,
      categories: props.categories || null,
      isEmpty: false,
      selected: {
        category: null,
        sort: 'many'
      },
      modal: {
        categories: false,
        filter: false
      },
      search: '',
      limit: 9,
      notification: {
        message: '',
        position: 'tc',
        level: 'error'
      }
    }
    this._notificationSystem = null
    this.action = { getCategories: false, getCampaignsByCategories: false }
  }

  _addNotification () {
    if (this._notificationSystem) {
      this._notificationSystem.addNotification(this.state.notification)
    }
  }

  componentDidUpdate (prevProps) {
    const { search } = prevProps
    if (search !== this.props.search) {
      this.loadDataCampaigns()
    }
  }

  componentDidMount () {
    this.loadDataCampaigns()
    if (!this.state.categories.isFound) {
      this.action = { ...this.action, getCategories: true }
      this.props.getCategories()
    }
    scroll.scrollToTop()
  }

  componentWillUnmount () {
    this.props.searchText({ search: '' })
  }

  loadDataCampaigns () {
    const { limit, selected } = this.state
    const { search } = this.props
    let params = {}
    // default
    // !search && !catergory && sort: newest
    if (!search && !selected.category && selected.sort === 'newest') {
      params = {
        filter: {
          limit,
          order: 'createdAt DESC',
          where: { isPublished: true }
        }
      }
      this.props.listCampaigns(params)
    }
    // !search && !catergory && sort: many
    if (!search && !selected.category && selected.sort === 'many') {
      params = {
        filter: {
          limit,
          order: ['isActive DESC', 'totalDonation DESC', 'searchCounter DESC'],
          where: { isPublished: true }
        }
      }
      this.props.listCampaigns(params)
    }
    // !search && catergory && sort: newest
    if (!search && selected.category && selected.sort === 'newest') {
      params = {
        filter: {
          limit,
          order: 'createdAt DESC',
          where: { isPublished: true }
        }
      }
      this.props.getCampaignsByCategories({ id: selected.category, params })
    }
    // !search && catergory && sort: many
    if (!search && selected.category && selected.sort === 'many') {
      params = {
        filter: {
          limit,
          order: ['isActive DESC', 'totalDonation DESC', 'searchCounter DESC'],
          where: { isPublished: true }
        }
      }
      this.props.getCampaignsByCategories({ id: selected.category, params })
    }
    // search && !catergory && sort: newest
    if (search && !selected.category && selected.sort === 'newest') {
      let searchTextSplit = search.split(' ').map(data => {
        return `.*${data}.*`
      })
      let params = {
        filter: {
          limit,
          order: 'createdAt DESC',
          where: {
            isPublished: true,
            title: {
              like: `${searchTextSplit.join('|')}`, 'options': 'i'
            }
          }
        }
      }
      this.props.listCampaigns(params)
    }
    // search && !catergory && sort: many
    if (search && !selected.category && selected.sort === 'many') {
      let searchTextSplit = search.split(' ').map(data => {
        return `.*${data}.*`
      })
      let params = {
        filter: {
          limit,
          order: ['isActive DESC', 'totalDonation DESC', 'searchCounter DESC'],
          where: {
            isPublished: true,
            title: {
              like: `${searchTextSplit.join('|')}`, 'options': 'i'
            }
          }
        }
      }
      this.props.listCampaigns(params)
    }
    // search && catergory && sort: newest
    if (search && selected.category && selected.sort === 'newest') {
      let searchTextSplit = search.split(' ').map(data => {
        return `.*${data}.*`
      })
      let params = {
        filter: {
          limit,
          order: 'createdAt DESC',
          where: {
            isPublished: true,
            title: {
              like: `${searchTextSplit.join('|')}`, 'options': 'i'
            }
          }
        }
      }
      this.props.getCampaignsByCategories({ id: selected.category, params })
    }
    // search && catergory && sort: many
    if (search && selected.category && selected.sort === 'many') {
      let searchTextSplit = search.split(' ').map(data => {
        return `.*${data}.*`
      })
      let params = {
        filter: {
          limit,
          order: ['isActive DESC', 'totalDonation DESC', 'searchCounter DESC'],
          where: {
            isPublished: true,
            title: {
              like: `${searchTextSplit.join('|')}`, 'options': 'i'
            }
          }
        }
      }
      this.props.getCampaignsByCategories({ id: selected.category, params })
    }
  }

  getCampaignByCategory (id) {
    const { selected } = this.state
    this.setState({ selected: { ...selected, category: id },
      modal: { categories: false, filter: false }
    }, () => {
      this.loadDataCampaigns()
    })
  }

  sortCampaigns (sort) {
    const { selected } = this.state
    this.setState({ selected: { ...selected, sort },
      modal: { categories: false, filter: false }
    }, () => {
      this.loadDataCampaigns()
    })
  }

  loadMoreCampaigns () {
    let { limit } = this.state
    limit = limit + 9
    this.setState({ limit }, () => {
      this.loadDataCampaigns()
    })
  }

  componentWillReceiveProps (nextProps) {
    const { categories, campaigns } = nextProps
    const { isFetching, isFound, isFailure } = categories

    if (!isFetching && this.action.getCategories) {
      this.action = { ...this.action, getCategories: false }
      if (isFound) {
        this.setState({ categories })
      }
      if (isFailure) {
        let notification = {
          message: categories.message,
          status: true,
          type: 'danger'
        }
        this.setState({ categories, notification }, () => {
          this._addNotification()
        })
      }
    }

    if (!campaigns.isFetching) {
      if (campaigns.isFound) {
        this.setState({ campaigns })
      }
      if (campaigns.isFailure) {
        let notification = {
          message: campaigns.message,
          status: true,
          type: 'danger'
        }
        this.setState({ campaigns, notification }, () => {
          this._addNotification()
        })
      }
    }
  }

  render () {
    const { campaigns, categories, selected, modal, limit } = this.state
    return (
      <MainContent>
        <Section className='grey-wrapper'>
          <Container>
            <NotificationSystem ref={n => (this._notificationSystem = n)} />
            <div className='campaign-list-explore-wrap'>
              <div className='campaign-list-sort'>
                <div className='label-sort'>Cari, pilih salurkan untuk campaign yang anda inginkan</div>
                <div className='form-sort'>
                  { categories.isFound && <CategoriesButton
                    categories={categories}
                    getCampaignByCategory={(id) => this.getCampaignByCategory(id)}
                    selected={selected} />
                  }
                  <FilterButton
                    sortCampaigns={(params) => this.sortCampaigns(params)}
                    selected={selected} />
                </div>
              </div>
              <div className='campaign-list-view'>
                <p>Menampilkan <u> {campaigns.isFound && campaigns.data.filter(data => data.isPublished).length} Campaign </u></p>
              </div>
            </div>
            {
              (campaigns.isSearch && campaigns.isFound) && campaigns.data.filter(data => data.isPublished).length < 1
              ? <EmptyCampaign />
              : <Campaign
                limit={limit}
                loadMoreCampaigns={() => this.loadMoreCampaigns()} />
            }
          </Container>
          <div className='button-fixed-bottom list-filter'>
            <button className='btn btn-orange' onClick={() => this.setState({ modal: { ...modal, categories: !modal.categories } })}><MyImage src={Images.categories} alt='icon' /> Kategori</button>
            <button className='btn btn-orange' onClick={() => this.setState({ modal: { ...modal, filter: !modal.filter } })}><MyImage src={Images.filter} alt='icon' /> Filter</button>
          </div>
        </Section>
        { categories.isFound &&
        <ModalCategories
          modal={modal}
          closeModal={() => this.setState({ modal: { ...modal, categories: !modal.categories } })}
          categories={categories}
          getCampaignByCategory={(id) => this.getCampaignByCategory(id)}
          selected={selected} />
        }
        <ModalFilter
          modal={modal}
          closeModal={() => this.setState({ modal: { ...modal, filter: !modal.filter } })}
          sortCampaigns={(params) => this.sortCampaigns(params)}
          selected={selected} />
      </MainContent>
    )
  }
}

const CategoriesButton = ({ categories, getCampaignByCategory, selected }) => {
  let sortCategories = []
  categories.data.map((category, i) => { sortCategories.push(category) })
  sortCategories.sort((a, b) => a.name.localeCompare(b.name))
  return (
    <div className='group-filter dropdown'>
      <button className='dropdownOne btn btn-dropdown dropdown-toggle' type='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>Kategori</button>
      <ul className='dropdown-menu dropdown-kategori'>
        <li>
          <ul className='kategori-dropwrap list-unstyled'>
            <li className={selected.category === null ? 'active' : ''} onClick={() => getCampaignByCategory(null)}><a href='#'><MyImage src={Images.hamburger} height='20' width='20' /> Semua Kategori</a></li>
            {
              sortCategories.map((category, i) => {
                let image = (category.categoryIcon && category.categoryIcon.path) ? imageUrl(category.categoryIcon.path) : Images.hamburger
                if (category.isActive) {
                  return (
                    <li className={selected.category === category.id ? 'active' : ''} key={i}
                      onClick={() => getCampaignByCategory(category.id)}>
                      <a href='#'><MyImage src={image} height='20' width='20' />
                        {category.name}</a>
                    </li>
                  )
                }
              })
            }
          </ul>
        </li>
      </ul>
    </div>
  )
}

const FilterButton = ({ selected, sortCampaigns }) => (
  <div className='group-filter dropdown'>
    <button className='dropdownOne btn btn-dropdown dropdown-toggle' type='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>Urutkan</button>
    <ul className='dropdown-menu dropdown-filter'>
      <li className={selected.sort === 'newest' ? 'active' : ''} onClick={() => sortCampaigns('newest')}><a href='#'><MyImage src={Images.hamburger} height='20' width='20' /> Terbaru</a></li>
      <li className={selected.sort === 'many' ? 'active' : ''} onClick={() => sortCampaigns('many')}><a href='#'><MyImage src={Images.hamburger} height='20' width='20' /> Terbanyak</a></li>
      {/* <li><a><img src={Images.disabilitas} /> Filter Lainnya </a></li> */}
    </ul>
  </div>
)

const ModalCategories = ({ modal, closeModal, categories, getCampaignByCategory, selected }) => {
  let sortCategories = []
  categories.data.map((category, i) => { sortCategories.push(category) })
  sortCategories.sort((a, b) => a.name.localeCompare(b.name))
  return (
    <div className='modal topten' id='kategori' role='dialog' style={{ display: `${modal.categories ? 'block' : 'none'}` }}>
      <div className='modal-dialog noscroll' role='document'>
        <div className='modal-content'>
          <div className='modal-body'>
            <div className='modal-category-top'>
              <h1>Kategori</h1><a className='closed' type='button' onClick={() => closeModal()}><span className='fas fa-times' aria-hidden='true' /></a>
            </div>
            <div className='modal-category-bottom'>
              <ul className='list-unstyled'>
                <li className={selected.category === null ? 'active' : ''} onClick={() => getCampaignByCategory(null)}><a href='#'><MyImage src={Images.hamburger} height='20' width='20' /> Semua Kategori</a></li>
                {
                  sortCategories.map((category, i) => {
                    let image = category.categoryIcon && category.categoryIcon.path ? imageUrl(category.categoryIcon.path) : Images.hamburger
                    if (category.isActive) {
                      return (<li className={selected.category === category.id ? 'active' : ''} key={i} onClick={() => getCampaignByCategory(category.id)}><a href='#'><MyImage src={image} height='20' width='20' /> {category.name}</a></li>)
                    }
                  })
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ModalFilter = ({ modal, closeModal, selected, sortCampaigns }) => (
  <div className='modal topten' id='filter' role='dialog' style={{ display: `${modal.filter ? 'block' : 'none'}` }}>
    <div className='modal-dialog noscroll' role='document'>
      <div className='modal-content'>
        <div className='modal-body'>
          <div className='modal-category-top'>
            <h1>Filter</h1><a className='closed' type='button' onClick={() => closeModal()}><span className='fas fa-times' aria-hidden='true' /></a>
          </div>
          <div className='modal-category-bottom'>
            <ul className='list-unstyled'>
              <li className={selected.sort === 'newest' ? 'active' : ''} onClick={() => sortCampaigns('newest')}><a href='#'><MyImage src={Images.hamburger} height='20' width='20' /> Terbaru</a></li>
              <li className={selected.sort === 'many' ? 'active' : ''} onClick={() => sortCampaigns('many')}><a href='#'><MyImage src={Images.hamburger} height='20' width='20' /> Terbanyak</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const EmptyCampaign = () => (
  <div className='log-form-wrap'>
    <div className='title-log'>
      <div className='activation-wrap'>
        <p style={{ textAlign: 'center' }}>Maaf, kami tidak dapat menemukan campaign yg Anda inginkan.</p>
      </div>
    </div>
  </div>
)

const mapStateToProps = (state) => ({
  campaigns: state.campaigns,
  categories: state.categories
})

const mapDispatchToProps = (dispatch) => ({
  getCampaignsByCategories: (data) => dispatch(CampaignActions.campaignsByCategoryRequest(data)),
  getCategories: (data) => dispatch(CategoryActions.categoriesRequest(data)),
  listCampaigns: (data) => dispatch(CampaignActions.campaignsRequest(data)),
  searchText: (data) => dispatch(uiActions.searchText(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Campaigns)
