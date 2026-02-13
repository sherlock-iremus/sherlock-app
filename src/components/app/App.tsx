import Root from '@/components/app/Root'
import Project from '@/components/projects/Project'
import GenericResourceRouter from '@/components/resource/GenericResourceRouter'
import Article from '@/specific-features/mercure-galant/Article'
import Livraison from '@/specific-features/mercure-galant/Livraison'
import Livraisons from '@/specific-features/mercure-galant/Livraisons'
import { RouterProvider } from "@heroui/react";
import type { NavigateOptions } from 'react-router-dom'
import { Route, Routes, useNavigate } from 'react-router-dom'

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export default function App() {
  const navigate = useNavigate();
  return (
    <RouterProvider navigate={navigate}>
      <Routes>
        <Route element={<Root />} path='/'>
          {/* <Route path='/' element={<GenericResourceRouter />} /> */}
          {/* <Route path='/id/:resourceUUID' element={<GenericResourceRouter />} /> */}
          {/* <Route path='/projects/:projectCode' element={<Project searchEngine />} /> */}
          <Route path='/projects/mercure-galant/livraisons' element={<Livraisons />} />
          <Route path='/projects/mercure-galant/livraisons/:livraison' element={<Livraison />} />
          <Route path='/projects/mercure-galant/articles/:article' element={<Article />} />
        </Route>
      </Routes>
    </RouterProvider>
  )
}

// <Route path='/p/aam' element={<Project searchEngine /*engineAnnotationP177AsQueryResult={}*/ />} />