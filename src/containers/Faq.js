import React from 'react'
import {connect} from 'react-redux'
import { animateScroll as scroll } from 'react-scroll'
// Components
import MainContent from '../containers/MainContent'
import Section from '../components/Section'
import Container from '../components/Container'
import ReadAbleText from '../helpers/ReadAbleText'
import { Creators as uiActions } from '../redux/ui'

class Faq extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      website: '',
      search: '',
      actived: 0,
      searching: false
    }
  }

  componentDidMount () {
    const website = window.location.href
    this.setState({ website })
    this.props.toogleRequest({ toogle: false })
  }

  getHostName (url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
      return ReadAbleText(match[2])
    } else {
      return url
    }
  }

  guid () {
    function s4 () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
  }

  render () {
    const { company } = this.props
    let { website, search, searching, actived } = this.state
    let listFaq = []
    if (company.isFound) {
      const { name, email, phone } = company.data
      listFaq = [
        {
          question: `Apa itu ${this.getHostName(website)}`,
          answer: `${this.getHostName(website)} adalah website untuk berdonasi secara online milik ${ReadAbleText(name)}. `
        },
        {
          question: `Transfer Tanpa Kode Unik`,
          answer: `Ketika donatur tidak mencantumkan kode unik pada saat transfer, maka donasi tidak akan terverifikasi secara otomatis. Jika ini terjadi pada Anda, Anda wajib melakukan konfirmasi dengan cara mengirimkan bukti transfer melalui email ${email}`
        },
        {
          question: `Cara Donasi Online`,
          answer: [
            {
              question: `Donasi online di website ${this.getHostName(website)}`,
              answer: `Pilih campaign yang Anda minati >> Klik tombol Donasi Sekarang >> Masukkan informasi yang diminta (jumlah donasi, kontak Anda, metode pembayaran)
              Di akhir proses donasi online, Anda akan memperoleh no rekening bank dan tagihan (nominal donasi + kode unik) yang diminta sistem`
            },
            {
              question: `Transfer dengan mencantumkan kode unik pada nominal transfer.`,
              answer: `Mohon transfer tepat sesuai dengan nominal tagihan sistem (mencantumkan kode unik yang diberikan sistem), supaya donasi Anda terverifikasi secara otomatis oleh sistem.
              Kode unik tersebut juga akan diakumulasikan sebagai donasi pada campaign yang Anda maksud.\n`
            },
            {
              question: `Dalam 1 hari kerja, donasi terverifikasi secara otomatis oleh sistem ${this.getHostName(website)}`,
              answer: ''
            }
          ]
        },
        {
          question: `Donasi Cancel`,
          answer: [{
            question: `Apabila saya sudah menerima notifikasi bahwa donasi saya tercancel. Namun, saya masih ingin berdonasi di campaign yang sama. Apa yang harus saya lakukan? Batalkan atau tetap transfer saja ?`,
            answer: `Apabila Anda tetap masih ingin berdonasi di campaign yang sama, mohon mengulangi proses donasi online.
            Supaya Anda mendapatkan kode unik yang baru.\n
            Umumnya, donasi akan terverifikasi dalam 1 hari kerja setelah transfer, kecuali:\n
            1. Kode unik donasi yang dicantumkan salah.\n
            2. Nominal transfer donasi tidak mencantumkan kode unik.\n
            3. Proses transfer melebihi/terlalu dekat deadline transfer.\n
            Apabila Anda sudah melakukan transfer, namun memperoleh notifikasi bahwa donasi Anda dibatalkan, silakan lakukan konfirmasi ke no ${phone} atau ke ${email}`
          }]
        },
        {
          question: `Konfirmasi Donasi`,
          answer: [
            {
              question: `Anda sudah transfer sesuai nominal dengan Kode Unik.`,
              answer: `Anda tidak perlu konfirmasi, donasi akan otomatis terverifikasi sesuai data yang Anda masukkan.`
            },
            {
              question: `Jika Anda melakukan transfer namun tidak mencantumkan kode unik atau memasukkan kode unik yang salah, Anda harus melakukan konfirmasi.`,
              answer: `Konfirmasi dapat dilakukan dengan mengikuti link yang dikirim ke email Anda atau mengirimkan bukti transfer ke email ${email}
              Harap menggunakan email yang Anda input ketika berdonasi online, ketika melakukan konfirmasi.`
            }
          ]
        },
        {
          question: `Donasi Anonim`,
          answer: `Apabila donatur tidak menginginkan namanya dicantumkan pada halaman campaign, silakan klik pilihan untuk berdonasi sebagai anonim setelah memasukkan nominal donasi.\n
              Meski memilih anonim, Anda tetap diwajibkan mengisi data diri yang diminta agar tim ${this.getHostName(website)} tetap dapat melaporkan status donasi dan mendapat update dari Aksi Cepat Tanggap.\n              
              Perlu diketahui bahwa status anonim hanya berlaku pada halaman campaign. Tim ${this.getHostName(website)} masih tetap dapat melihat identitas donasi Anda\n`
        },
        {
          question: `Kesalahan Donasi`,
          answer: [
            {
              question: `1. Transfer tanpa melakukan donasi online terlebih dahulu`,
              answer: `Donatur diwajibkan melakukan donasi online terlebih dahulu untuk memilih campaign spesifik yang diinginkan. Apabila Anda melakukan transfer tanpa berdonasi online, maka dana tersebut akan didistribusikan ke campaign lain milik ${this.getHostName(website)}`
            },
            {
              question: `2. Transfer tanpa mencantumkan kode unik`,
              answer: `Ketika donatur tidak mencantumkan kode unik pada saat transfer, maka donasi tidak akan terverifikasi secara otomatis. Jika ini terjadi pada Anda, Anda wajib melakukan konfirmasi.`
            },
            {
              question: `3. Transfer dengan kode unik yang salah`,
              answer: `Ketika donatur salah dalam mencantumkan kode unik pada saat transfer, maka donasi tidak akan terverifikasi secara otomatis dan dapat tercatat sebagai donasi dari orang lain. `
            },
            {
              question: `4. Transfer setelah melewati / terlalu mepet deadline`,
              answer: `Kami sangat menyarankan agar donatur segera melakukan transfer setelah berdonasi online. Transfer terlalu dekat dengan deadline meningkatkan kemungkinan donasi Anda dibatalkan.\n
              Jika ini terjadi pada Anda, Anda wajib melakukan konfirmasi. `
            },
            {
              question: `5. Menggabungkan donasi menjadi satu kali transfer`,
              answer: `Apabila Anda berdonasi di lebih dari satu campaign, mohon untuk tidak menggabungkan nominal donasi pada satu kali transfer. \n
              Sebagai contoh, apabila Anda berdonasi ke campaign A sebesar Rp 50.105 dan ke campaign B sebesar Rp 50.150, mohon di transfer satu per satu dan tidak digabungkan menjadi Rp 100.255 karena sistem kami tidak akan mengenali transfer tersebut. `
            }
          ]
        }
      ]
    }
    return (
      <MainContent>
        <Section className='grey-wrapper'>
          <Container>
            <div className='row'>
              <div className='col-lg-12'>
                <div className='panel-content-bantuan'>
                  <div className='search-bantuan-wrap mobile'>
                    <input onChange={(e) => this.setState({ search: e.target.value })} value={search} className='form-control' placeholder='Cari Pertanyaanmu' name='search' />
                    <button className='btn btn-orange' onClick={() => this.setState({ searching: true, actived: -1 }, () => scroll.scrollTo(450))}><i className='fas fa-search' /> </button>
                  </div>
                </div>
              </div>
              <div className='col-lg-4'>
                <div className='panel-tabs-wrap'>
                  <ul className='nav nav-tab-bantuan' role='tablist'>
                    {
                      company.isFound && listFaq.map((data, i) => {
                        return (
                          <li key={i} className={`${i === actived ? 'active' : ''}`} role='presentation'>
                            <a href={`#${i}`} aria-controls='umum' role='tab' data-toggle='tab' onClick={() => this.setState({ searching: false, search: '', actived: i })}>{data.question}</a>
                          </li>
                        )
                      })
                    }
                  </ul>
                </div>
              </div>
              <div className='col-lg-8'>
                <div className='panel-content-bantuan'>
                  <div className='search-bantuan-wrap desktop'>
                    <input onChange={(e) => this.setState({ search: e.target.value })} value={search} className='form-control' placeholder='Cari Pertanyaanmu' name='search' />
                    <button className='btn btn-orange' onClick={() => this.setState({ searching: true, actived: -1 })}><i className='fas fa-search' /> Cari</button>
                  </div>
                  <div className='content-bantuan'>
                    <div className='tab-content'>
                      {
                        company.isFound && searching
                        ? <SearchListQuestion listFaq={listFaq} search={search} />
                        : <ListQuestions listFaq={listFaq} actived={actived} />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </MainContent>
    )
  }
}

