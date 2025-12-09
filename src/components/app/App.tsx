import Root from '@/components/app/Root'
import Project from '@/components/projects/Project'
import ResourceRouter from '@/components/resource/ResourceRouter'
import Article from '@/specific-features/mercure-galant/Article'
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
          <Route path='/projects/mercure-galant/livraisons/:livraison' element={<Livraison />} />
          <Route path='/projects/mercure-galant/articles/:article' element={<Article />} />
        </Route>
      </Routes>
    </HeroUIProvider>
  )
}

// <Route path='/p/aam' element={<Project searchEngine /*engineAnnotationP177AsQueryResult={}*/ />} />
// <Route path='/p/euterpe' element={<Project searchEngine />} />