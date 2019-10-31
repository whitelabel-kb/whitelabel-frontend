import React from 'react'
import {connect} from 'react-redux'
import Header from '../containers/Header'
import Footer from '../components/Footer'
import { Creators as CompanyActions } from '../redux/Company'

class MainContents extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      company: props.company
    }
  }

  componentDidMount () {
    if (!this.state.company.isFound) {
      this.props.getCompany()
    }
  }

  componentWillReceiveProps (nextProps) {
    const { company } = nextProps
    const { isFetching, isFound, isFailure } = company

    if (!isFetching) {
      if (isFound) {
        this.setState({ company })
      }
      if (isFailure) {
        this.setState({ company })
      }
    }
  }

  render () {
    const { company } = this.state
    const { children } = this.props
    return (
      <div className='main-content'>
        { company.isFound && <Header companyLogo={company.data.companyLogo} companyMobileLogo={company.data.companyMobileLogo} /> }
        { children }
        { company.isFound && <Footer {...company.data} /> }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  company: state.company
})

const mapDispatchToProps = (dispatch) => ({
  getCompany: () => dispatch(CompanyActions.companyRequest())
})

export default connect(mapStateToProps, mapDispatchToProps)(MainContents)
