import { Navigate, useParams } from 'react-router-dom'

export default function () {
  const { resourceUUID } = useParams()

  return (
    <Navigate
      to={`/?resource=http://data-iremus.huma-num.fr/id/${resourceUUID}`}
    />
  )
}
