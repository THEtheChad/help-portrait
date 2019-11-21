import { useRouter } from 'next/router'
import { NextPage } from 'next'

interface Props {}

const Post: NextPage<Props> = () => {
  const router = useRouter()
  const { pid } = router.query

  return <p>Post: {pid}</p>
}

export default Post