import Document, { Head, Main, NextScript } from 'next/document'
import Raven from 'raven-js'
import api from '../src/services/Api'
import ReadAbleText from '../src/helpers/ReadAbleText'
import { imageUrl } from '../src/helpers/input'
const FacebookAppId = process.env.FACEBOOK_APP_ID
const RavenSecretKey = process.env.RAVEN_SECRET_KEY
const RavenId = process.env.RAVEN_ID
const GoogleTagManagerId = process.env.GOOGLE_TAG_MANAGER_ID
const favicon = process.env.FAVICON

class HomeDocument extends Document {
  static async getInitialProps (ctx) {
    const props = await Document.getInitialProps(ctx)
    const { query } = ctx
    let link = (query.urlLink && query.urlLink !== 'favicon.ico') ? query.urlLink : null
    let company
    let dataCompany
    try {
      company = await api.create().getCompany()
      dataCompany = company.data.data
    } catch (error) {
      company = null
      dataCompany = null
    }
    if (link) { // if page campaign detail load
      try {
        let campaign = await api.create().getCampaign({ link })
        let dataCampaign = campaign.data.data
        let meta = {
          title: !dataCampaign.title ? '' : dataCampaign.title,
          image: !dataCampaign.mainImage.path ? '' : dataCampaign.mainImage.path,
          description: !dataCampaign.shortDescription ? '' : dataCampaign.shortDescription
        }
        return { ...props, name: ReadAbleText(dataCompany ? dataCompany.name : ''), title: ReadAbleText(meta.title), image: imageUrl(meta.image), description: meta.description }
      } catch (error) {
        return { ...props, name: ReadAbleText(dataCompany ? dataCompany.name : ''), title: ReadAbleText(dataCompany ? dataCompany.name : ''), image: '', description: '' }
      }
    }
    if (!link) {
      return { ...props, name: ReadAbleText(dataCompany ? dataCompany.name : '') }
    }
  }

  constructor (props) {
    super(props)
    Raven.config(`https://${RavenSecretKey}@sentry.io/${RavenId}`).install()
  }

  componentDidCatch (error, errorInfo) {
    Raven.captureException(error, { extra: errorInfo })
  }

  render () {
    const { name, title, image, description } = this.props
    return (
      <html lang={this.props.__NEXT_DATA__.props.lang || 'en'}>
        <Head>
          <meta charSet='UTF-8' />
          <title>{name}</title>
          <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport' />
          <meta name='apple-mobile-web-app-status-bar-style' content='black' />
          <meta key='og-type' property='og:type' content='website' />
          <meta key='fb-id' property='fb:app_id' content={FacebookAppId} />
          <meta key='og-title' property='og:title' content={title} />
          <meta key='og-image' property='og:image' content={image} />
          <meta key='og-image' property='og:image:width' content='300px' />
          <meta key='og-image' property='og:image:height' content='200px' />
          <meta key='og-description' property='og:description' content={description} />
          <link rel='icon' href={favicon} sizes='16x16' />
          <link rel='stylesheet prefetch' href={`/static/css/vendors.min.css`} />
          <link rel='stylesheet prefetch' href={`/static/css/styles.min.css`} />
          <link rel='stylesheet prefetch' href={`/static/css/custom.styles.css`} />
          <link rel='stylesheet prefetch' href={`/static/icons/fontawesome/css/fontawesome-all.css`} />
          <script dangerouslySetInnerHTML={{__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${GoogleTagManagerId}');`}} />
        </Head>
        <body>
          <noscript dangerouslySetInnerHTML={{__html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GoogleTagManagerId}"
          height="0" width="0" style="display:none;visibility:hidden"></iframe>`}} />
          <Main />
          <script src='https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js' />
          <script src={`/static/js/vendors.min.js`} />
          <script src={`/static/js/script.min.js`} />
          <NextScript />

        </body>
      </html>
    )
  }
}

export default HomeDocument
