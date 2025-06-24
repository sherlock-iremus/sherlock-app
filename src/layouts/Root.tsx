
import { useLocation } from "react-router-dom";
import { Outlet } from 'react-router-dom'

export default function Root() {
  let pathname = useLocation().pathname.split('/').filter(x => x)
  const projectName = { 'mercure-galant': 'Mercure Galant', 'aam': 'Association des artistes musiciens' }[pathname[0]]

  return (
    <div className='flex flex-col min-h-screen'>
      <header className='flex flex-row justify-between items-center bg-black p-6 h-32 text-white select-none'>
        {projectName && <div>
          <div className="font-mono text-stone-300 text-xs lowercase">projet :</div>
          <div className="font-serif text-3xl">{projectName}</div>
        </div>}
        <div className='flex-1'></div>
        <div className='text-center'>
          <h1 className="font-['Albertus'] text-3xl indent-3 tracking-[0.5em]">
            SHERLOCK
          </h1>
          <div className='bg-linear-to-r from-purple-900 to-rose-600 mb-1 h-[2px]' />
          <h2
            className='font-mono text-gray-500 text-xs tracking-wide'
            style={{ fontVariantLigatures: 'discretionary-ligatures' }}
          >
            explorateur de données rdf/cidoc crm
          </h2>
        </div>
      </header>

      <main className='flex-1'>
        <Outlet />
      </main>

      <div className='divider' />
      <footer className='flex bg-stone-50 py-11 border-stone-200 border-t-1 text-stone-400 text-sm'>
        <div className="flex-1 mx-11 text-right">
          <a href="https://musica.hypotheses.org/" target='_blank'>Musica2</a>
          <br />
          <br />
          Consortium en musicologie numérique
          <br />
          IR* Huma-Num, CNRS
        </div>
        <div className='bg-stone-200 w-[1px]'></div>
        <div className='flex-1 mx-11'>
          <a href="https://www.iremus.cnrs.fr/" target='_blank'>Institut de Recherche en Musicologie</a>
          <br />
          <br />
          UMR 8223
          <br />
          CNRS
        </div>
      </footer>
    </div>
  )
}
