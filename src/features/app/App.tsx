import { Route, Routes } from 'react-router-dom'

import Root from '@/features/app/Root'
import MercureGalantLivraisons from '@/features/mercure-galant/Livraisons'
import MercureGalantLivraison from '@/features/mercure-galant/Livraison'
import MercureGalantArticle from '@/features/mercure-galant/Article'
import Project from '@/features/projects/Project'
import ResourceRouter from '@/features/resource/ResourceRouter'

function App() {
  return (
    <Routes>
      <Route element={<Root />} path='/'>
        <Route path='/p/aam' element={<Project searchEngine /*engineAnnotationP177AsQueryResult={}*/ />} />
        <Route path='/p/euterpe' element={<Project searchEngine />} />
        <Route path='/p/mercure-galant' element={<Project />} />
        <Route path='/p/mercure-galant/livraisons' element={<MercureGalantLivraisons />} />
        <Route path='/p/mercure-galant/livraison/:livraison' element={<MercureGalantLivraison />} />
        <Route path='/p/mercure-galant/article/:article' element={<MercureGalantArticle />} />
        <Route path='/' element={<ResourceRouter />} />
        <Route path='/id/:resourceUUID' element={<ResourceRouter />} />
      </Route>
    </Routes>
  )
}

export default App
