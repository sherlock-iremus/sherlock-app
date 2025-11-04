import Root from '@/components/app/Root'
import Project from '@/components/projects/Project'
import ResourceRouter from '@/components/resource/ResourceRouter'
import Livraison from '@/specific-features/mercure-galant/Livraison'
import Livraisons from '@/specific-features/mercure-galant/Livraisons'
import { HeroUIProvider } from "@heroui/react"
import type { NavigateOptions } from 'react-router-dom'
import { Route, Routes, useHref, useNavigate } from 'react-router-dom'

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
          <Route path='/projects/mercure-galant/livraisons' element={<Livraisons />} />
          <Route path='/projects/mercure-galant/livraison/:livraison' element={<Livraison />} />
        </Route>
      </Routes>
    </HeroUIProvider>
  )
}
// <Route path='/p/aam' element={<Project searchEngine /*engineAnnotationP177AsQueryResult={}*/ />} />
// <Route path='/p/euterpe' element={<Project searchEngine />} />
// <Route path='/p/mercure-galant' element={<Project />} />
// <Route path='/p/mercure-galant/article/:article' element={<MercureGalantArticle />} />