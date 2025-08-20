import { Route, Routes } from 'react-router-dom'

import Root from '@/layouts/Root'
import MercureGalantLivraisons from '@/features/mercure-galant/Livraisons'
import MercureGalantLivraison from '@/features/mercure-galant/Livraison'
import MercureGalantArticle from '@/features/mercure-galant/Article'
import Resource from '@/features/resource/Resource'
import Id from '@/features/resource/Id'
import Project from './features/projects/Project'

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
        <Route path='/' element={<Resource />} />
        <Route path='/id/:resourceUUID' element={<Id />} />
      </Route>
    </Routes>
  )
}

export default App
