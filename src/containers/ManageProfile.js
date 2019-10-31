import React from 'react'
import {connect} from 'react-redux'
import NotificationSystem from 'react-notification-system'
// import winurl from 'winurl'
// Components
import MainContent from '../containers/MainContent2'
import Section from '../components/Section'
import PanelProfile from './PanelProfile'
import MyImage from '../components/MyImage'
import { Images } from '../themes'
// actions
import { Creators as UserActions } from '../redux/UserRedux'
import { Creators as LocationActions } from '../redux/Location'
import { Creators as uiActions } from '../redux/ui'
// validation
import { isEmail, isPhoneValid, inputPhoneNumber, imageUrl } from '../helpers/input'
var FormData = require('form-data')

class ManageProfile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: props.user,
      cities: props.cities,
      files: {},
      form: {
        name: '',
        email: '',
        phone: '',
        location: '',
        biodata: '',
        profilePhoto: ''
      },
      search: '',
      validation: false,
      validationPhoto: false,
      selectLocation: false,
      notification: {
        message: '',
        position: 'tc',
        level: 'error'
      }
    }
    this._notificationSystem = null
    this.action = { getUser: false, updateUser: false, upload: false, listCities: false }
  }

  _addNotification () {
    if (this._notificationSystem) {
      this._notificationSystem.addNotification(this.state.notification)
    }
  }

  componentDidMount () {
    if (!this.state.cities.isFound) {
      this.action = { ...this.action, listCities: true }
      this.props.listCities()
    }
    this.action = { ...this.action, getUser: true }
    this.props.getUser()
    this.props.toogleRequest({ toogle: false })
  }

  renderValidation (type, textFailed) {
    const { form, validation } = this.state
    let profilePhotoValid = type === 'files' && form.profilePhoto.length > 0
    let nameValid = type === 'name' && form.name.length > 0
    let nameMinValid = type === 'isNameMin' && (form.name.length > 0 ? form.name.length >= 3 && form.name.length <= 30 : true)
    let emailValid = type === 'email' && form.email.length > 0
    let isEmailValid = type === 'isEmail' && (form.email.length > 0 ? isEmail(form.email) : true)
    let phoneValid = type === 'phone' && form.phone.length > 0
    let isPhoneNumber = type === 'isPhone' && (form.phone.length > 0 ? isPhoneValid(form.phone) : true)
    let locationValid = type === 'location' && form.location.length > 0
    let biodataValid = type === 'biodata' && form.biodata.length > 0
    let result = profilePhotoValid || nameValid || nameMinValid || emailValid || isEmailValid || phoneValid || isPhoneNumber || locationValid || biodataValid
    return (
      validation && !result && <span className='text-alert-red'>{textFailed}</span>
    )
  }

  async onDropFile (e) {
    // const imageCompressor = require('../Lib/ImagesCompression')
    // let f = await imageCompressor.compress(files[0])
    let files = e.target.files
    let notification = {
      message: '',
      position: 'tc',
      level: 'error'
    }
    for (let i = 0; i < files.length; i++) {
      let f = files[i]
      if (!this.hasExtension(f.name)) {
        let notification = {
          level: 'error',
          position: 'tc',
          message: this.props.fileTypeError + ' ' + this.props.label
        }
        this.setState({ notification }, () => {
          this._addNotification()
        })
      } else if (f.size > this.props.maxFileSize) {
        let notification = {
          level: 'error',
          position: 'tc',
          message: this.props.fileSizeError + ' ' + this.props.label
        }
        this.setState({ notification }, () => {
          this._addNotification()
        })
      } else if (f.size < this.props.minFileSize) {
        let notification = {
          level: 'error',
          position: 'tc',
          message: this.props.fileMinSizeError
        }
        this.setState({ notification }, () => {
          this._addNotification()
        })
      } else {
        // f['preview'] = winurl.createObjectURL(f)
        let reader = new window.FileReader()
        reader.onloadend = () => {
          f['preview'] = reader.result
          this.setState({
            files: f,
            form: { ...this.state.form, profilePhoto: reader.result },
            // form: { ...this.state.form, profilePhoto: winurl.createObjectURL(f) },
            notification
          })
        }
        reader.readAsDataURL(f)
      }
    }
  }

  hasExtension (fileName) {
    return (new RegExp('(' + this.props.imgExtension.join('|').replace(/\./g, '\\.') + ')$')).test(fileName)
  }

  changePhoto () {
    this.setState({
      files: []
    })
  }

  inputElement (input) {
    this.inputElementPress = input
  }

  triggerFileUpload () {
    this.inputElementPress.click()
  }

  handleInput (e) {
    const { name, value } = e.target
    const { form } = this.state
    form[name] = value
    this.setState({ form })
  }

  handleNumber (e) {
    const { value } = e.target
    const { form } = this.state
    const newState = { form }
    newState.form['phone'] = inputPhoneNumber(value)
    this.setState(newState)
  }

  onSubmit () {
    const { form, files } = this.state
    let filesValid = (Object.keys(files).length > 0)
    let nameValid = form.name.length > 0
    let nameMinValid = (form.name.length > 0 ? form.name.length > 2 : true)
    let emailValid = form.email.length > 0
    let isEmailValid = (form.email.length > 0 ? isEmail(form.email) : true)
    let phoneValid = form.phone.length > 0
    let isPhoneNumber = (form.phone.length > 0 ? isPhoneValid(form.phone) : true)
    let locationValid = form.location.length > 0
    let biodataValid = form.biodata.length > 0
    let profilePhotoValid = form.profilePhoto.length > 0
    let isAllValid = profilePhotoValid && nameValid && nameMinValid && emailValid && isEmailValid && phoneValid && isPhoneNumber && locationValid && biodataValid

    if (isAllValid) {
      let dataImage = new FormData()
      dataImage.append('files', files, files.name)
      dataImage.append('isImageProfile', true)
      if (dataImage && filesValid) {
        this.action = { ...this.action, upload: true }
        this.props.addPhotoUser(dataImage)
      } else {
        this.action = { ...this.action, updateUser: true }
        this.props.updateUserRequest({ ...form })
      }
    } else {
      this.setState({ validation: true })
    }
  }

  componentWillReceiveProps (nextProps) {
    const { user, updateUser, photoUser, cities } = nextProps
    const { isFetching, isFound, isFailure, data } = user

    if (!isFetching && this.action.getUser) {
      this.action = { ...this.action, getUser: false }
      if (isFound) {
        let form = {
          name: data.name ? data.name : '',
          email: data.email ? data.email : '',
          phone: data.phone ? data.phone : '',
          location: data.location ? data.location : '',
          biodata: data.biodata ? data.biodata : '',
          profilePhoto: data.profilePhoto ? data.profilePhoto.id : ''
        }
        this.setState({ user, form })
      }
      if (isFailure) {
        let notification = {
          message: user.message,
          position: 'tc',
          level: 'error'
        }
        this.setState({ user, notification })
        this._addNotification()
      }
    }

    if (!cities.isFetching && this.action.listCities) {
      this.action = { ...this.action, listCities: false }
      if (cities.isFound) {
        this.setState({ cities })
      }
      if (cities.isFailure) {
        let notification = {
          message: cities.message,
          position: 'tc',
          level: 'error'
        }
        this.setState({ cities, notification })
        this._addNotification()
      }
    }

    if (!photoUser.isFetching && this.action.upload) {
      this.action = { ...this.action, upload: false }
      if (photoUser.isFound) {
        this.action = { ...this.action, updateUser: true }
        this.props.updateUserRequest({ ...this.state.form, profilePhoto: photoUser.data[0].id })
      }
      if (photoUser.isFailure) {
        let notification = {
          message: 'Terjadi kesalahan saat upload photo',
          position: 'tc',
          level: 'error'
        }
        this.setState({
          files: {},
          form: { ...this.state.form, profilePhoto: data.profilePhoto ? data.profilePhoto.id : '' },
          notification }, () => {
          this._addNotification()
        })
      }
    }

    if (!updateUser.isFetching && updateUser.isFound && this.action.updateUser) {
      this.action = { ...this.action, updateUser: false }
      if (updateUser.isFound) {
        let notification = {
          message: updateUser.message,
          position: 'tc',
          level: 'success'
        }
        this.setState({ notification }, () => {
          this._addNotification()
          this.action = { ...this.action, getUser: true }
          this.props.getUser()
        })
      }
    }
    if (!updateUser.isFetching && updateUser.isFailure && this.action.updateUser) {
      this.action = { ...this.action, updateUser: false }
      let notification = {
        message: 'Terjadi kesalahan saat edit profile',
        position: 'tc',
        level: 'error'
      }
      this.setState({ updateUser, notification }, () => {
        this._addNotification()
      })
    }
  }

  handleImage () {
    const { files, user } = this.state
    if (user.isFound) {
      if (files.preview) {
        return <MyImage src={files.preview} alt='pict' />
      }
      if (user.data && user.data.profilePhoto) {
        let image = user.data.profilePhoto.path ? imageUrl(user.data.profilePhoto.path) : ''
        return <MyImage src={image} alt='pict' />
      }
      if (user.data && !user.data.profilePhoto && (Object.keys(files).length === 0)) {
        return <MyImage src={Images.donatur} alt='pict' style={{width: '150px', height: 'auto'}} />
      }
    }
    return <MyImage src={Images.donatur} alt='pict' style={{width: '150px', height: 'auto'}} />
  }

  render () {
    const { form, files, cities, selectLocation, search } = this.state
    return (
      <MainContent>
        <NotificationSystem ref={n => (this._notificationSystem = n)} />
        <Section className='grey-wrapper'>
          <div className='container'>
            <div className='dashboard-wrap'>
              { <PanelProfile active='editProfile' /> }
              <div className='panel-table'>
                <div className='title-dashboard'>
                  <h1>Edit Profil</h1>
                </div>
                <div className='edit-wrapper'>
                  <div className='form-edit-wrapper'>
                    <label />
                    <div className='form-edit photo'>

                      <div className='edit-photo-wraplet' onClick={() => this.triggerFileUpload()}>
                        {
                          this.handleImage()
                        }
                        { this.renderValidation('files', 'Mohon Upload foto Anda') }
                        <label className='label-file'>{ (Object.keys(files).length > 0)  ? 'Upload Photo' : 'Ganti Photo'}</label>
                      </div>
                      <div className='note-photo'>
                        <div className='note-photo-text'>Upload Photo berukuran 500KB - 5MB dengan format PNG, JPG, atau JPEG</div>
                      </div>
                      <input
                        style={{ display: 'none' }}
                        type='file'
                        value=''
                        ref={(input) => this.inputElement(input)}
                        name='files'
                        multiple='multiple'
                        onChange={(e) => this.onDropFile(e)}
                        accept={this.props.accept}
                        className={this.props.className} />
                    </div>
                  </div>
                  <div className='form-edit-wrapper'>
                    <label htmlFor='name'>Nama Lengkap</label>
                    <div className='form-edit'>
                      <input onChange={(e) => this.handleInput(e)} name='name' value={form.name} className='input-bg user' type='text' />
                      <br />{ this.renderValidation('name', 'Mohon isi nama Anda') }
                      { this.renderValidation('isNameMin', 'Mohon isi nama min 3 - 30 karakter') }
                    </div>
                  </div>
                  <div className='form-edit-wrapper'>
                    <label htmlFor='email'>Email</label>
                    <div className='form-edit'>
                      <input onChange={(e) => this.handleInput(e)} name='email' value={form.email} className='input-bg mail' type='email' readOnly />
                      <br />{ this.renderValidation('email', 'Mohon isi alamat email Anda') }
                      { this.renderValidation('isEmail', 'Alamat email tidak valid') }
                    </div>
                  </div>
                  <div className='form-edit-wrapper'>
                    <label htmlFor='telephone'>Nomor Telepon</label>
                    <div className='form-edit'>
                      <input onChange={(e) => this.handleNumber(e)} name='phone' value={form.phone} className='input-bg phone' type='text' />
                      <br />{ this.renderValidation('phone', 'Mohon isi nomor telepon Anda') }
                      { this.renderValidation('isPhone', 'Nomor telepon Anda tidak valid') }
                    </div>
                  </div>
                  <div className='form-edit-wrapper'>
                    <label htmlFor='location'>Lokasi</label>
                    <div className='form-edit'>
                      <input className='form-control select' id='location' type='text'
                        value={form.location} onClick={() => this.setState({ selectLocation: !selectLocation })} />
                      {
                        cities.isFound &&
                        <SelectSearch
                          cities={cities}
                          search={search}
                          setSearch={(e) => this.setState({ search: e.target.value })}
                          form={form}
                          selectLocation={selectLocation}
                          selectCities={(cityName) => this.setState({ form: { ...form, location: cityName }, selectLocation: false })} />
                      }
                      { this.renderValidation('location', 'Mohon pilih lokasi Anda') }
                    </div>
                  </div>
                  <div className='form-edit-wrapper'>
                    <label htmlFor='bio'>Biodata Singkat</label>
                    <div className='form-edit'>
                      <textarea className='form-control' onChange={(e) => this.handleInput(e)} name='biodata' value={form.biodata} />
                      { this.renderValidation('biodata', 'Mohon isi biodata Anda') }
                    </div>
                  </div>
                  <div className='form-edit-wrapper'>
                    <div className='form-edit'>
                      <label />
                      <button className='btn btn-orange' onClick={() => this.onSubmit()}>Simpan</button>
                      { (this.action.upload || this.action.updateUser) && <img src={Images.loadingSpinCyan} alt='loading' style={{ paddingLeft: '10px' }} /> }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </MainContent>
    )
  }
}

