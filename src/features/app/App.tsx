import Root from '@/features/app/Root'
import ResourceRouter from '@/features/resource/ResourceRouter'
import { HeroUIProvider } from "@heroui/react"
import type { NavigateOptions } from 'react-router-dom'
import { Route, Routes, useHref, useNavigate } from 'react-router-dom'
import Project from '@/features/projects/Project'
import Livraisons from '@/specific-features/mercure-galant/Livraisons'
import Livraison from '@/specific-features/mercure-galant/Livraison'

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export default function App() {
  const navigate = useNavigate()

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <Routes>
        <Route element={<Root />} path='/'>
          <Route path='/' element={<ResourceRouter />} />
          <Route path='/id/:resourceUUID' element={<ResourceRouter />} />
          <Route path='/projects/:projectCode' element={<Project searchEngine />} />
          <Route path='/projects/mg-tei/livraisons' element={<Livraisons />} />
          <Route path='/projects/mg-tei/livraison/:livraison' element={<Livraison />} />
        </Route>
      </Routes>
    </HeroUIProvider>
  )
}
// <Route path='/p/aam' element={<Project searchEngine /*engineAnnotationP177AsQueryResult={}*/ />} />
// <Route path='/p/euterpe' element={<Project searchEngine />} />
// <Route path='/p/mercure-galant' element={<Project />} />
// <Route path='/p/mercure-galant/article/:article' element={<MercureGalantArticle />} />