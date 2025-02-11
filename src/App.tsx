import { Route, Routes } from 'react-router-dom'
import ErrorPage from './components/ErrorPage'
import Root from './components/Root'
import Resource from '@/features/resource/Resource'
import Id from '@/features/resource/Id'
import RouteProcessor from '@/features/resource/RouteProcessor'
import MercureGalant from '@/features/pages/MercureGalant'
import { Provider as HeroUIProvider } from "@/provider.tsx";

export default function App() {
  return (
    <HeroUIProvider>
      <Routes>
        <Route element={<Root />} errorElement={<ErrorPage />} path='/'>
          <Route path='/mercure-galant' element={<MercureGalant />} />
          <Route path='/' element={<Resource />} />
          <Route path='/id/:resourceUUID' element={<Id />} />
          <Route path='*' element={<RouteProcessor />} />
        </Route>
      </Routes>
    </HeroUIProvider>
  )
}
