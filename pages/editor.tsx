import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import clsx from 'clsx'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Grid from '@material-ui/core/Grid'

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'

import { makeStyles } from '@material-ui/core/styles'
import { amber, green } from '@material-ui/core/colors'

import io from 'socket.io-client'
const target = 'http://localhost:4000'

import ConnectionStatus from '../components/ConnectionStatus'

const useStyles = makeStyles(theme => ({
	connected: {
		color: green[600],
	},
	disconnected: {
		color: amber[700],
	},
	indicator: {
		position: 'fixed',
		top: theme.spacing(2),
		right: theme.spacing(2),
	},
}))

interface Props {}

const Page: NextPage<Props> = () => {
	const classes = useStyles({})

	const [sessions, setSessions] = useState<Array<Session>>([])
	const [connected, setStatus] = useState(false)
	const status = connected ? 'connected' : 'disconnected'

	useEffect(() => {
		console.log(`opening socket ${target}`)

		const socket = io(target)
		socket
			.on('connect', () => setStatus(true))
			.on('disconnect', () => {
				sessions.length = 0
				setStatus(false)
			})
			.on('session:add', (session: Session) => {
				console.log('session:add', sessions)
				sessions.push(session)
				setSessions([...sessions])
			})
			.on('session:remove', (session: Session) => {
				console.log(session)
				const idx = sessions.findIndex(s => s.id === session.id)
				sessions.splice(idx, 1)
				setSessions([...sessions])
			})

		const disconnect = () => {
			setSessions([])
			console.log(`closing socket ${target}`)
			socket.close()
		}

		// @ts-ignore
		if (module.hot) {
			console.log('hot module')
			// @ts-ignore
			module.hot.dispose(disconnect)
		}

		return disconnect
	}, [])

	const children = sessions.map((session: Session) => (
		<ListItem key={session.user.name}>
			{session.user.name} {session.isBeingEdited ? 'editing' : 'pending'}
		</ListItem>
	))

	return (
		<main>
			<ConnectionStatus status={connected} />
			<FiberManualRecordIcon className={clsx(classes[status], classes.indicator)} />
			<Grid container>
				<Grid item xs={4} />
				<Grid item xs={4}>
					<List {...{ children }} />
				</Grid>
			</Grid>
		</main>
	)
}

export default Page
