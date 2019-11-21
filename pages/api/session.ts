import Cors from 'micro-cors'
import { NextApiRequest, NextApiResponse } from 'next'

import createSession from '../../utilities/createSession'

// export const config = {
// 	api: {
// 		bodyParser: false,
// 	},
// }

const cors = Cors({
	allowMethods: ['POST', 'HEAD'],
})

function Endpoint(req: NextApiRequest, res: NextApiResponse) {
	// console.log(req.cookies)
	// console.log(req.query)
	// console.log(req.body)
	createSession(req.body).then(() => {
		res.status(200).json({ title: 'Next.js' })
	})
}

// @ts-ignore
export default cors(Endpoint)
