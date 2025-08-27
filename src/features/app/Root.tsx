
import { useLocation } from "react-router-dom";
import { Outlet } from 'react-router-dom'
import Footer from "./Footer";

export default function Root() {
  let pathname = useLocation().pathname.split('/').filter(x => x)
  const projectName = { 'mercure-galant': 'Mercure Galant', 'aam': 'Association des artistes musiciens' }[pathname[0]]

  return (
    <div className='flex flex-col h-full min-h-screen'>
      {projectName && <header>
        {projectName}
      </header>}
      {/* <main className='flex-1'> */}
      <main>
        <Outlet />
      </main >
      <div className='section-divider' />
      <Footer />
    </div>
  )
}
