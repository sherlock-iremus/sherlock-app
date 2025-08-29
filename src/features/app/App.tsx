import Root from '@/features/app/Root'
import MercureGalantArticle from '@/features/mercure-galant/Article'
import MercureGalantLivraison from '@/features/mercure-galant/Livraison'
import MercureGalantLivraisons from '@/features/mercure-galant/Livraisons'
import Project from '@/features/projects/Project'
import ResourceRouter from '@/features/resource/ResourceRouter'
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
    </HeroUIProvider>
  )
}