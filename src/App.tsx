import { useEffect } from 'react'
import { useOnline } from './useOnline'
import { useRoute } from './useRoute'
import { TripList } from './components/TripList'
import { TripPage } from './components/TripPage'

export default function App() {
  const online = useOnline()
  const route = useRoute()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route.page])

  return (
    <div className="shell">
      <header className="top">
        <a className="brand" href="#/">
          <img src="/icon.svg" alt="" width={32} height={32} />
          <span>Sonderway</span>
        </a>
        <span className={`status ${online ? 'on' : 'off'}`} title="Your trips are saved on this device either way">
          {online ? 'Online' : 'Offline · saving on device'}
        </span>
      </header>

      <main>{route.page === 'trip' ? <TripPage key={route.id} id={route.id} /> : <TripList />}</main>
    </div>
  )
}
