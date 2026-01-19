import { Card } from 'antd'
import { useParams } from 'react-router-dom'

export default function ModuleLandingView() {
  const { module } = useParams()
  return <Card>Module Landing: {module}</Card>
}
