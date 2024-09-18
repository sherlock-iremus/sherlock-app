import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

export default function Root() {
  const [tangela, setTangela] = useState(null)

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon/tangela')
      .then(r => r.json())
      .then(data => {
        setTangela(data.sprites.other.dream_world.front_default)
      })
  })

  return (
    <div className="sherlock-light text-foreground bg-background">
      <header className='h-32 flex flex-row p-6 items-center justify-between'>
        <div className='flex-1'>

        </div>
        <div className='m-10'>
          {tangela && <img className='mt-[89px]' src={tangela} height="69" width="69" />}
        </div>
        <div className='text-center'>
          <h1 className="font-['Albertus'] indent-3 text-3xl tracking-[0.5em]">
            SHERLOCK
          </h1>
          <div className="h-[2px] bg-gradient-to-r mb-1 from-purple-900 to-rose-600" />
          <h2
            className='font-mono text-xs text-gray-500 tracking-wide'
            style={{ fontVariantLigatures: 'discretionary-ligatures' }}
          >
            explorateur de données cidoc crm
          </h2>
        </div>
      </header>

      {/* <div className='divider' /> */}

      <main>
        <Outlet />
      </main>

      {/* <div className='divider' /> */}

      <footer className='p-6'>

      </footer>
    </div>
  )
}