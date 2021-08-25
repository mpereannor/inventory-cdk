import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Link from 'next/link'
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/items">
          <a>Items</a>
        </Link>
      </nav>
  <Component {...pageProps} />
    </div>
  )
}
export default MyApp
