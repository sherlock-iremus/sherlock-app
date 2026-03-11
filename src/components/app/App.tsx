import Root from '@/components/app/Root'
import Project from '@/components/projects/Project'
import GenericResourceRouter from '@/components/resource/GenericResourceRouter'
import { RouterProvider } from "@heroui/react"
import type { NavigateOptions } from 'react-router-dom'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { routes as mercure_galant_routes } from '@/specific-features/mercure-galant/routes'

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
          <Route path='/' element={<GenericResourceRouter />} />
          <Route path='/id/:resourceUUID' element={<GenericResourceRouter />} />
          <Route path='/projects/:projectCode' element={<Project searchEngine />} />
          {...mercure_galant_routes}
        </Route>
      </Routes>
    </RouterProvider>
  )
}

// <Route path='/p/aam' element={<Project searchEngine /*engineAnnotationP177AsQueryResult={}*/ />} />