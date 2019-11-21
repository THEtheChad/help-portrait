import Cors from 'micro-cors'
import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: false,
  },
}

const cors = Cors({
  allowMethods: ['GET', 'HEAD'],
})

function Endpoint(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.cookies)
  console.log(req.query)
  console.log(req.body)
  res.status(200).json({ title: 'Next.js' })
}

// @ts-ignore
export default cors(Endpoint)