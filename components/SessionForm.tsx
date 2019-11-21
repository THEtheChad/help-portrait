import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'

// import { makeStyles } from '@material-ui/core'

// const useStyles = makeStyles(theme => ({
// 	root: {
// 		padding: 0,
// 	},
// }))

interface Props {}

export default function SessionForm(_props: Props) {
	return (
		<Grid container spacing={1}>
			<Grid item>
				<TextField required id="standard-required" label="Name" margin="normal" />
			</Grid>
		</Grid>
	)
}
