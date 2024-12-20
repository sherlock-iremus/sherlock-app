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
    <div className='bg-background text-foreground sherlock-light'>
      <header className='flex flex-row justify-between items-center bg-background_negative p-6 h-32 select-none'>
        <div className='flex-1'></div>
        <div className='text-center'>
          <h1 className="font-['Albertus'] text-3xl text-foreground_negative tracking-[0.5em] indent-3">
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

      <main>
        <Outlet />
      </main>
    </div>
  )
}
