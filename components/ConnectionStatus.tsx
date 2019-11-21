import { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { amber, green } from '@material-ui/core/colors'

import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'

interface Props {
	status: boolean
}

const useStyles = makeStyles(theme => ({
	success: {
		background: green[600],
	},
	error: {
		background: theme.palette.error.light,
	},
	info: {
		background: theme.palette.primary.main,
	},
	warning: {
		background: amber[700],
	},
}))

export default function ConnectionStatus({ status }: Props) {
	const classes = useStyles({})
	const [open, setOpen] = useState(false)

	useEffect(() => {
		setOpen(true)
	}, [status])

	return (
		<Snackbar open={open} onClose={() => setOpen(false)} autoHideDuration={3000}>
			<SnackbarContent
				className={status ? classes.success : classes.warning}
				message={<div style={{ textAlign: 'center' }}>{status ? 'Connected' : 'Disconnected'}</div>}
			/>
		</Snackbar>
	)
}
