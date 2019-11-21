import { useState } from 'react'
import { NextPage } from 'next'

import SessionForm from '../components/SessionForm'

import Camera from 'react-html5-camera-photo'
import 'react-html5-camera-photo/build/css/index.css'

import ButtonBase from '@material-ui/core/ButtonBase'
import CameraIcon from '@material-ui/icons/Camera'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
	container: {
		padding: theme.spacing(1),
	},
	camera: {
		display: 'flex',
		flexWrap: 'wrap',
		width: 300,
		height: 300,
		border: '1px dashed #999',
		borderRadius: theme.spacing(4),
	},
	icon: {
		fontSize: theme.typography.fontSize * 5,
		opacity: 0.5,
	},
}))

interface Props {}

const Page: NextPage<Props> = () => {
	const [dataUri, setDataUri] = useState<null | string>(null)
	const [camera, setCamera] = useState(false)

	const classes = useStyles({})

	const handleClick = () => {
		console.log('clicked')
		setCamera(true)
	}

	const content = camera ? (
		<Camera
			onTakePhoto={(dataUri: string) => {
				setCamera(false)
				setDataUri(dataUri)
			}}
		/>
	) : (
		<ButtonBase onClick={handleClick} focusRipple className={classes.camera}>
			{dataUri ? <img src={dataUri} /> : <CameraIcon className={classes.icon} />}
		</ButtonBase>
	)

	return (
		<main className={classes.container}>
			{content}
			<SessionForm />
		</main>
	)
}

export default Page
