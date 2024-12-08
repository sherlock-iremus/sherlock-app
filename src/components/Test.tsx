import { Navigate, useParams } from 'react-router-dom'

export default function () {
  const { resourceUUID } = useParams()

  console.log({ resourceUUID })

  return <div>Caca</div>
}
