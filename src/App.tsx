import { Route, Routes } from "react-router-dom";

import Root from '@/layouts/Root'
import MercureGalant from '@/features/pages/MercureGalant'
import Resource from '@/features/resource/Resource'
import Id from '@/features/resource/Id'
import RouteProcessor from '@/features/resource/RouteProcessor'

function App() {
  return (
    <Routes>
      <Route element={<Root />} path='/'>
        <Route path='/mercure-galant' element={<MercureGalant />} />
        <Route path='/' element={<Resource />} />
        <Route path='/id/:resourceUUID' element={<Id />} />
        <Route path='*' element={<RouteProcessor />} />
      </Route>
    </Routes>
  );
}

export default App;
