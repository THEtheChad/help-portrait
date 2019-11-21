import fs from 'fs'
import path from 'path'
import util from 'util'
import rimraf from 'rimraf'
import sanitize from 'sanitize-filename'

const { SESSION_DIR } = process.env

if (!SESSION_DIR) {
	throw new Error(`${__filename} requires the SESSION_DIR environment variable`)
}

const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)

interface CreateSessionProps extends Omit<Session, 'id' | 'isBeingEdited'> {
	id?: string
	isBeingEdited?: boolean
}

export default async function(session: CreateSessionProps) {
	const sanitized = sanitize(session.user.name)
	const formatted = sanitized.toLowerCase().replace(' ', '-')

	session.isBeingEdited = false
	session.id = formatted

	const root = CreateFolder(path.resolve(SESSION_DIR!, formatted))

	try {
		await root.operation

		const raw = root.chain(operation => CreateFolder(operation.meta.target, 'raw'))
		const edited = root.chain(operation => CreateFolder(operation.meta.target, 'edited'))
		const info = root.chain(operation =>
			CreateFile(operation.meta.target, 'info.txt', JSON.stringify(session, null, 2)),
		)

		await Promise.all([raw, edited, info])
		console.log(`Session created: ${session.user.name}`)
	} catch (err) {
		if (err.code === 'EEXIST') {
			console.error(`Session exists: ${session.user.name}`)
		} else {
			throw err
		}
	}
}

interface CreateFolderOpts extends OperationOpts {
	meta: { target: string }
}

function CreateFolder(root: string, endpoint?: string) {
	const target = arguments.length === 1 ? root : path.resolve(root, endpoint!)
	console.log(`CreateFolder: ${target}`)

	return new Operation<CreateFolderOpts>({
		name: 'CreateFolder',
		meta: { target },
		action: () => mkdir(target),
		revert: () =>
			new Promise((resolve, reject) => {
				console.error(`Reverting CreateFolder: ${target}`)
				rimraf(target, (err: any) => (err ? reject(err) : resolve()))
			}),
	})
}

interface CreateFileOpts extends OperationOpts {
	meta: { target: string }
}

function CreateFile(root: string, filename?: string, contents?: string) {
	const target = arguments.length === 1 ? root : path.resolve(root, filename!)
	console.log(`CreateFile: ${target}`)

	return new Operation<CreateFileOpts>({
		name: 'CreateFile',
		meta: { target },
		action: () => writeFile(target, contents),
		revert: () =>
			new Promise((resolve, reject) => {
				console.error(`Reverting CreateFile: ${target}`)
				rimraf(target, (err: any) => (err ? reject(err) : resolve()))
			}),
	})
}

interface OperationOpts {
	name: string
	meta: object
	revert: (err: Error) => Promise<any>
	action: () => Promise<any>
}

class Operation<T extends OperationOpts> {
	name: T['name']
	meta: T['meta']
	revert: T['revert']
	operation: Promise<any>

	constructor(opts: OperationOpts) {
		this.name = opts.name
		this.meta = opts.meta
		this.revert = opts.revert

		this.operation = opts.action()
	}

	chain<S extends OperationOpts>(creator: (operation: Operation<T>) => Operation<S>): Promise<Operation<S>> {
		return this.operation.then(() => {
			const next = creator(this)
			next.operation.catch((err: Error) => this.revert(err))
			return next
		})
	}
}