const ListQuestions = ({ listFaq, actived }) => {
  return listFaq.map((data, i) => {
    let timestamp = new Date().getUTCMilliseconds() * i
    return (
      <div className={`tab-pane ${i === actived ? 'active' : ''}`} id={i} role='tabpanel' key={i}>
        {typeof data.answer !== 'string' && <h1>{data.question}</h1>}
        <div className='panel-group' id='accordion' role='tablist' aria-multiselectable='true'>
          {
            typeof data.answer === 'string'
            ? <div className='panel panel-default'>
              <div className={`panel-heading ${!data.answer && 'no-arrow'}`} id='heading1' role='tab'>
                <h4 className='panel-title'><a role='button' data-toggle='collapse' data-parent='#accordion' href={`#collapse${i}`} aria-expanded='true' aria-controls='collapseOne'>
                  {data.question}</a>
                </h4>
              </div>
              <div className='panel-collapse collapse' id={`collapse${i}`} role='tabpanel' aria-labelledby='heading1'>
                <div className='panel-body'>
                  {data.answer.split('\n').map((item, key) => {
                    return (
                      <span key={key}>
                        {item}
                        <br />
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
            : data.answer.map((val, idx) => {
              let timestamp2 = new Date().getUTCMilliseconds() + idx
              timestamp += timestamp2
              return (
                <div className='panel panel-default' key={idx}>
                  <div className={`panel-heading ${!val.answer && 'no-arrow'}`} id='heading1' role='tab'>
                    <h4 className='panel-title'>
                      <a role='button' data-toggle='collapse' data-parent='#accordion' href={`#collapsed${timestamp}`} aria-expanded='true' aria-controls='collapseOne'>
                        {val.question}
                      </a>
                    </h4>
                  </div>
                  <div className='panel-collapse collapse' id={`collapsed${timestamp}`} role='tabpanel' aria-labelledby='heading1'>
                    <div className='panel-body'>
                      {val.answer.split('\n').map((item, key) => {
                        return (
                          <span key={key}>
                            {item}
                            <br />
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  })
}

const SearchListQuestion = ({ listFaq, search }) => {
  let listQuestion = []
  listFaq.map(data => {
    if (typeof data.answer !== 'string') {
      return data.answer.map(val => listQuestion.push(val))
    } else {
      return listQuestion.push(data)
    }
  })
  let filterFaq = listQuestion.filter((data) => {
    let textSearch = search.split(' ').map(word => `(\\b${word}\\b)`).join('|')
    let regex = new RegExp(textSearch, 'gi')
    return regex.test(data.question)
  })
  return (
    <div className={`tab-pane active`} id='' role='tabpanel'>
      {/* {typeof data.answer !== 'string' && <h1>{data.question}</h1>} */}
      <div className='panel-group' id='accordion' role='tablist' aria-multiselectable='true'>
        {
          filterFaq.map((data, i) => {
            return (
              <div className='panel panel-default' key={i}>
                <div className={`panel-heading ${!data.answer && 'no-arrow'}`} id='heading1' role='tab'>
                  <h4 className='panel-title'><a role='button' data-toggle='collapse' data-parent='#accordion' href={`#collapse${i}`} aria-expanded='true' aria-controls='collapseOne'>
                    {data.question}</a>
                  </h4>
                </div>
                <div className='panel-collapse collapse' id={`collapse${i}`} role='tabpanel' aria-labelledby='heading1'>
                  <div className='panel-body'>
                    { data.answer }
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  company: state.company
})
const mapDispatchToProps = (dispatch) => ({
  toogleRequest: (data) => dispatch(uiActions.toogleRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Faq)
