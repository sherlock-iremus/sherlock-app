import { Route, Routes } from 'react-router-dom'

import Root from '@/layouts/Root'
import MercureGalantLivraisons from '@/features/mercure-galant/Livraisons'
import MercureGalantLivraison from '@/features/mercure-galant/Livraison'
import MercureGalantArticle from '@/features/mercure-galant/Article'
import Resource from '@/features/resource/Resource'
import Id from '@/features/resource/Id'
import { Button } from "@heroui/react"

function App() {
  return (
    <Button
      disableRipple
      className="after:z-[-1] after:absolute relative after:inset-0 bg-background/30 after:bg-background/40 hover:after:opacity-0 shadow-xl px-12 rounded-full after:rounded-full overflow-visible after:content-[''] hover:after:scale-150 after:transition hover:-translate-y-1 after:!duration-500"
      size="lg"
    >
      Press me
    </Button>
    // <Routes>
    //   <Route element={<Root />} path='/'>
    //     <Route path='/mercure-galant/livraisons' element={<MercureGalantLivraisons />} />
    //     <Route path='/mercure-galant/livraison/:livraison' element={<MercureGalantLivraison />} />
    //     <Route path='/mercure-galant/article/:article' element={<MercureGalantArticle />} />
    //     <Route path='/' element={<Resource />} />
    //     <Route path='/id/:resourceUUID' element={<Id />} />
    //   </Route>
    // </Routes>
  )
}

export default App
