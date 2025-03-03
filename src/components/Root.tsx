// import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

export default function Root() {
  // const [tangela, setTangela] = useState(null)
  // useEffect(() => {
  //   fetch('https://pokeapi.co/api/v2/pokemon/tangela')
  //     .then(r => r.json())
  //     .then(data => {
  //       setTangela(data.sprites.other.dream_world.front_default)
  //     })
  // })

  return (
    <div className='flex flex-col bg-background min-h-screen text-foreground'>
      <header className='flex flex-row justify-between items-center bg-background_negative p-6 h-32 select-none'>
        <div className='flex-1'></div>
        <div className='text-center'>
          <h1 className="font-['Albertus'] text-foreground_negative text-3xl indent-3 tracking-[0.5em]">
            SHERLOCK
          </h1>
          {/* <div className='m-10'>
            {tangela && <img className='mt-[89px]' src={tangela} height="69" width="69" />}
          </div> */}
          <div className='bg-gradient-to-r from-purple-900 to-rose-600 mb-1 h-[2px]' />
          <h2
            className='font-mono text-gray-500 text-xs tracking-wide'
            style={{ fontVariantLigatures: 'discretionary-ligatures' }}
          >
            explorateur de données rdf/cidoc crm
          </h2>
        </div>
      </header>

      {/* <div className='divider' /> */}

      <main className='flex-1'>
        <Outlet />
      </main>

      <div className='divider' />
      <footer className='flex bg-stone-50 py-11 border-stone-200 border-t-1 text-stone-400 text-sm'>
        <div className='flex-1 mx-11'>
        </div>
        <div className='bg-stone-200 w-[1px]'></div>
        <div className='flex-1 mx-11'></div>
        <div className='bg-stone-200 w-[1px]'></div>
        <div className='flex-1 mx-11'>
          <a href="https://www.iremus.cnrs.fr/" target='_blank'>Institut de Recherche en Musicologie</a>
          <br />
          <br />
          UMR 8223 CNRS
        </div>
      </footer>
    </div>
  )
}
