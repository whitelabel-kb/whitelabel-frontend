import React from 'react'
import {connect} from 'react-redux'
import Link from 'next/link'
import moment from 'moment'
import Pagination from 'react-js-pagination'
// Components
import MainContent from '../containers/MainContent2'
import PanelProfile from './PanelProfile'
import RupiahFormat from '../helpers/RupiahFormat'
import ReadAbleText from '../helpers/ReadAbleText'
import { inputNormal } from '../helpers/input'
import Section from '../components/Section'
import { Creators as UserActions } from '../redux/UserRedux'
import { Creators as uiActions } from '../redux/ui'

class History extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      myDonation: props.myDonation,
      filterDonation: [],
      search: '',
      status: '',
      hasMore: false,
      isEmpty: false,
      textMessage: 'Anda belum pernah donasi di campaign manapun.',
      page: 1,
      limit: 10,
      offset: 0,
      isSort: false,
      selectStatus: '',
      modal: {
        sort: false,
        status: false
      },
      selected: {
        sort: 'createdAt'
      },
      count: {
        ori: true,
        limit: 10
      },
      notification: {
        message: '',
        position: 'tc',
        level: 'error'
      }
    }
    this.action = { getUser: false, getMyDonations: false, searchMyDonations: false }
  }

  handleSearch (e) {
    const { value, name } = e.target
    const { search, status, limit, selected, modal, isSort, selectStatus } = this.state
    const newState = { search, status, limit, selected, modal, isSort, selectStatus }
    if (name === 'status') {
      newState.isSort = false
      newState.selected.sort = ''
      newState.modal[name] = false
      newState.selectStatus = value
    }
    if (name === 'sort') {
      newState.modal[name] = false
    }
    if (value === 'amount' || value === 'createdAt') {
      newState.selected.sort = value
      newState.selectStatus = value
    } else {
      newState[name] = inputNormal(value)
    }
    this.setState(newState, () => {
      this.filterData()
    })
  }

  handlePageChange (page) {
    const { limit, myDonation, filterDonation, count } = this.state
    this.action = { ...this.action, getMyDonations: true }
    let start = (Number(page) === 1) ? 0 : (Number(page) * Number(limit)) - Number(limit)
    let stop = start + limit
    let paginate = []
    if (count.ori) {
      paginate = myDonation.data.filter((data, i) => {
        return (i >= start && i <= stop)
      })
    } else {
      paginate = filterDonation.filter((data, i) => {
        return (i >= start && i <= stop)
      })
    }
    this.setState({ page: Number(page), filterDonation: paginate })
  }

  filterData () {
    let { myDonation, selected, search, status, limit } = this.state
    let textSearch = search.split(' ').join('|')
    let regex = new RegExp(textSearch, 'gi')
    let filterDonation = []
      // default
    if (!search && selected.sort === 'amount' && limit) {
      let immutableData = []
      myDonation.data.map(data => immutableData.push(data))
      let sortData = immutableData.sort((a, b) => {
        return b.amount - a.amount
      })
      filterDonation = sortData.filter((data, i) => {
        return i < Number(limit)
      })
      this.setState({ filterDonation, count: { ori: true, item: myDonation.meta.count } })
    }
    if (search && selected.sort === 'amount' && limit) {
      let immutableData = []
      myDonation.data.map(data => immutableData.push(data))
      let sortData = immutableData.sort((a, b) => {
        return b.amount - a.amount
      })
      filterDonation = sortData.filter((data, i) => {
        let checkTitle = regex.test(data.campaign.title)
        if (checkTitle === false) { limit += 1 }
        return checkTitle && (i < Number(limit))
      })
      this.setState({ filterDonation, count: { ori: false, item: filterDonation.length } })
    }
    if (!search && selected.sort === 'createdAt' && limit) {
      let immutableData = []
      myDonation.data.map(data => immutableData.push(data))
      let sortData = immutableData.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
      filterDonation = sortData.filter((data, i) => {
        return i < Number(limit)
      })
      this.setState({ filterDonation, count: { ori: true, item: myDonation.meta.count } })
    }
    if (search && selected.sort === 'createdAt' && limit) {
      let immutableData = []
      myDonation.data.map(data => immutableData.push(data))
      let sortData = immutableData.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
      filterDonation = sortData.filter((data, i) => {
        let checkTitle = regex.test(data.campaign.title)
        if (checkTitle === false) { limit += 1 }
        return checkTitle && (i < Number(limit))
      })
      this.setState({ filterDonation, count: { ori: false, item: filterDonation.length } })
    }
    // first filter
    if (!search && !status && limit && !selected.sort) {
      filterDonation = myDonation.data.filter((data, i) => {
        let checkTitle = regex.test(data.campaign.title)
        if (checkTitle === false) { limit += 1 }
        return checkTitle && (i < Number(limit))
      })
      this.setState({ filterDonation, count: { ori: true, item: myDonation.meta.count } })
    }
    if (search && !status && limit && !selected.sort) {
      filterDonation = myDonation.data.filter((data, i) => {
        let checkTitle = regex.test(data.campaign.title)
        if (checkTitle === false) { limit += 1 }
        return checkTitle && (i < Number(limit))
      })
      this.setState({ filterDonation, count: { ori: false, item: filterDonation.length } })
    }
    if (!search && status && limit && !selected.sort) {
      filterDonation = myDonation.data.filter((data, i) => {
        let checkStatus = (Number(data.status) === Number(status))
        if (checkStatus === false) { limit += 1 }
        return checkStatus && (i < Number(limit))
      })
      this.setState({ filterDonation, count: { ori: false, item: filterDonation.length } })
    }
    if (search && status && limit && !selected.sort) {
      filterDonation = myDonation.data.filter((data, i) => {
        let checkTitle = regex.test(data.campaign.title)
        let checkStatus = (Number(data.status) === Number(status))
        if (checkStatus === false || checkTitle === false) { limit += 1 }
        return checkTitle && checkStatus && (i < Number(limit))
      })
      this.setState({ filterDonation, count: { ori: false, item: filterDonation.length } })
    }
  }

  componentDidMount () {
    this.action = { ...this.action, getMyDonations: true }
    let params = {
      filter: {
        // limit: 10,
        offset: 0
      }
    }
    this.props.getMyDonations(params)
    this.props.toogleRequest({ toogle: false })
  }

  componentWillReceiveProps (nextProps) {
    const { myDonation } = nextProps

    if (!myDonation.isFetching && this.action.getMyDonations) {
      this.action = { ...this.action, getMyDonations: false }
      if (myDonation.isFound) {
        let hasMore = myDonation.meta.count > this.state.limit
        let isEmpty = myDonation.meta.count < 1
        this.setState({ myDonation, hasMore, isEmpty }, () => {
          if (this.state.myDonation.isFound) {
            this.filterData()
          }
        })
      }
      if (myDonation.isFailure) {
        let notification = {
          message: myDonation.message,
          position: 'tc',
          level: 'error'
        }
        this.setState({ myDonation, notification })
      }
    }

    if (!myDonation.isFetching && this.action.searchMyDonations) {
      this.action = { ...this.action, searchMyDonations: false }
      if (myDonation.isFound) {
        let hasMore = myDonation.meta.count > this.state.limit
        let isEmpty = myDonation.meta.count < 1
        const textMessage = 'Campaign yg Anda cari tidak ditemukan.'
        this.setState({ myDonation, hasMore, isEmpty, textMessage })
      }
      if (myDonation.isFailure) {
        let notification = {
          message: myDonation.message,
          position: 'tc',
          level: 'error'
        }
        this.setState({ myDonation, notification })
      }
    }
  }

  render () {
    const { myDonation, page, limit, isEmpty, textMessage, modal, selected, status, filterDonation, count, isSort, selectStatus } = this.state
    let sortStatus
    if (selectStatus === '0') {
      sortStatus = 'Diproses'
    } else if (selectStatus === '1') {
      sortStatus = 'Disalurkan'
    } else if (selectStatus === '2') {
      sortStatus = 'Dibatalkan'
    } else if (selectStatus === 'createdAt') {
      sortStatus = 'Terbaru'
    } else if (selectStatus === 'amount') {
      sortStatus = 'Terbanyak'
    } else {
      sortStatus = 'Urutkan'
    }
    return (
      <MainContent>
        <Section className='grey-wrapper'>
          <div className='container'>
            <div className='dashboard-wrap'>
              { <PanelProfile active='history' /> }
              <div className='panel-table'>
                <div className='title-dashboard'>
                  <h1>Donasi Saya</h1>
                </div>
                <div className='datatables-panel'>
                  <div className='filter-wrap'>
                    <div className='search-group'>
                      <input name='search' className='form-control form-search' type='text' placeholder='Cari campaign yang diikuti'
                        onChange={(e) => this.handleSearch(e)} />
                    </div>
                    <div className='sorting-group'>
                      <div className='form-edit'>
                        <input className='form-control select' id='location' type='text' value={sortStatus} onClick={() => this.setState({ isSort: true })} readOnly />
                        <div className='select-wrapper' style={{ display: isSort ? 'block' : 'none' }}>
                          <div className='select-item'>
                            <ul className='ls-select'>
                              <li className='ls-select-items' onClick={() => this.handleSearch({target: {name: 'status', value: '0'}})}><a href='#'>Diproses</a></li>
                              <li className='ls-select-items' onClick={() => this.handleSearch({target: {name: 'status', value: '2'}})}><a href='#'>Dibatalkan</a></li>
                              <li className='ls-select-items' onClick={() => this.handleSearch({target: {name: 'status', value: '1'}})}><a href='#'>Disalurkan</a></li>
                              <li className='ls-select-items' onClick={() => this.handleSearch({target: {name: 'status', value: 'createdAt'}})}><a href='#'>Terbaru</a></li>
                              <li className='ls-select-items' onClick={() => this.handleSearch({target: {name: 'status', value: 'amount'}})}><a href='#'>Terbanyak</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='length-group'>
                      <select className='form-control' name='limit' onChange={(e) => this.handleSearch(e)}>
                        <option value='10'>10</option>
                        <option value='20'>20</option>
                        <option value='50'>50</option>
                        <option value='100'>100</option>
                        <option value=''>All</option>
                      </select>
                    </div>
                  </div>
                  <div id='tableDonate_wrapper' className='dataTables_wrapper form-inline dt-bootstrap no-footer'>
                    <div className='hide'>
                      <div className='dataTables_paginate paging_simple_numbers' id='tableDonate_paginate'>
                        <ul className='pagination'>
                          <li className='paginate_button previous disabled' id='tableDonate_previous'>
                            <a href='#' aria-controls='tableDonate' data-dt-idx={0} tabIndex={0}>Previous</a>
                          </li>
                          <li className='paginate_button active'>
                            <a href='#' aria-controls='tableDonate' data-dt-idx={1} tabIndex={0}>1</a>
                          </li>
                          <li className='paginate_button next disabled' id='tableDonate_next'>
                            <a href='#' aria-controls='tableDonate' data-dt-idx={2} tabIndex={0}>Next</a>
                          </li>
                        </ul>
                      </div>
                      <div className='dataTables_info' id='tableDonate_info' role='status' aria-live='polite'>Showing 1 to 9 of 9 entries</div>
                      <div id='tableDonate_filter' className='dataTables_filter'>
                        <label>Search:<input type='search' className='form-control input-sm' aria-controls='tableDonate' /></label>
                      </div>
                      <div className='dataTables_length' id='tableDonate_length'>
                        <label>Show
                          <select name='tableDonate_length' aria-controls='tableDonate' className='form-control input-sm'>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>
                          entries
                        </label>
                      </div>
                    </div>
                  </div>
                  <table className='table table-donate dataTable no-footer' id='tableDonate' aria-describedby='tableDonate_info'>
                    <thead>
                      <tr role='row'>
                        <th className='sorting_asc' tabIndex={0} aria-controls='tableDonate' rowSpan={1} colSpan={1} aria-sort='ascending' aria-label='Judul Campaign: activate to sort column descending' style={{width: 312}}>Judul Campaign</th>
                        <th className='sorting' tabIndex={0} aria-controls='tableDonate' rowSpan={1} colSpan={1} aria-label='Nominal Donasi: activate to sort column ascending' style={{width: 137}}>Nominal Donasi</th>
                        <th className='sorting' tabIndex={0} aria-controls='tableDonate' rowSpan={1} colSpan={1} aria-label='Tanggal Donasi: activate to sort column ascending' style={{width: 136}}>Tanggal Donasi</th>
                        <th className='sorting' tabIndex={0} aria-controls='tableDonate' rowSpan={1} colSpan={1} aria-label='Status: activate to sort column ascending' style={{width: 136}}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        myDonation.isFound && filterDonation.map((data, i) => {
                          let oddOrEven = (i % 2) === 0
                          return (<RowsData key={i} i={i} oddOrEven={oddOrEven} {...data} />)
                        })
                      }
                    </tbody>
                  </table>
                  {
                    isEmpty
                    ? <EmptyMyDonations textMessage={textMessage} />
                    : <PaginationDonation
                      limit={limit}
                      count={count}
                      page={page}
                      handlePageChange={(num) => this.handlePageChange(num)} />
                  }
                </div>
              </div>
            </div>
          </div>
        </Section>
        <div className='button-fixed-bottom list-filter'>
          <button className='btn btn-orange' onClick={() => this.setState({ modal: { ...modal, sort: !modal.sort } })}>Urutkan</button>
          <button className='btn btn-orange' onClick={() => this.setState({ modal: { ...modal, status: !modal.status } })}>Filter</button>
        </div>
        <ModalSorting
          modal={modal}
          openModal={() => this.setState({ modal: { ...modal, sort: !modal.sort } })}
          selected={selected}
          handleSearch={(e) => this.handleSearch(e)} />
        <ModalFiltering
          modal={modal}
          openModal={() => this.setState({ modal: { ...modal, status: !modal.status } })}
          status={status}
          handleSearch={(e) => this.handleSearch(e)} />
      </MainContent>
    )
  }
}

