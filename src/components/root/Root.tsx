import { Outlet } from 'react-router-dom'

export default function Root() {
  return (
    <div className="sherlock-light text-foreground bg-background">
      <header className='h-32 flex flex-row p-6 items-center justify-between'>
        <div className=''>

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
            explorateur de données cidoc-crm
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