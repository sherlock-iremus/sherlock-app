import { Route, Routes, useNavigate } from "react-router-dom"
import { NextUIProvider } from "@nextui-org/react"
import ErrorPage from "./root/ErrorPage"
import Root from "./root/Root"
import Resource from "./resource/Resource"
import Id from "./resource/Id"
import RouteProcessor from './resource/RouteProcessor'

export default function App() {
    const navigate = useNavigate()

    return (
        <NextUIProvider navigate={navigate}>
            <Routes>
                <Route element={<Root />} errorElement={<ErrorPage />} path="/">
                    <Route path="/" element={<Resource />} />
                    <Route path="/id/:resourceUUID" element={<Id />} />
                    <Route path="*" element={<RouteProcessor />} />
                </Route>
            </Routes>
        </NextUIProvider>
    )
}