const PaginationDonation = ({ count, page, handlePageChange, limit }) => (
  <div className='paging-wrap text-center'>
    <div className='btn-group' role='group' aria-label='...'>
      {
        <Pagination
          activePage={page}
          itemsCountPerPage={limit}
          totalItemsCount={count.item}
          pageRangeDisplayed={5}
          onChange={(num) => handlePageChange(num)}
        />
      }
    </div>
  </div>
)

const RowsData = ({ i, campaign, payment, createdAt, oddOrEven, status }) => {
  let statusClass = ['grey', 'cyan', 'red']
  let statusText = ['Diproses', 'Disalurkan', 'Dibatalkan']
  return (
    <tr role='row' className={`${oddOrEven ? 'odd' : 'even'}`}>
      <td className='sorting_1'><Link href={`/${campaign.link}`}><a className='sorting'>{ReadAbleText(campaign.title)}</a></Link></td>
      <td>
        <label className='mobile-view'>Jumlah Donasi:</label>Rp {RupiahFormat(payment.instruction.transfer_amount)}
      </td>
      <td>{moment(createdAt).format('DD MMMM YYYY')}</td>
      <td>
        <label className='mobile-view'>Status:</label> {status !== undefined && <span className={`text-${statusClass[status]}`}>{statusText[status]}</span>}
      </td>
    </tr>
  )
}

