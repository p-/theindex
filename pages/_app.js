import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import 'react-toastify/dist/ReactToastify.min.css'
// custom css
import '../styles/global.css'

import { SessionProvider, useSession } from 'next-auth/react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import Loader from '../components/loading'
import { SWRConfig } from 'swr'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/layout/Layout'
import { isAdmin, isEditor, isLogin } from '../lib/session'
import NotAdmin from '../components/layout/NotAdmin'
import NotLogin from '../components/layout/NotLogin'
import NoScriptAlert from '../components/alerts/NoScriptAlert'
import { toast } from 'react-toastify'
import ReactTooltip from 'react-tooltip'

library.add(fab, fas, far)

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      console.log('changing to ' + url)

      fetch('/api/stats/pageview', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
        .then(async (r) => {
          if (r.status !== 200) {
            console.warn('Failed to post page stat: Error', r.status)
          }
        })
        .catch((e) => {
          console.warn('Failed to post page stat: Error', e)
        })
        .finally(() => {
          ReactTooltip.rebuild()
        })
    }

    // when page is loaded via direct http request, there is no route change via JS, need to manually trigger
    handleRouteChange(router.asPath)

    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe from the event with the `off` method:
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  })

  return (
    <SessionProvider session={pageProps.session} refetchInterval={5 * 60}>
      <SWRConfig
        value={{
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => {
              if (res.status !== 200) {
                toast.error(
                  <div>
                    <div>
                      <code>{res.status}</code> - Error
                    </div>
                    <code>{key}</code>
                  </div>
                )
                throw new Error('Failed to fetch api endpoint :(')
              }

              return res.json()
            }),
          onError: (error, key) => {
            console.error('SWR errored:', error, 'at path', key)
          },
        }}
      >
        <Layout>
          <Auth auth={Component.auth}>
            <noscript>
              <NoScriptAlert />
            </noscript>

            <Component {...pageProps} />
          </Auth>
        </Layout>
      </SWRConfig>
    </SessionProvider>
  )
}

// login protected pages
function Auth({ auth, children }) {
  const { data: session, status } = useSession()

  // no auth required
  if (typeof auth === 'undefined' || auth === null) {
    return children
  } else if (status === 'loading') {
    return <Loader />
  } else if (!isLogin(session)) {
    return <NotLogin />
  } else if (auth.requireAdmin && !isAdmin(session)) {
    return <NotAdmin />
  } else if (auth.requireEditor && !isEditor(session)) {
    return <NotAdmin />
  }

  return children
}
