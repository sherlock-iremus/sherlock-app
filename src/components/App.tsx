import { Route, Routes, useNavigate } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';
import ErrorPage from './root/ErrorPage';
import Root from './root/Root';
import Resource from './resource/Resource';

export default function App() {
    const navigate = useNavigate();

    return (
        <NextUIProvider navigate={navigate}>
            <Routes>
                <Route element={<Root />} errorElement={<ErrorPage />} path='/'>
                    <Route path='/' element={<Resource />} />
                    <Route path='crabe' element='🦀' />
                </Route>
            </Routes>
        </NextUIProvider>
    );
}