const EmptyMyDonations = ({ textMessage }) => (
  <div className='log-form-wrap'>
    <div className='title-log'>
      <div className='activation-wrap'>
        <p style={{ textAlign: 'center' }}>{textMessage}</p>
      </div>
    </div>
  </div>
)

const ModalSorting = ({ modal, openModal, selected, handleSearch }) => {
  return (
    <div className='modal topten' id='kategori' role='dialog' style={{display: `${modal.sort ? 'block' : 'none'}`}}>
      <div className='modal-dialog noscroll' role='document'>
        <div className='modal-content'>
          <div className='modal-body'>
            <div className='modal-category-top'>
              <h1>Urutkan Berdasarkan</h1><a onClick={() => openModal()} className='closed' type='button' data-dismiss='modal' aria-label='Close'><span className='fas fa-times' aria-hidden='true' /></a>
            </div>
            <div className='modal-category-bottom'>
              <ul className='list-unstyled'>
                <li className={selected.sort === 'createdAt' ? 'active' : {}} onClick={() => handleSearch({ target: { value: 'createdAt', name: 'sort' } })}><a href='#'>Terbaru</a></li>
                <li className={selected.sort === 'amount' ? 'active' : {}} onClick={() => handleSearch({ target: { value: 'amount', name: 'sort' } })}><a href='#'>Terbanyak</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ModalFiltering = ({ modal, openModal, status, handleSearch }) => (
  <div className='modal topten' id='filter' role='dialog' style={{display: `${modal.status ? 'block' : 'none'}`}}>
    <div className='modal-dialog noscroll' role='document'>
      <div className='modal-content'>
        <div className='modal-body'>
          <div className='modal-category-top'>
            <h1>Filter</h1><a onClick={() => openModal()} className='closed' type='button' data-dismiss='modal' aria-label='Close'><span className='fas fa-times' aria-hidden='true' /></a>
          </div>
          <div className='modal-category-bottom'>
            <ul className='list-unstyled'>
              <li className={status === '1' ? 'active' : {}} onClick={() => handleSearch({ target: { value: '2', name: 'status' } })}><a href='#'>Dibatalkan</a></li>
              <li className={status === '0' ? 'active' : {}} onClick={() => handleSearch({ target: { value: '0', name: 'status' } })}><a href='#'>Diproses</a></li>
              <li className={status === '2' ? 'active' : {}} onClick={() => handleSearch({ target: { value: '1', name: 'status' } })}><a href='#'>Disalurkan</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const mapStateToProps = (state) => ({
  myDonation: state.myDonation
})

const mapDispatchToProps = (dispatch) => ({
  getMyDonations: (data) => dispatch(UserActions.myDonationRequest(data)),
  toogleRequest: (data) => dispatch(uiActions.toogleRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(History)