const SelectSearch = ({ cities, search, setSearch, form, selectLocation, selectCities }) => {
  let filteredCities = cities.data.filter((x) => {
    let regex = new RegExp(search, 'gi')
    return regex.test(x.name)
  })
  return (
    <div className='select-wrapper' style={{ display: `${selectLocation ? 'block' : 'none'}` }}>
      <div className='select-title'>Pilih Lokasi</div>
      <div className='select-search'>
        <input onChange={(e) => setSearch(e)} value={search} name='search' className='form-control' type='text' />
      </div>
      <div className='select-item'>
        <ul className='ls-select'>
          {
            filteredCities.map((city, i) => {
              return (
                <li className='ls-select-items' key={i}
                  onClick={() => selectCities(city.name)}>
                  {city.name}
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}

ManageProfile.defaultProps = {
  accept: 'accept=image/*',
  withLabel: true,
  label: 'ukuran photo maksimal: 5 MB, ekstensi: jpg|png',
  imgExtension: ['.jpg', '.JPG', '.png', '.jpeg'],
  minFileSize: 500000,
  maxFileSize: 5000000,
  fileMinSizeError: 'ukuran photo minimal: 500 KB, ekstensi: jpg|png ',
  fileSizeError: ' ukuran photo terlalu besar, ',
  fileTypeError: ' file ekstensi tidak support'
}

const mapStateToProps = (state) => ({
  user: state.user,
  updateUser: state.updateUser,
  photoUser: state.photoUser,
  cities: state.cities
})

const mapDispatchToProps = (dispatch) => ({
  getUser: () => dispatch(UserActions.userRequest()),
  addPhotoUser: (data) => dispatch(UserActions.addPhotoUserRequest(data)),
  updateUserRequest: (data) => dispatch(UserActions.updateUserRequest(data)),
  listCities: (data) => dispatch(LocationActions.citiesRequest(data)),
  toogleRequest: (data) => dispatch(uiActions.toogleRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ManageProfile)
