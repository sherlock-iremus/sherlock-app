import { useGetResourceByBusinessId } from '@/hooks/sherlockSparql'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function () {
    const { article } = useParams()
    const navigate = useNavigate()

    const { data } = useGetResourceByBusinessId(article || '')

    useEffect(() => {
        if (data?.results.bindings[0]['resource'].value) {
            navigate('/?resource=' + data?.results.bindings[0]['resource'].value)
        }
    }, [data?.results.bindings[0]['resource'].value])

    return ''
}