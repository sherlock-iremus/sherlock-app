import { Route, Routes, useNavigate } from 'react-router-dom'
import { NextUIProvider } from '@nextui-org/react'
import ErrorPage from './ErrorPage'
import Root from './Root'
import Resource from '../features/resource/Resource'
import Id from '../features/resource/Id'
import RouteProcessor from '../features/resource/RouteProcessor'
import MercureGalant from '../features/pages/MercureGalant'

export default function App() {
  const navigate = useNavigate()

  return (
    <NextUIProvider navigate={navigate}>
      <Routes>
        <Route element={<Root />} errorElement={<ErrorPage />} path='/'>
          <Route path='/mercure-galant' element={<MercureGalant />} />
          <Route path='/' element={<Resource />} />
          <Route path='/id/:resourceUUID' element={<Id />} />
          <Route path='*' element={<RouteProcessor />} />
        </Route>
      </Routes>
    </NextUIProvider>
  )
}
