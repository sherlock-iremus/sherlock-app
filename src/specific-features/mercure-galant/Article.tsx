import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function () {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        navigate('/?resource=' + location.state.uri)
    }, [])

    return ''
}